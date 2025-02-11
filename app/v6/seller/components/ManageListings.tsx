import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../functions/firebase';
import { EditAlgoForm } from './EditAlgoForm';
import { Identity, Algo } from '../../../types';

interface ManageListingsProps {
  algos: Algo[];
  unverifiedAlgos: Algo[];
  onDelete: () => void;
}

export function ManageListings({ algos = [], unverifiedAlgos = [], onDelete }: ManageListingsProps) {
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [selectedAlgo, setSelectedAlgo] = React.useState<Algo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const deleteOldFile = async (filePath: string) => {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      console.log('Successfully deleted file:', filePath);
    } catch (error: any) {
      console.error('Error deleting file:', error.message, 'Path:', filePath);
    }
  };

  const handleDelete = async (algo: Algo) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! All associated files will also be deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        console.log('Starting deletion process for algo:', algo);
        toast.info("Deleting algorithm...", { autoClose: false });

        if (algo.identity === Identity.Internal) {
          // Delete files from blob storage
          const filesToDelete = [
            { path: algo.md_path, folder: 'File' },
            { path: algo.image_path, folder: 'Algos_Images' },
            { path: algo.app_path, folder: 'Bots' }
          ];

          if (algo.screenshots?.length > 0) {
            algo.screenshots.forEach(screenshot => {
              filesToDelete.push({
                path: screenshot.path,
                folder: 'Algos_Images'
              });
            });
          }

          // Delete all files
          await Promise.all(
            filesToDelete.map(file => 
              fetch('/api/storage', {
                method: 'DELETE',
                body: JSON.stringify({
                  path: file.path,
                  folder: file.folder,
                  access: 'private'
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
            )
          );
        }

        // Find which collection the algo is in
        let collectionName;
        const isInUnverified = unverifiedAlgos.some(a => a.id === algo.id);
        const isInAlgos = algos.some(a => a.id === algo.id);

        if (isInUnverified) {
          collectionName = 'unverifiedalgos';
        } else if (isInAlgos) {
          collectionName = 'algos';
        } else {
          throw new Error('Algorithm not found in any collection');
        }

        console.log('Deleting from collection:', collectionName);
        await deleteDoc(doc(db, collectionName, algo.id));

        const userRef = doc(db, "users", algo.sellerId);
        const userDoc = await getDoc(userRef);
        const currentActivities = userDoc.data()?.activities2 || [];

        // Add deletion activity
        await updateDoc(userRef, {
          activities2: [
            {
              title: "Algorithm Deleted",
              description: `Deleted algorithm: ${algo.name}`,
              timestamp: new Date().toISOString()
            },
            ...currentActivities
          ].slice(0, 5)
        });

        toast.dismiss();
        toast.success('Algorithm deleted successfully');
        
        // Call onDelete to refresh the data
        onDelete();
        window.location.reload();

      } catch (error) {
        console.error('Error in deletion process:', error);
        toast.dismiss();
        toast.error('Failed to delete algorithm');
      }
    }
  };

  const handleEdit = (algo: Algo) => {
    setSelectedAlgo(algo);
    setShowEditForm(true);
  };

  const allAlgos = [...(Array.isArray(algos) ? algos : []), ...(Array.isArray(unverifiedAlgos) ? unverifiedAlgos : [])];
  
  // Pagination calculations
  const totalPages = Math.ceil(allAlgos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlgos = allAlgos.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (showEditForm && selectedAlgo) {
    return (
      <EditAlgoForm 
        algo={selectedAlgo} 
        onSuccess={() => setShowEditForm(false)}
        onCancel={() => setShowEditForm(false)}
        unverifiedAlgos={unverifiedAlgos}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Manage Listings</h2>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date Uploaded</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAlgos.length > 0 ? (
              currentAlgos.map(algo => (
                <tr key={algo.id}>
                  <td>{algo.name}</td>
                  <td>{new Date(algo.uploaded).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${unverifiedAlgos.some(a => a.id === algo.id) ? 'bg-warning' : 'bg-success'}`}>
                      {unverifiedAlgos.some(a => a.id === algo.id) ? 'Pending Approval' : 'Approved'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-link text-primary me-2"
                      onClick={() => handleEdit(algo)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="btn btn-link text-danger"
                      onClick={() => handleDelete(algo)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No algorithms found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {startIndex + 1} to {Math.min(endIndex, allAlgos.length)} of {allAlgos.length} entries
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="small" />
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li 
                    key={index + 1} 
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="small" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 