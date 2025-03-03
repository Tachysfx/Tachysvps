"use client"

import CardSideBar from '../../components/SideBar';
import ReactMarkdown from 'react-markdown';
import { db } from '../../functions/firebase';
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { UnverifiedAlgo, Role } from '../../types'; 
import { useEffect, useState } from 'react';

function formatDate(date: string | Date): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function fetchMarkdownContent(filePath: string | undefined) {
    if (!filePath) {
        return 'No content available';
    }

    try {
        // Extract just the filename from the full path
        const fileName = filePath.split('/').pop();
        if (!fileName) {
            throw new Error('Invalid file path');
        }
        
        // Use absolute URL for server component
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/markdown?path=${fileName}`, {
            cache: 'no-store' // Disable caching to always get fresh content
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch markdown content');
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return 'Failed to load content';
    }
}

export default async function Page({ params }: {params: Promise< {id: string}>}) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const sessionData = sessionStorage.getItem('user');
        if (sessionData) {
            const userData = JSON.parse(sessionData);
            if (userData.role === Role.Admin) {
                setIsAdmin(true);
            }
        }
    }, []);

    const handleApprove = () => {
        // Placeholder function for approving the algorithm
        console.log('Approve function to be implemented');
    };

    // Try to fetch from unverifiedalgos first
    let algoRef = doc(db, "unverifiedalgos", (await params).id);
    let algoSnap = await getDoc(algoRef);
    
    // If not found in unverifiedalgos, try algos collection
    if (!algoSnap.exists()) {
        algoRef = doc(db, "algos", (await params).id);
        algoSnap = await getDoc(algoRef);
        
        if (!algoSnap.exists()) {
            return <div>Algorithm not found</div>;
        }
    }

    const algoData = algoSnap.data();
    const isFromAlgos = !algoSnap.ref.parent.id.includes('unverified');

    // Handle field mapping based on which collection it's from
    const enrichedAlgo = {
        id: algoSnap.id,
        ...algoData,
        // For algos collection: description is short description, md_description is full description
        // For unverifiedalgos: shortDescription and description are already correct
        markdownPath: isFromAlgos ? algoData.md_description : algoData.description,
        description: isFromAlgos ? algoData.description : algoData.shortDescription
    } as UnverifiedAlgo & { markdownPath: string };

    // Get the markdown content
    let markdownContent;
    try {
        markdownContent = await fetchMarkdownContent(enrichedAlgo.markdownPath);
    } catch (error) {
        console.error('Error fetching markdown:', error);
        markdownContent = enrichedAlgo.description || 'Failed to load content';
    }

    const author = `/v6/seller?id=${enrichedAlgo.sellerId}`;

    return (
        <>
            <div className="border-bottom border-2">
                <div className="d-flex align-items-center">
                    <h3 className="mx-2 text-purple">{enrichedAlgo.name} </h3>
                    <div className="ms-2">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={
                                    index < Math.round(Number(enrichedAlgo.rating))
                                        ? "text-warning"
                                        : ""
                                }
                            />
                        ))}
                    </div>
                    <div className="ms-auto me-2">
                        <span className="badge bg-warning">Pending Approval</span>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <div className="text-center my-4">
                    <button className="btn btn-success" onClick={handleApprove}>
                        Approve Algorithm
                    </button>
                </div>
            )}

            <div className="container-fluid">
                <div className="row">
                    {/* Left Column */}
                    <div className="d-none d-lg-block col-lg-2 border-end border-2 px-0">
                        <div className="content-left px-2">
                            <div className="text-center mt-3">
                                <Image
                                    src={enrichedAlgo.image.url}
                                    width={170}
                                    height={170}
                                    alt={enrichedAlgo.name}
                                    className="mx-auto"
                                />
                                <p className="fw-bolder my-0">${enrichedAlgo.buy_price}</p>
                                <div className="my-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon
                                            key={index}
                                            icon={faStar}
                                            className={
                                                index < Math.round(Number(enrichedAlgo.rating))
                                                    ? "text-warning"
                                                    : ""
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="uncut">
                                <p className="mb-1">Type: {enrichedAlgo.type}</p>
                                <p className="mb-1">Seller: {enrichedAlgo.sellerName}</p>
                                <p className="mb-1">Published: {formatDate(enrichedAlgo.uploaded)}</p>
                                <p className="mb-1">Updated: {formatDate(enrichedAlgo.updated)}</p>
                                <p className="mb-1">Version: {enrichedAlgo.version}</p>
                                <p className="mb-1">Downloads: {enrichedAlgo.downloads || 0}</p>
                                <Link href={author} type='button' className="btn btn-sm btn-outline-purple mb-5">other algos from this seller</Link>
                            </div>
                            <hr />
                            <CardSideBar />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-12 col-lg-10">
                        <div className="content-right">
                            <div className="markdown-content">
                                <ReactMarkdown>
                                    {markdownContent}
                                </ReactMarkdown>
                            </div>
                            <div className="text-center mb-4">
                                <div id="carouselExampleAutoplaying" className="carousel carousel-fade slide mb-4" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {enrichedAlgo.screenshots?.map((screenshot, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                                <Image
                                                    src={screenshot.url}
                                                    alt={`Screenshot ${index + 1}`}
                                                    width={800}
                                                    height={600}
                                                    className="d-block w-100"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}