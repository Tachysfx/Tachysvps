'use client';

import { Star, CheckCircle } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import Deep from "../lib/Me";
import More from "./More";
import CardSideBar from "./SideBar";
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const UnauthorizedMessage = ({ openAuthModal }: { openAuthModal: () => void }) => (
  <button 
    onClick={openAuthModal}
    className="text-danger fw-bold hover:text-purple-800 transition-colors text-sm"
  >
    Login to download
  </button>
);

type AlgoDetailsProps = {
  enrichedAlgo: any; // Replace 'any' with your actual type
  enrichedAlgos: any[]; // Replace 'any' with your actual type
  id: string;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex flex-row justify-center text-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={index < Math.round(Number(rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        size={16}
      />
    ))}
  </div>
);

export default function AlgoDetails({ enrichedAlgo, enrichedAlgos, id }: AlgoDetailsProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  
  const openAuthModal = () => setIsAuthModalOpen(true);
  const download = `/market/${id}/download`;
  const author = '/seller';

  useEffect(() => {
    const userSession = sessionStorage.getItem('user');
    setIsLoggedIn(!!userSession);
  }, []);

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      if (enrichedAlgo.identity === "Internal" && enrichedAlgo.md_description) {
        try {
          // Since md_description is now a full blob storage URL
          const response = await fetch(enrichedAlgo.md_description);
          if (!response.ok) throw new Error('Failed to fetch markdown content');
          const content = await response.text();
          setMarkdownContent(content);
        } catch (error) {
          console.error('Error fetching markdown content:', error);
          setMarkdownContent('Failed to load content');
        }
      }
    };

    fetchMarkdownContent();
  }, [enrichedAlgo.identity, enrichedAlgo.md_description]);

  const renderContent = () => {
    if (enrichedAlgo.identity === "External") {
      return (
        <div 
          className="descriptionHTML" 
          dangerouslySetInnerHTML={{ __html: enrichedAlgo.descriptionHTML || '' }} 
        />
      );
    } else if (enrichedAlgo.identity === "Internal") {
      if (!markdownContent) {
        return <p>Loading content...</p>;
      }
      return (
        <div className="markdown-content prose prose-purple max-w-none">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      );
    }
    return null;
  };

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    try {
      const userSession = sessionStorage.getItem('user');
      if (!userSession) {
        toast.error('Please sign in to continue');
        return;
      }

      const userData = JSON.parse(userSession);
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: enrichedAlgo.buy_price,
          type: 'payment',
          description: `Purchase of ${enrichedAlgo.name} algorithm`,
          customerEmail: userData.email,
          metadata: {
            algoId: id,
            sellerId: enrichedAlgo.sellerId,
            algoName: enrichedAlgo.name
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };

  const renderActionButton = () => {
    if (!isLoggedIn) {
      return <UnauthorizedMessage openAuthModal={openAuthModal} />;
    }

    if (enrichedAlgo.cost === "Premium" && !enrichedAlgo.paid) {
      return (
        <button onClick={handlePurchase} className="btn btn-purple">
          Buy for ${enrichedAlgo.buy_price}
        </button>
      );
    }

    return (
      <Link href={download} type="button" className="btn btn-purple">
        Download
      </Link>
    );
  };

  return (
    <>
      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header py-1">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{enrichedAlgo.name}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body uncut py-1">
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Seller: 
                </span>
                {enrichedAlgo.sellerName}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Type: 
                </span>
                {enrichedAlgo.type}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Platform: 
                </span>
                {enrichedAlgo.platform}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Ratings: 
                </span>
                {enrichedAlgo.rating}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Published: 
                </span>
                {enrichedAlgo.identity === "Internal" ? formatDate(enrichedAlgo.uploaded) : enrichedAlgo.uploaded}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Updated: 
                </span>
                {enrichedAlgo.identity === "Internal" ? formatDate(enrichedAlgo.updated) : enrichedAlgo.updated}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Version: 
                </span>
                {enrichedAlgo.version}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Downloads: 
                </span>
                {enrichedAlgo.downloads}
              </p>
              <p className="mb-1">
                <span className="fw-bold text-purple">
                  <CheckCircle className='inline-block me-2 text-purple' size={16}/>
                  Price: 
                </span>
                ${enrichedAlgo.buy_price}
              </p>
            </div>
            <div className="modal-footer py-1">
              <button type="button" className="btn btn-sm btn-outline-purple" data-bs-dismiss="modal">Close</button>
              {isLoggedIn ? (
                enrichedAlgo.cost === "Premium" && !enrichedAlgo.paid ? (
                  <button onClick={handlePurchase} className="btn btn-sm btn-purple">
                    Buy for ${enrichedAlgo.buy_price}
                  </button>
                ) : (
                  <Link type="button" href={download} className="btn btn-sm btn-purple">Download</Link>
                )
              ) : (
                <UnauthorizedMessage openAuthModal={openAuthModal} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-bottom border-2">
        <div className="d-flex align-items-center">
          <h3 className="mx-2 text-purple">{enrichedAlgo.name} </h3>
          <StarRating rating={enrichedAlgo.rating} />
          <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-sm btn-outline-purple ms-auto">Details...</button>
        </div>
      </div>

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
                  <StarRating rating={enrichedAlgo.rating} />
                </div>
                {isLoggedIn ? (
                  enrichedAlgo.cost === "Premium" && !enrichedAlgo.paid ? (
                    <button onClick={handlePurchase} className="btn btn-sm btn-purple mb-2">
                      Buy for ${enrichedAlgo.buy_price}
                    </button>
                  ) : (
                    <Link href={download} type='button' className="btn btn-sm btn-purple mb-2">
                      Download
                    </Link>
                  )
                ) : (
                  <UnauthorizedMessage openAuthModal={openAuthModal} />
                )}
              </div>
              <div className="uncut">
                <p className="mb-1">Type: {enrichedAlgo.type}</p>
                <p className="mb-1">Seller: {enrichedAlgo.sellerName}</p>
                <p className="mb-1">Published: {enrichedAlgo.identity === "Internal" ? formatDate(enrichedAlgo.uploaded) : enrichedAlgo.uploaded}</p>
                <p className="mb-1">Updated: {enrichedAlgo.identity === "Internal" ? formatDate(enrichedAlgo.updated) : enrichedAlgo.updated}</p>
                <p className="mb-1">Version: {enrichedAlgo.version}</p>
                <p className="mb-1">Downloads: {enrichedAlgo.downloads}</p>
                {/* <Link href={author} type='button' className="btn btn-sm btn-outline-purple mb-2">other algos from this seller</Link> */}
              </div>
              <hr />
              <div className="text-center">
                <Link 
                  href="https://f5y95.app.goo.gl/?link=https%3a%2f%2fwww.zulutrade.com%3a443%2f%3fref%3d2760948&apn=zulu.trade.app&ibi=com.zulutrade.ZuluTrade&isi=336913058&ofl=www.zulutrade.com?ref=2760948&bt=s&utm_medium=affiliate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="https://www.zulutrade.com/Static/Banners/Affiliate/En/Mobile-app/Zulutrade-affiliateMobileApp-static-320x100.en.png"
                    alt="ZuluTrade"
                    width={320}
                    height={100}
                    className="rounded shadow-sm"
                  />
                </Link>
              </div>
              <hr />
              <CardSideBar />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-12 col-lg-10">
            <div className="content-right">
              {renderContent()}
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
                {renderActionButton()}
              </div>
              <Deep enrichedAlgo={enrichedAlgo} params={id} />
              <div className="mb-5">
                <div>
                  <Link 
                    href="https://f5y95.app.goo.gl/?link=https%3a%2f%2fwww.zulutrade.com%3a443%2f%3fref%3d2760948&apn=zulu.trade.app&ibi=com.zulutrade.ZuluTrade&isi=336913058&ofl=www.zulutrade.com?ref=2760948&bt=s&utm_medium=affiliate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="https://www.zulutrade.com/Static/Banners/Affiliate/En/Mobile-app/Zulutrade-affiliateMobileApp-static-320x100.en.png"
                      alt="ZuluTrade Mobile App"
                      width={320}
                      height={100}
                      className="rounded shadow-sm"
                    />
                  </Link>
                </div>
                <More enrichedAlgos={enrichedAlgos} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onRequestClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
} 