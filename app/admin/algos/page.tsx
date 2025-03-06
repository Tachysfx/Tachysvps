"use client";

import { useEffect, useState } from 'react';
import { db } from '../../functions/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Algo, UnverifiedAlgo, Cost } from '../../types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default function AdminAlgosPage() {
  const [totalAlgos, setTotalAlgos] = useState(0);
  const [verifiedAlgos, setVerifiedAlgos] = useState(0);
  const [freeAlgos, setFreeAlgos] = useState(0);
  const [premiumAlgos, setPremiumAlgos] = useState(0);
  const [unverifiedAlgos, setUnverifiedAlgos] = useState<UnverifiedAlgo[]>([]);
  const [unverifiedCount, setUnverifiedCount] = useState(0);

  const fetchData = async () => {
    const algosSnapshot = await getDocs(collection(db, 'algos'));
    const unverifiedAlgosSnapshot = await getDocs(collection(db, 'unverifiedalgos'));

    const algos = algosSnapshot.docs.map(doc => doc.data() as Algo);
    const unverified = unverifiedAlgosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UnverifiedAlgo));

    setTotalAlgos(algos.length + unverified.length);
    setVerifiedAlgos(algos.length);
    setFreeAlgos(algos.filter(algo => algo.cost === Cost.Free).length);
    setPremiumAlgos(algos.filter(algo => algo.cost === Cost.Premium).length);
    setUnverifiedAlgos(unverified);
    setUnverifiedCount(unverified.length);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (algo: UnverifiedAlgo) => {
    try {
      // Convert UnverifiedAlgo to Algo type
      const verifiedAlgo: Partial<Algo> = {
        ...algo,
        description: algo.shortDescription,
        descriptionHTML: '', // Will be generated from md content
        md_description: algo.md.url,
        md_path: algo.md.path,
      };

      // Remove UnverifiedAlgo specific fields
      delete (verifiedAlgo as any).md;
      delete (verifiedAlgo as any).shortDescription;

      // Add to algos collection
      await setDoc(doc(db, 'algos', algo.id), verifiedAlgo);
      
      // Delete from unverifiedalgos collection
      await deleteDoc(doc(db, 'unverifiedalgos', algo.id));

      toast.success('Algorithm approved successfully');
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error approving algo:', error);
      toast.error('Failed to approve algorithm');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Admin Algos Dashboard</h1>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Algos</h5>
              <p className="card-text">{totalAlgos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Verified Algos</h5>
              <p className="card-text">{verifiedAlgos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Free Algos</h5>
              <p className="card-text">{freeAlgos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Premium Algos</h5>
              <p className="card-text">{premiumAlgos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Approval</h5>
              <p className="card-text">{unverifiedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3">Unverified Algos</h2>
      <table className="table table-hover mb-5">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Seller</th>
            <th>Date Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {unverifiedAlgos.map(algo => (
            <tr key={algo.id}>
              <td>{algo.name}</td>
              <td>{algo.sellerName}</td>
              <td>{new Date(algo.uploaded).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                  <Link 
                    href={`/mark/${algo.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <FontAwesomeIcon icon={faEye} /> Preview
                  </Link>
                  <button
                    onClick={() => handleApprove(algo)}
                    className="btn btn-outline-success btn-sm"
                    title="Approve algorithm"
                  >
                    <FontAwesomeIcon icon={faCheck} /> Approve
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
