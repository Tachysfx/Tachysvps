"use client";

import { doc, getDoc, updateDoc, arrayUnion, setDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../functions/firebase"; // Ensure Firebase is initialized
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import AuthModal from "../components/AuthModal";
import { Role, User, Review, Comment } from "../types/index"
import { Crown, CheckCircle } from "lucide-react";
import Image from 'next/image';

interface EnrichedAlgo {
  id: string;
  name: string;
  // ... other properties
}

interface DeepProps {
  enrichedAlgo: EnrichedAlgo;
  params: string;
}

const UnauthorizedMessage = ({ type, isDownloadRequired = false, algoId, openAuthModal }: { 
  type: 'comment' | 'review', 
  isDownloadRequired?: boolean,
  algoId: string,
  openAuthModal: () => void 
}) => (
  <div className="bg-green-100 border border-green-400 text-green-700 mb-2 px-4 py-2 rounded relative" role="alert">
    {isDownloadRequired ? (
      <>
        You need to download this algorithm to leave a {type}. 
        <Link href={`/market/${algoId}/download`} className="text-green-800 font-semibold hover:text-green-900 ml-2">Download now</Link>
      </>
    ) : (
      <>
        You need to log in to leave a {type}.
        <button 
          onClick={openAuthModal}
          className="text-green-800 font-semibold hover:text-green-900 ml-2 bg-transparent border-0 p-0"
        >
          Login here
        </button>
      </>
    )}
    <button 
      type="button" 
      className="absolute top-0 right-0 px-4 py-3"
      onClick={(e) => (e.target as HTMLElement).parentElement?.remove()}
    >
      <span className="sr-only">Close</span>
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
    </button>
  </div>
);

const checkIfSeller = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "sellers", userId));
    return userDoc.exists();
  } catch (error) {
    console.error("Error checking seller status:", error);
    return false;
  }
};

