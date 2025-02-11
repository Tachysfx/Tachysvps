'use client';

import { useState, useEffect } from 'react';
import { db, auth, logAnalyticsEvent } from '../../functions/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import Image from 'next/image';
import { toast } from "react-toastify";
import { 
  Heart, 
  MessageSquare, 
  Send,
  Globe,
  MoreHorizontal,
  ImagePlus,
  X,
  MessageSquarePlus,
  Search,
  Cross,
  Crown,
  ShieldPlus,
  Share2,
  Instagram,
} from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';
import { Role } from "../../types/index";
//import { deleteOldFile } from '@/app/intermediaries/fileUtils';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
    isConnected: boolean;
    role: Role;
  };
  content: string;
  images?: Array<{
    url: string;
    path: string;
  }>;
  likes: number;
  shares: number;
  sharedBy: string[];
  comments: Comment[];
  isEdited?: boolean;
  createdAt: any;
  authorId: string;
  likedBy: string[];
  reports: number;
  reportedBy: string[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: Role;
  };
  content: string;
  timeAgo: any;
  likes: number;
  likedBy: string[];
  replies?: Comment[];
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onSubmitComment: (content: string) => void;
  onSubmitReply: (commentId: string, content: string) => void;
  isCommentActive: boolean;
  currentUser: {
    name: string;
    avatar: string;
    role: Role;
  };
  onDelete: (postId: string) => void;
  onReport: (postId: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  rank: number;
  content: string;
}

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onSubmitComment,
  onSubmitReply,
  isCommentActive,
  currentUser,
  onDelete,
  onReport
}: PostCardProps) => {
  const [commentText, setCommentText] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = auth.currentUser;
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onSubmitComment(commentText);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleSubmitReply = () => {
    if (!commentText.trim()) return;
    onSubmitReply(replyingTo!, commentText);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      if (!user) {
        toast.error('Please login to like comments');
        return;
      }

      const postRef = doc(db, 'posts', post.id);
      const postDoc = await getDoc(postRef);
      const currentPost = postDoc.data() as Post;
      
      const updatedComments = currentPost.comments.map(comment => {
        if (comment.id === commentId) {
          const hasLiked = comment.likedBy?.includes(user.uid);
          return {
            ...comment,
            likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
            likedBy: hasLiked 
              ? comment.likedBy.filter(id => id !== user.uid)
              : [...(comment.likedBy || []), user.uid]
          };
        }
        return comment;
      });

      await updateDoc(postRef, { comments: updatedComments });
      logAnalyticsEvent('comment_liked', { postId: post.id, commentId });
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    
    // Handle Firestore Timestamp
    if (date?.toDate) {
      date = date.toDate();
    }
    
    // Handle ISO string or Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = () => {
    if (post.content.length <= 280 || showMore) {
      return post.content;
    }
    return post.content.substring(0, 280) + '...';
  };

  const handleMoreClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleShare = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const postRef = doc(db, 'posts', post.id);
      const postDoc = await getDoc(postRef);
      const currentPost = postDoc.data() as Post;

      // Check if user has already shared
      if (currentPost.sharedBy?.includes(user.uid)) return;

      // Update share count and add user to sharedBy array
      await updateDoc(postRef, {
        shares: increment(1),
        sharedBy: arrayUnion(user.uid)
      });
      logAnalyticsEvent('post_shared', { postId: post.id });
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  return (
    <div 
      id={`post-${post.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 mb-4"
    >
      {/* Post Header */}
      <div className="p-3">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Image
              src={post.author.avatar || '/user.png'}
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-secondary shadow-sm"
              unoptimized
            />
            {post.author.isConnected && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1">
                  <h5 className="font-semibold text-gray-900 cursor-pointer mb-0">
                    {post.author.name}
                  </h5>
                  {post.author.role === Role.Premium && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                  {post.author.role === Role.Admin && (
                    <ShieldPlus className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-0 ms-0">
                  {post.author.role === Role.Admin ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Moderator
                    </span>
                  ) : post.author.title}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>{formatDate(post.createdAt)}</span>
                  {post.isEdited && <span className="mx-1">•</span>}
                  {post.isEdited && <span>Edited</span>}
                  <span className="mx-1">•</span>
                  <Globe className="w-3 h-3" />
                </div>
              </div>
              <div className="relative">
                <button 
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoreClick();
                  }}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-full mr-2 top-0 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                    {currentUser.role === Role.Admin ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReport(post.id);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Report (Hide for me)
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(post.id);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete for everyone
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReport(post.id);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Report (Hide for me)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Post Content */}
        <div className="mt-3">
          <p className="text-gray-800 whitespace-pre-line">
            {formatContent()}
            {post.content.length > 280 && !showMore && (
              <button 
                onClick={() => setShowMore(true)}
                className="text-gray-500 hover:text-gray-700 font-medium ml-1"
              >
                See more
              </button>
            )}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">👍</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">❤️</span>
            </div>
            <span className="ml-2">{post.likes}</span>
          </div>
          <div className="flex space-x-4">
            <button className="hover:text-purple-800">{post.comments.length} comments</button>
            <button className="hover:text-purple-800">{post.shares || 0} shares</button>
            {post.reports > 0 && (
              <span className="text-red-500">{post.reports} reports</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 px-4">
        <div className="flex justify-between -mx-2">
          <button 
            onClick={onLike}
            className={`flex-1 flex items-center justify-center space-x-2 px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors ${
              user && post.likedBy?.includes(user.uid) 
                ? 'text-red-600' 
                : 'text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${user && post.likedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
            <span className="font-medium">Like</span>
          </button>
          <button 
            onClick={onComment}
            className="flex-1 flex items-center justify-center space-x-2 px-2 py-3 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Comment</span>
          </button>
          <div className="flex-1 relative">
            <button 
              className="w-full flex items-center justify-center space-x-2 px-2 py-3 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>

            {/* Share Menu Dropdown */}
            {showShareMenu && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2">
                <div className="d-flex gap-2">
                  <FacebookShareButton
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`}
                    title={post.content.substring(0, 100)}
                    onClick={handleShare}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>

                  <button
                    onClick={() => {
                      handleShare();
                      window.open(
                        `https://x.com/intent/tweet?url=${encodeURIComponent(
                          `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`
                        )}&text=${encodeURIComponent(post.content.substring(0, 100))}`,
                        '_blank'
                      );
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-900"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-4 h-4 text-white fill-current"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>

                  <WhatsappShareButton
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`}
                    title={post.content.substring(0, 100)}
                    onClick={handleShare}
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>

                  <TelegramShareButton
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`}
                    title={post.content.substring(0, 100)}
                    onClick={handleShare}
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>

                  {/* Custom Instagram Share Button */}
                  <button
                    onClick={() => {
                      handleShare();
                      window.open(
                        `https://www.instagram.com/share?url=${encodeURIComponent(
                          `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`
                        )}`,
                        '_blank'
                      );
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {isCommentActive && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          {/* Comment Input */}
          <div className="flex items-start space-x-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8">
              <Image
                src={currentUser.avatar || '/user.png'}
                alt="Current user"
                width={32}
                height={32}
                className="rounded-full border-2 border-white shadow-sm"
                unoptimized
              />
            </div>
            <div className="flex-grow relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-blue-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Show number of comments if there are any */}
          {post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex space-x-2">
                  <div className="flex-shrink-0 w-8 h-8">
                    <Image
                      src={comment.author.avatar || '/user.png'}
                      alt={comment.author.name}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white shadow-sm"
                      unoptimized
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-sm mb-0">{comment.author.name}</h4>
                        {comment.author.role === Role.Premium && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        {comment.author.role === Role.Admin && (
                          <ShieldPlus className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-800 text-sm mb-0">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-1 ml-2 text-xs text-gray-500">
                        <span>{formatDate(comment.timeAgo)}</span>
                        <button 
                          onClick={() => handleCommentLike(comment.id)}
                          className={`font-semibold ${
                            user && comment.likedBy?.includes(user.uid)
                              ? 'text-red-600'
                              : 'hover:text-gray-700'
                          }`}
                        >
                          Like
                        </button>
                        <button 
                          onClick={() => setReplyingTo(comment.id)}
                          className="font-semibold hover:text-gray-700"
                        >
                          Reply
                        </button>
                        {comment.likes > 0 && (
                          <span className="flex items-center">
                            <Heart className={`w-3 h-3 ${user && comment.likedBy?.includes(user.uid) ? 'fill-current text-red-600' : 'text-blue-500'} mr-1`} />
                            {comment.likes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="flex items-start space-x-2 mt-2">
                        <div className="flex-shrink-0 w-6 h-6">
                          <Image
                            src={currentUser.avatar || '/user.png'}
                            alt="Current user"
                            width={24}
                            height={24}
                            className="rounded-full border-2 border-white shadow-sm"
                            unoptimized
                          />
                        </div>
                        <div className="flex-grow relative">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={`Reply to ${comment.author.name}...`}
                            className="w-full px-3 py-1 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                          />
                          <button
                            onClick={handleSubmitReply}
                            disabled={!commentText.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 mt-2 space-y-2">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex space-x-2">
                            <div className="flex-shrink-0 w-6 h-6">
                              <Image
                                src={reply.author.avatar || '/user.png'}
                                alt={reply.author.name}
                                width={24}
                                height={24}
                                className="rounded-full border-2 border-white shadow-sm"
                                unoptimized
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="bg-white rounded-2xl px-3 py-2 shadow-sm">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-sm mb-0">{reply.author.name}</h4>
                                  {reply.author.role === Role.Premium && (
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                  )}
                                  {reply.author.role === Role.Admin && (
                                    <ShieldPlus className="h-4 w-4 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-gray-800 text-sm mb-0">{reply.content}</p>
                                <div className="flex items-center space-x-4 mt-1 ml-2 text-xs text-gray-500">
                                  <span>{formatDate(reply.timeAgo)}</span>
                                  {reply.likes > 0 && (
                                    <span className="flex items-center">
                                      <Heart className="w-3 h-3 text-gray-500 mr-1" />
                                      {reply.likes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchModal = ({ isOpen, onClose, posts }: { 
  isOpen: boolean; 
  onClose: () => void;
  posts: Post[];
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const extractSearchableTitle = (content: string): { title: string; rank: number } | null => {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    
    if (firstLine.startsWith('###')) {
      const words = firstLine.slice(3).trim().split(' ').slice(0, 5).join(' ');
      return { title: words, rank: 4 };
    } else if (firstLine.startsWith('##')) {
      const words = firstLine.slice(2).trim().split(' ').slice(0, 5).join(' ');
      return { title: words, rank: 3 };
    } else if (firstLine.startsWith('#')) {
      const words = firstLine.slice(1).trim().split(' ').slice(0, 5).join(' ');
      return { title: words, rank: 2 };
    } else if (firstLine.startsWith('*')) {
      const words = firstLine.slice(1).trim().split(' ').slice(0, 10).join(' ');
      return { title: words, rank: 1 };
    }
    
    return null;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = posts
      .map(post => {
        const titleInfo = extractSearchableTitle(post.content);
        if (!titleInfo) return null;

        return {
          id: post.id,
          title: titleInfo.title,
          rank: titleInfo.rank,
          content: post.content
        };
      })
      .filter((result): result is SearchResult => 
        result !== null && 
        result.title.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a.rank - b.rank);

    setSearchResults(results);
  };

  const handleResultClick = (postId: string) => {
    onClose();
    setTimeout(() => {
      const postElement = document.getElementById(`post-${postId}`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        postElement.classList.add('post-highlight');
        setTimeout(() => {
          postElement.classList.remove('post-highlight');
        }, 2000);
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-start top-8 justify-center z-50 pt-4 px-3"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg">
        <div className="relative">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-full 
                       text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent shadow-lg"
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          {(searchQuery || searchResults.length > 0) && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id} 
                      onClick={() => handleResultClick(result.id)}
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          result.rank === 1 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          #
                        </span>
                        <span className="font-medium text-gray-900">{result.title}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1 ml-7">
                        {result.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    avatar: '/user.png',
    role: Role.Normal
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  useEffect(() => {
    const sessionUserString = sessionStorage.getItem("user");
    if (sessionUserString) {
      const sessionUser = JSON.parse(sessionUserString);
      fetchUserProfile(sessionUser.uid);
    } else {
      // If no user is logged in, ensure we still have a default role
      setUserProfile(prev => ({
        ...prev,
        role: Role.Normal
      }));
    }
    const unsubscribe = subscribeToPosts();
    logAnalyticsEvent('blog_page_view');
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadHiddenPosts = () => {
      const user = auth.currentUser;
      if (user) {
        const hidden = localStorage.getItem(`hiddenPosts_${user.uid}`);
        if (hidden) {
          setHiddenPosts(JSON.parse(hidden));
        }
      } else {
        setHiddenPosts([]);
      }
    };

    loadHiddenPosts();
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(loadHiddenPosts);
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          name: userData.name || 'Anonymous',
          avatar: userData.photoURL || '/user.png',
          role: userData.role || Role.Normal
        });
      } else {
        // If user document doesn't exist, ensure we still have a default role
        setUserProfile(prev => ({
          ...prev,
          role: Role.Normal
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile");
      // On error, ensure we still have a default role
      setUserProfile(prev => ({
        ...prev,
        role: Role.Normal
      }));
    }
  };

  const subscribeToPosts = () => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, async (snapshot) => {
      try {
        const fetchedPosts = await Promise.all(snapshot.docs.map(async docSnapshot => {
          const postData = docSnapshot.data() as Omit<Post, 'id'>;
          // Fetch author's role if not present
          if (!postData.author?.role) {
            const userDoc = await getDoc(doc(db, "users", postData.authorId));
            const userData = userDoc.exists() ? userDoc.data() as { role?: Role } : { role: Role.Normal };
            if (postData.author) {
              postData.author.role = userData.role || Role.Normal;
            }
          }
          return {
            id: docSnapshot.id,
            ...postData,
            createdAt: postData.createdAt?.toDate()
          };
        }));
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error processing posts:', error);
        setError('Failed to load posts');
        setLoading(false);
      }
    }, (error) => {
      console.error('Subscription error:', error);
      setError('Failed to subscribe to posts');
      setLoading(false);
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to create a post');
        return;
      }

      // Upload images first
      const uploadedImages: Array<{ url: string; path: string }> = [];
      for (const image of newImages) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('folder', 'Posts');
        formData.append('access', 'private');

        const response = await fetch('/api/storage', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          uploadedImages.push({
            url: data.url,
            path: data.path
          });
        }
      }

      // Get user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const userRole = userData?.role || Role.Normal;

      await addDoc(collection(db, 'posts'), {
        content: newPost,
        images: uploadedImages,
        authorId: user.uid,
        author: {
          name: userProfile.name,
          avatar: userProfile.avatar,
          title: 'User',
          isConnected: false,
          role: userRole
        },
        createdAt: serverTimestamp(),
        likes: 0,
        shares: 0,
        sharedBy: [],
        comments: [],
        likedBy: []
      });

      setNewPost('');
      setNewImages([]);
      logAnalyticsEvent('post_created');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to delete posts');
        return;
      }

      // Get the post data first to access its images
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();

      // Delete all images associated with the post
      if (postData?.images && postData.images.length > 0) {
        for (const image of postData.images) {
          await fetch('/api/storage', {
            method: 'DELETE',
            body: JSON.stringify({ 
              path: image.path,
              access: 'private',
              folder: 'Posts'
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }

      // Delete the post document
      await deleteDoc(postRef);
      logAnalyticsEvent('post_deleted', { postId });
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleEditPost = async (postId: string, newContent: string, newImages: File[]) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to edit posts');
        return;
      }

      // Get current post data to access old images
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const post = postDoc.data() as Post;

      // Upload new images if any
      const uploadedImages: Array<{ url: string; path: string }> = [];
      if (newImages.length > 0) {
        for (const image of newImages) {
          const formData = new FormData();
          formData.append('file', image);
          formData.append('folder', 'Posts');
          formData.append('access', 'private');

          const response = await fetch('/api/storage', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          if (data.success) {
            uploadedImages.push({
              url: data.url,
              path: data.path
            });
          }
        }
      }

      // Delete old images if they're being replaced
      if (newImages.length > 0 && post.images && post.images.length > 0) {
        for (const image of post.images) {
          await fetch('/api/storage', {
            method: 'DELETE',
            body: JSON.stringify({ 
              path: image.path,
              access: 'private',
              folder: 'Posts'
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }

      // Update post with correctly typed images array
      await updateDoc(postRef, {
        content: newContent,
        images: uploadedImages.length > 0 ? uploadedImages : (post.images || []),
        isEdited: true,
        lastEditedAt: serverTimestamp()
      });

      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to like posts');
        return;
      }

      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const post = postDoc.data() as Post;
      
      if (post.likedBy?.includes(user.uid)) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid)
        });
        logAnalyticsEvent('post_unliked', { postId });
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        });
        logAnalyticsEvent('post_liked', { postId });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId: string, commentContent: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to comment');
        return;
      }

      // Get user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const userRole = userData?.role || Role.Normal;

      const postRef = doc(db, 'posts', postId);
      const newComment: Comment = {
        id: `c${Date.now()}`,
        author: {
          name: userProfile.name,
          avatar: userProfile.avatar,
          role: userRole
        },
        content: commentContent,
        timeAgo: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        replies: []
      };

      // Get current comments to ensure we maintain role information
      const postDoc = await getDoc(postRef);
      const currentPost = postDoc.data() as Post;
      const updatedComments = [...(currentPost.comments || []), newComment];

      await updateDoc(postRef, {
        comments: updatedComments
      });
      
      setNewComment('');
      setActiveCommentId(null);
      logAnalyticsEvent('comment_added', { postId });
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleReply = async (postId: string, commentId: string, replyContent: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to reply');
        return;
      }

      // Get user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const userRole = userData?.role || Role.Normal;

      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const post = postDoc.data() as Post;

      const updatedComments = post.comments.map(comment => {
        if (comment.id === commentId) {
          const newReply: Comment = {
            id: `r${Date.now()}`,
            author: {
              name: userProfile.name,
              avatar: userProfile.avatar,
              role: userRole
            },
            content: replyContent,
            timeAgo: new Date().toISOString(),
            likes: 0,
            likedBy: []
          };

          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });

      await updateDoc(postRef, { comments: updatedComments });
      logAnalyticsEvent('reply_added', { postId, commentId });
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const handleReport = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to report posts');
        return;
      }

      // Add post to hidden posts
      const updatedHiddenPosts = [...hiddenPosts, postId];
      setHiddenPosts(updatedHiddenPosts);
      
      // Save to localStorage
      localStorage.setItem(`hiddenPosts_${user.uid}`, JSON.stringify(updatedHiddenPosts));

      // Add report to Firestore
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const post = postDoc.data() as Post;

      // Check if user has already reported
      if (post.reportedBy?.includes(user.uid)) {
        toast.info('You have already reported this post');
        return;
      }

      // Update report count and add user to reportedBy array
      await updateDoc(postRef, {
        reports: increment(1),
        reportedBy: arrayUnion(user.uid)
      });

      toast.success('Post has been reported and hidden from your feed');
      logAnalyticsEvent('post_reported', { postId });
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Failed to report post');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to delete posts');
        return;
      }

      if (user && userProfile.role !== Role.Admin) {
        toast.error('Only admins can delete posts');
        return;
      }

      // Get the post data first to access its images
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();

      // Delete all images associated with the post using deleteOldFile utility
      if (postData?.images && postData.images.length > 0) {
        try {
          // await deleteOldFile(postData.images);
        } catch (error) {
          console.error('Error deleting post images:', error);
          toast.error('Failed to delete post images');
          return;
        }
      }

      // Delete the post document
      await deleteDoc(postRef);
      logAnalyticsEvent('post_deleted', { postId });
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        shares: increment(1)
      });
      logAnalyticsEvent('post_shared', { postId });
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  // Filter out hidden posts from the display
  const visiblePosts = posts.filter(post => !hiddenPosts.includes(post.id));

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8 pt-2 relative">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-14 right-6 z-50">
        {showMenu && (
          <div className="flex flex-col gap-4 mb-4 animate-fade-in">
            <button
              onClick={() => {
                setShowSearch(true);
                setShowMenu(false);
              }}
              className="bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110"
              title="Search Posts"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setShowCreatePost(true);
                setShowMenu(false);
              }}
              className="bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110"
              title="Create Post"
            >
              <MessageSquarePlus className="w-6 h-6" />
            </button>
          </div>
        )}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110"
          title="Menu"
        >
          <Cross className={`w-6 h-6 transform transition-transform duration-300 ${showMenu ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        posts={posts}
      />

      {/* Create Post Modal */}
      {showCreatePost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            // Only close if clicking the overlay background
            if (e.target === e.currentTarget) {
              setShowCreatePost(false);
            }
          }}
        >
          {/* Create Post Modal */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-2">
              <h2 className="text-xl font-semibold text-gray-800">Create Post</h2>
              <button 
                onClick={() => setShowCreatePost(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-2">
              <div className="flex items-center space-x-4">
                <Image
                  src={userProfile.avatar || '/user.png'}
                  alt="Current user"
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
                <div className="flex-grow">
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id="post-images"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <label 
                        htmlFor="post-images" 
                        className="cursor-pointer text-purple-600 hover:text-purple-700 flex items-center gap-2"
                      >
                        <ImagePlus className="w-5 h-5" />
                        <span>Add Images</span>
                      </label>
                    </div>
                    <button
                      onClick={() => {
                        handleCreatePost();
                        setShowCreatePost(false);
                      }}
                      disabled={!newPost.trim() && newImages.length === 0}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                  {/* Preview Images */}
                  {newImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="rounded-lg object-cover"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Posts Feed */}
        {visiblePosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onComment={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
            onSubmitComment={(content) => handleComment(post.id, content)}
            onSubmitReply={(commentId, content) => handleReply(post.id, commentId, content)}
            isCommentActive={activeCommentId === post.id}
            currentUser={userProfile}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        ))}
      </div>
    </div>
  );
}
