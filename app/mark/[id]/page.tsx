"use client"

import CardSideBar from '../../components/SideBar';
import ReactMarkdown from 'react-markdown';
import { db } from '../../functions/firebase';
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { UnverifiedAlgo, Role, Algo } from '../../types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../loading';

function formatDate(date: string | Date): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function fetchMarkdownContent(mdData: { url: string, path: string } | undefined) {
    if (!mdData?.url) {
        return 'No content available';
    }

    try {
        // Get the current user's session
        const sessionData = sessionStorage.getItem('user');
        if (!sessionData) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(mdData.url);
        if (!response.ok) {
            throw new Error('Failed to fetch markdown content');
        }

        const text = await response.text();
        return text || 'No content available';
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return 'Failed to load content';
    }
}

export default function Page({ params }: {params: Promise< {id: string}>}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [algoData, setAlgoData] = useState<(Algo | UnverifiedAlgo) & { markdownPath?: string }>();
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const sessionData = sessionStorage.getItem('user');
                if (!sessionData) {
                    setError('Please login to view this content');
                    return;
                }

                const userData = JSON.parse(sessionData);
                setIsAdmin(userData.role === Role.Admin);

                // Try to fetch from unverifiedalgos first
                let algoRef = doc(db, "unverifiedalgos", (await params).id);
                let algoSnap = await getDoc(algoRef);
                let isFromAlgos = false;
                
                // If not found in unverifiedalgos, try algos collection
                if (!algoSnap.exists()) {
                    algoRef = doc(db, "algos", (await params).id);
                    algoSnap = await getDoc(algoRef);
                    isFromAlgos = true;
                    
                    if (!algoSnap.exists()) {
                        setError('Algorithm not found');
                        return;
                    }
                }

                const data = algoSnap.data();
                
                if (isFromAlgos) {
                    // Handle verified algo
                    const verifiedAlgo = {
                        ...data,
                        id: algoSnap.id,
                        markdownPath: data.md_path,
                        markdownUrl: data.md_description
                    } as Algo & { markdownPath: string, markdownUrl: string };
                    setAlgoData(verifiedAlgo);

                    // Fetch markdown content using URL
                    const content = await fetchMarkdownContent({
                        url: data.md_description,
                        path: data.md_path
                    });
                    setMarkdownContent(content);
                } else {
                    // Handle unverified algo
                    const unverifiedAlgo = {
                        ...data,
                        id: algoSnap.id,
                        markdownPath: data.md.path,
                        markdownUrl: data.md.url
                    } as UnverifiedAlgo & { markdownPath: string, markdownUrl: string };
                    setAlgoData(unverifiedAlgo);

                    // Fetch markdown content using URL
                    const content = await fetchMarkdownContent(data.md);
                    setMarkdownContent(content);
                }

            } catch (error) {
                console.error('Error loading algorithm:', error);
                setError('Failed to load algorithm data');
                toast.error('Failed to load algorithm data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [(params)]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-center p-4">{error}</div>;
    }

    if (!algoData) {
        return <div className="text-center p-4">No data available</div>;
    }

    const author = `/v6/seller?id=${algoData.sellerId}`;

    return (
        <>
            <div className="border-bottom border-2">
                <div className="d-flex align-items-center">
                    <h3 className="mx-2 text-purple">{algoData.name} </h3>
                    <div className="ms-2">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={
                                    index < Math.round(Number(algoData.rating))
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

            <div className="container-fluid">
                <div className="row">
                    {/* Left Column */}
                    <div className="d-none d-lg-block col-lg-2 border-end border-2 px-0">
                        <div className="content-left px-2">
                            <div className="text-center mt-3">
                                <Image
                                    src={algoData.image.url}
                                    width={170}
                                    height={170}
                                    alt={algoData.name}
                                    className="mx-auto"
                                />
                                <p className="fw-bolder my-0">${algoData.buy_price}</p>
                                <div className="my-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon
                                            key={index}
                                            icon={faStar}
                                            className={
                                                index < Math.round(Number(algoData.rating))
                                                    ? "text-warning"
                                                    : ""
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="uncut">
                                <p className="mb-1">Type: {algoData.type}</p>
                                <p className="mb-1">Seller: {algoData.sellerName}</p>
                                <p className="mb-1">Published: {formatDate(algoData.uploaded)}</p>
                                <p className="mb-1">Updated: {formatDate(algoData.updated)}</p>
                                <p className="mb-1">Version: {algoData.version}</p>
                                <p className="mb-1">Downloads: {algoData.downloads || 0}</p>
                                {/* <Link href={author} type='button' className="btn btn-sm btn-outline-purple mb-5">other algos from this seller</Link> */}
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
                                        {algoData.screenshots?.map((screenshot, index) => (
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