const Deep = ({ enrichedAlgo, params }: DeepProps) => {
  const algoId = params;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasDownloadedAlgo, setHasDownloadedAlgo] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 20;
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const reviewsPerPage = 20;
  const totalPage = Math.ceil(reviews.length / reviewsPerPage)
  const [parentId, setParentId] = useState<string | null>(null);  // Declare parentId state
  const topLevelComments = comments.filter((comment) => comment.parentId === null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});
  const [openReplyForms, setOpenReplyForms] = useState<{ [key: string]: boolean }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);

  // Pagination function for reviews
  const goToPages = (page: number) => {
    if (page < 1 || page > totalPage) return; // Prevent going out of bounds
    setCurrentPage(page);
  };

  // Slice reviews for the current page
  const paginatedReviews = reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  // Load current user from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        const user = JSON.parse(userSession);
        setCurrentUser({
          id: user.uid,
          email: user.email,
          role: user.role || Role.Normal,
          password: '',  // We don't store password in session for security
          photoURL: user.photoURL || '',
          location: {
            city: '',
            country: '',
            lastUpdated: new Date().toISOString()
          },
          verification: user.verification || false,
          downloads: [],
          wishlist: [],
          comments: [],
          reviews: [],
          name: user.displayName || user.email?.split('@')[0] || '',
          vpsPlans: [],
          notifications: [],
          appsCount: 0,
          subscriptionsCount: 0,
          signalsCount: 0,
          activities2: [],
          urgent: [],
          statistics: {
            tradingVolume: 0,
            monthlyProfit: 0
          }
        });
      } else {
        setCurrentUser(null);
        console.log("No User");
      }
    }
  }, []);

  // Fetch comments and reviews dynamically
  useEffect(() => {
    const fetchCommentsAndReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const commentsRef = collection(db, "comments");
        const reviewsRef = collection(db, "reviews");

        const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
          const loadedComments = snapshot.docs
            .map((doc) => doc.data() as Comment)
            .filter((comment) => comment.algoId === algoId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setComments(loadedComments);
        }, (error) => {
          toast.error("Failed to load comments: " + error.message);
          setError("Failed to load comments: " + error.message);
        });

        const unsubscribeReviews = onSnapshot(reviewsRef, (snapshot) => {
          const loadedReviews = snapshot.docs
            .map((doc) => doc.data() as Review)
            .filter((review) => review.algoId === algoId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setReviews(loadedReviews);
        }, (error) => {
          toast.error("Failed to load reviews: " + error.message);
          setError("Failed to load reviews: " + error.message);
        });

        setIsLoading(false);
        return () => {
          unsubscribeComments();
          unsubscribeReviews();
        };
      } catch (error) {
        toast.error("Failed to initialize listeners");
        setError("Failed to initialize listeners");
        setIsLoading(false);
      }
    };

    fetchCommentsAndReviews();
  }, [algoId]);

  // Check if the user has downloaded the algorithm
  const checkIfDownloaded = async (userId: string): Promise<boolean> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const downloads = userDoc.data().downloads || [];
        return downloads.includes(algoId);
      }
      return false;
    } catch (error) {
      console.error("Error checking downloads:", error);
      return false;
    }
  };
  

  useEffect(() => {
    const checkDownloadStatus = async () => {
      if (currentUser) {
        const downloaded = await checkIfDownloaded(currentUser.id);
        setHasDownloadedAlgo(downloaded);
      }
    };
    checkDownloadStatus();
  }, [currentUser]);  

  // Submit a comment or a reply
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>, parentId: string | null, commentId?: string) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You need to log in to leave a comment.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const comment = formData.get("comment")?.toString() || "";

    try {
      const newCommentId = `${algoId}-comment-${Date.now()}`;
      const commentData = {
        id: newCommentId,
        userId: currentUser.id,
        algoId,
        parentId: parentId || null,
        comment,
        lang: "en",
        date: new Date().toISOString(),
        replies: [],
      };

      await setDoc(doc(db, "comments", newCommentId), commentData);

      if (parentId) {
        await updateDoc(doc(db, "comments", parentId), {
          replies: arrayUnion(newCommentId),
        });
        
        setOpenReplyForms(prev => ({
          ...prev,
          [parentId]: false
        }));
      }

      form.reset();
      toast.success(parentId ? "Reply posted successfully!" : "Comment posted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment. Please try again later.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>, parentId: string | null = null) => {
    e.preventDefault();
  
    if (!currentUser) {
      toast.error("You need to log in to leave a review.");
      return;
    }
  
    // Only check download status for new reviews, not replies
    if (!parentId) {
    const downloaded = await checkIfDownloaded(currentUser.id);
    if (!downloaded) {
      toast.warning("You must download this algorithm to leave a review.");
      return;
      }
    }
  
    // Get the form element and create FormData from it
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const review = formData.get("review")?.toString() || "";
  
    if (!review) {
      toast.warning("Please write a review before submitting.");
      return;
    }
  
    try {
      const reviewId = `${algoId}-review-${Date.now()}`;
      const reviewData = {
        id: reviewId,
        userId: currentUser.id,
        algoId,
        review,
        lang: "en",
        date: new Date().toISOString(),
        replies: [],
        parentId,
      };
  
      await setDoc(doc(db, "reviews", reviewId), reviewData);
  
      if (parentId) {
        // Update the parent review's replies array
        await updateDoc(doc(db, "reviews", parentId), {
          replies: arrayUnion(reviewId),
        });

        // Hide the reply form after successful submission
        const replyForm = document.getElementById(`replyForm-${parentId}`);
        if (replyForm) {
          replyForm.classList.add('hidden');
        }
      }

      // Clear the form
      form.reset();
      toast.success(parentId ? "Reply submitted successfully!" : "Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit. Please try again later.");
    }
  };
  
  
  

  // Define the goToPage function to change the page
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return; // prevent going out of bounds
    setCurrentPage(page);
  };

  // Add this function to fetch user data
  const fetchUserName = async (userId: string) => {
    // Check cache first
    if (userNames[userId]) {
      return userNames[userId];
    }

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        // Update cache
        setUserNames(prev => ({
          ...prev,
          [userId]: userData.name
        }));
        return userData.name;
      }
      return "Unknown User";
    } catch (error) {
      console.error("Error fetching user data:", error);
      return "Unknown User";
    }
  };

  const CommentItem = ({ 
    comment, 
    currentUser, 
    onCommentSubmit, 
    fetchUserName,
    openReplyForms,
    setOpenReplyForms,
    openReplies,
    setOpenReplies
  }: {
    comment: Comment;
    currentUser: User | null;
    onCommentSubmit: (e: React.FormEvent<HTMLFormElement>, parentId: string | null, commentId?: string) => Promise<void>;
    fetchUserName: (userId: string) => Promise<string>;
    openReplyForms: { [key: string]: boolean };
    setOpenReplyForms: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    openReplies: { [key: string]: boolean };
    setOpenReplies: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  }) => {
    const [userName, setUserName] = useState<string>("Loading...");
    const [userRole, setUserRole] = useState<Role>(Role.Normal);
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", comment.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUserName(userData.name);
            setUserRole(userData.role);
            
            // New seller check
            const isSeller = await checkIfSeller(comment.userId);
            setIsSeller(isSeller);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }, [comment.userId]);

    return (
      <div key={`comment-${comment.id}`} className="bg-white rounded-lg shadow-sm p-3 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-purple-600">{userName}</span>
          {isSeller && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">Seller</span>
          )}
          {userRole === Role.Premium && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-gray-500 text-sm">
            ({new Date(comment.date).toLocaleString()})
          </span>
        </div>
        <p className="text-gray-700">{comment.comment}</p>

        <div className="flex space-x-4 pt-2 border-t border-gray-100">
          <button
            onClick={() => setOpenReplyForms(prev => ({
              ...prev,
              [comment.id]: !prev[comment.id]
            }))}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            Reply
          </button>
          <button
            onClick={() => setOpenReplies(prev => ({
              ...prev,
              [comment.id]: !prev[comment.id]
            }))}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            View Replies ({comment.replies?.length || 0})
          </button>
        </div>

        {currentUser && (
          <div className={`mt-2 ml-4 transition-all duration-200 ${openReplyForms[comment.id] ? 'block' : 'hidden'}`}>
            <form onSubmit={(e) => {
              onCommentSubmit(e, comment.id, comment.id);
              setOpenReplyForms(prev => ({
                ...prev,
                [comment.id]: false
              }));
            }}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Reply to this comment *</label>
                <textarea
                  name="comment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Write your reply"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Reply
              </button>
            </form>
          </div>
        )}

        <div className={`transition-all duration-200 ${openReplies[comment.id] ? 'block' : 'hidden'}`}>
          {comment.replies?.map((replyId, index) => (
            <CommentReply
              key={replyId}
              replyId={replyId}
              commentId={comment.id}
              index={index}
              fetchUserName={fetchUserName}
            />
          ))}
        </div>
      </div>
    );
  };

  const CommentReply = ({ replyId, commentId, index, fetchUserName }: {
    replyId: string;
    commentId: string;
    index: number;
    fetchUserName: (userId: string) => Promise<string>;
  }) => {
    const [replyUserName, setReplyUserName] = useState<string>("Loading...");
    const [reply, setReply] = useState<Comment | null>(null);
    const [userRole, setUserRole] = useState<Role>(Role.Normal);
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
      const fetchReply = async () => {
        try {
          const replyDoc = await getDoc(doc(db, "comments", replyId));
          if (replyDoc.exists()) {
            const replyData = replyDoc.data() as Comment;
            setReply(replyData);
            // Fetch user data for role
            const userDoc = await getDoc(doc(db, "users", replyData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              setUserRole(userData.role);
              // Check if user is a seller using checkIfSeller function
              const isSellerStatus = await checkIfSeller(replyData.userId);
              setIsSeller(isSellerStatus);
            }
          }
        } catch (error) {
          console.error("Error fetching reply data:", error);
        }
      };
      fetchReply();
    }, [replyId]);

    useEffect(() => {
      if (reply) {
        fetchUserName(reply.userId).then(setReplyUserName);
      }
    }, [reply, fetchUserName]);

    if (!reply) return null;

    return (
      <div key={`comment-${commentId}-reply-${index}`} className="ml-4 mt-2">
        <div className="border-t border-gray-200 pt-2">
          <div className="flex items-center space-x-2 mb-1">
            <strong>{replyUserName}</strong>
            {isSeller && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">Seller</span>
            )}
            {userRole === Role.Premium && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-gray-500">
              ({new Date(reply.date).toLocaleString()})
            </span>
          </div>
          <p className="mb-1">{reply.comment}</p>
        </div>
      </div>
    );
  };

  const ReviewItem = ({ review, currentUser, onReviewSubmit, fetchUserName }: {
    review: Review;
    currentUser: User | null;
    onReviewSubmit: (e: React.FormEvent<HTMLFormElement>, parentId: string | null) => Promise<void>;
    fetchUserName: (userId: string) => Promise<string>;
  }) => {
    const [reviewUserName, setReviewUserName] = useState<string>("Loading...");
    const [userRole, setUserRole] = useState<Role>(Role.Normal);
    const [isSeller, setIsSeller] = useState(false);
    const [replyUsers, setReplyUsers] = useState<{ [key: string]: { name: string; role: Role; isSeller: boolean } }>({});

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", review.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setReviewUserName(userData.name);
            setUserRole(userData.role);
            const isSellerStatus = await checkIfSeller(review.userId);
            setIsSeller(isSellerStatus);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }, [review.userId]);

    useEffect(() => {
      const fetchReplyUserData = async () => {
        if (!review.replies) return;
        for (const replyId of review.replies) {
          const reply = reviews.find(r => r.id === replyId);
          if (reply && !replyUsers[reply.userId]) {
            try {
              const userDoc = await getDoc(doc(db, "users", reply.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                const isSellerStatus = await checkIfSeller(reply.userId);
                setReplyUsers(prev => ({
                  ...prev,
                  [reply.userId]: {
                    name: userData.name,
                    role: userData.role,
                    isSeller: isSellerStatus
                  }
                }));
              }
            } catch (error) {
              console.error("Error fetching reply user data:", error);
            }
          }
        }
      };
      fetchReplyUserData();
    }, [review.replies, reviews]);

    return (
      <div key={`review-${review.id}`} className="bg-white rounded-lg shadow-sm p-3 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-purple-600">{reviewUserName}</span>
          {isSeller && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">Seller</span>
          )}
          {userRole === Role.Premium && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-gray-500 text-sm">
            ({new Date(review.date).toLocaleString()})
          </span>
        </div>
        
        <p className="text-gray-700">{review.review}</p>

        <div className="flex space-x-4 pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              const element = document.getElementById(`replyForm-${review.id}`);
              element?.classList.toggle('hidden');
            }}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            Reply
          </button>
          <button
            onClick={() => {
              const element = document.getElementById(`viewReplies-${review.id}`);
              element?.classList.toggle('hidden');
            }}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            View Replies ({review.replies?.length || 0})
          </button>
        </div>

        {currentUser && (
          <div id={`replyForm-${review.id}`} className="hidden mt-4">
            <form onSubmit={(e) => onReviewSubmit(e, review.id)} className="space-y-3">
              <textarea
                name="review"
                rows={3}
                placeholder="Reply to this review"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit Reply
              </button>
            </form>
          </div>
        )}

        <div id={`viewReplies-${review.id}`} className="hidden mt-4 space-y-3">
          {review.replies?.map((replyId: string, index: number) => {
            const reply = reviews.find((r) => r.id === replyId);
            const replyUser = reply && replyUsers[reply.userId];
            return (
              reply && (
                <div key={`review-${review.id}-reply-${index}`} className="ml-6 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{replyUser?.name || "Loading..."}</span>
                    {replyUser?.isSeller && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">Seller</span>
                    )}
                    {replyUser?.role === Role.Premium && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-gray-500 text-sm">
                      ({new Date(reply.date).toLocaleString()})
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{reply.review}</p>
                </div>
              )
            );
          })}
        </div>
      </div>
    );
  };

  const UserRoleBadge = ({ userId, algoId }: { userId: string; algoId: string }) => {
    const [userRole, setUserRole] = useState<Role>(Role.Normal);
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
      const fetchUserRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUserRole(userData.role);

            // Check if user is the seller of this algo
            const isSellerStatus = await checkIfSeller(userId);
            setIsSeller(isSellerStatus);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      fetchUserRole();
    }, [userId, algoId]);

    return (
      <div className="flex items-center space-x-2">
        {isSeller && (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            Seller
          </span>
        )}
        {userRole === Role.Premium && (
          <Crown className="h-4 w-4 text-yellow-500" />
        )}
      </div>
    );
  };

  if (isLoading) {
    return
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-purple-600 font-medium text-center">Loading comments and reviews...</p>
      </div>
    </div>
    ;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div id="reviews">
      <nav>
        <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
          <button
            className="nav-link active text-dark"
            id="nav-home-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-home"
            type="button"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
          >
            Comments ({comments.length})
          </button>
          <button
            className="nav-link text-dark"
            id="nav-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            type="button"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="false"
          >
            Reviews ({reviews.length})
          </button>
        </div>
      </nav>
      
      <div className="tab-content" id="nav-tabContent">
        {/* Comments Tab */}
        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          {/* New Comment Form */}
          {!currentUser ? (
            <UnauthorizedMessage 
              type="comment" 
              algoId={algoId}
              openAuthModal={openAuthModal}
            />
          ) : (
            <form onSubmit={(e) => handleCommentSubmit(e, null)} className="mb-6">
              <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment *</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  id="comment"
                  name="comment"
                  rows={4}
                  placeholder="Share your thoughts here..."
                  required
                ></textarea>
              </div>
              <div className="mt-3">
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Submit Comment
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onCommentSubmit={handleCommentSubmit}
                fetchUserName={fetchUserName}
                openReplyForms={openReplyForms}
                setOpenReplyForms={setOpenReplyForms}
                openReplies={openReplies}
                setOpenReplies={setOpenReplies}
              />
            ))}
            {topLevelComments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Pagination */}
          <nav className="mt-8 mb-6">
            <div className="flex justify-center">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === 1}
                  onClick={() => goToPage(1)}
                >
                  First
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(totalPages)}
                >
                  Last
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200 
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Reviews Tab */}
        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          {/* Add Review Form */}
          {!currentUser ? (
            <UnauthorizedMessage 
              type="review" 
              algoId={algoId}
              openAuthModal={openAuthModal}
            />
          ) : !hasDownloadedAlgo ? (
            <UnauthorizedMessage 
              type="review" 
              isDownloadRequired={true}
              algoId={algoId}
              openAuthModal={openAuthModal}
            />
          ) : (
            <form onSubmit={handleReviewSubmit} className="mb-6">
              <div className="space-y-2">
                <textarea
                  name="review"
                  rows={3}
                  placeholder="Write your review here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
              <div className="mt-2">
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          {/* Display Top-Level Reviews */}
          <div className="space-y-3">
          {paginatedReviews.length > 0 ? (
            paginatedReviews
              .slice((currentPage - 1) * 20, currentPage * 20)
              .map((review: Review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  currentUser={currentUser}
                  onReviewSubmit={handleReviewSubmit}
                  fetchUserName={fetchUserName}
                />
              ))
          ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to leave feedback!</p>
          )}
          </div>

          {/* Pagination */}
          <nav className="mt-8 mb-6">
            <div className="flex justify-center">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === 1}
                  onClick={() => goToPages(currentPage - 1)}
                >
                  Previous
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === 1}
                  onClick={() => goToPages(1)}
                >
                  First
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === totalPages}
                  onClick={() => goToPages(totalPages)}
                >
                  Last
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200 
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  disabled={currentPage === totalPages}
                  onClick={() => goToPages(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </nav>
        </div>

      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onRequestClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
  
};

export default Deep;