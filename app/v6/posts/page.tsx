'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth, logAnalyticsEvent } from '../../functions/firebase';
// import { deleteOldFile } from '@/app/intermediaries/fileUtils';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  getDoc, 
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { toast } from "react-toastify";
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Pencil, 
  Trash2, 
  BarChart2, 
  ThumbsUp, 
  MessageSquare,
  ImagePlus,
  BookOpen,
  FileText,
  InfoIcon,
  ChevronLeft,
  ChevronRight,
  Share2,
  ShieldPlus,
  Video
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Loading from '../../loading';
import { storageService } from '../../functions/storage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PostMetrics {
  likes: number;
  comments: number;
  views: number;
}

interface Post {
  id: string;
  content: string;
  createdAt: any;
  authorId: string;
  likes: number;
  comments: any[];
  images?: Array<{
    url: string;
    path: string;
  }>;
  author: {
    name: string;
    avatar: string;
  };
  metrics?: PostMetrics;
  shares: number;
  sharedBy: string[];
  reports: number;
  reportedBy: string[];
  likedBy: string[];
  videos?: Array<{
    url: string;
    path: string;
    thumbnail?: string;
  }>;
}

interface PostsStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  engagement: number;
}

interface EditFormValues {
  content: string;
  images: File[];
  videos?: File[];
}

// Add this helper function at the top level
const getSessionUser = () => {
  const userStr = sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default function PostsDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    avatar: '/avatars/default.jpg'
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [totalMetrics, setTotalMetrics] = useState<PostMetrics>({
    likes: 0,
    comments: 0,
    views: 0
  });
  const [stats, setStats] = useState<PostsStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    engagement: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const sessionUserString = sessionStorage.getItem("user");
    if (sessionUserString) {
      const sessionUser = JSON.parse(sessionUserString);
      fetchUserProfile(sessionUser.uid);
    }
    fetchPosts();
    loadHiddenPosts();
    logAnalyticsEvent('posts_dashboard_view');
  }, []);

  const loadHiddenPosts = () => {
    const sessionUser = getSessionUser();
    if (sessionUser) {
      const hidden = localStorage.getItem(`hiddenPosts_${sessionUser.uid}`);
      if (hidden) {
        setHiddenPosts(JSON.parse(hidden));
      }
    } else {
      setHiddenPosts([]);
    }
  };

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          name: userData.name || 'Anonymous',
          avatar: userData.photoURL || '/user.png'
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile");
    }
  };

  const fetchPosts = async () => {
    try {
      const sessionUser = getSessionUser();
      if (!sessionUser) {
        toast.error('Please login to view your posts');
        return;
      }

      setLoading(true);

      try {
        const postsRef = collection(db, 'posts');
        const q = query(
          postsRef,
          where('authorId', '==', sessionUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const fetchedPosts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            content: data.content,
            createdAt: data.createdAt,
            authorId: data.authorId,
            likes: data.likes || 0,
            images: data.images || [],
            comments: data.comments || [],
            author: data.author || { name: 'Anonymous', avatar: '/user.png' },
            metrics: {
              likes: data.likes || 0,
              comments: (data.comments || []).length,
              views: data.views || 0
            },
            shares: data.shares || 0,
            sharedBy: data.sharedBy || [],
            reports: data.reports || 0,
            reportedBy: data.reportedBy || [],
            likedBy: data.likedBy || [],
            videos: data.videos || []
          } as Post;
        });

        setPosts(fetchedPosts);
        calculateStats(fetchedPosts);
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      toast.error('Failed to fetch posts');
      setLoading(false);
    }
  };

  const calculateStats = (posts: Post[]) => {
    const stats = {
      totalPosts: posts.length,
      totalLikes: posts.reduce((acc, post) => acc + (post.likes || 0), 0),
      totalComments: posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0),
      engagement: posts.reduce((acc, post) => {
        const likes = post.likes || 0;
        const comments = post.comments?.length || 0;
        const views = post.metrics?.views || 0;
        return acc + likes + comments + views;
      }, 0)
    };
    setStats(stats);

    // Update total metrics as well
    setTotalMetrics({
      likes: stats.totalLikes,
      comments: stats.totalComments,
      views: posts.reduce((acc, post) => acc + (post.metrics?.views || 0), 0)
    });
  };

  const chartData = {
    labels: posts.map(post => post.content.substring(0, 20) + '...'),
    datasets: [
      {
        label: 'Likes',
        data: posts.map(post => post.likes || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.5)', // red
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Comments',
        data: posts.map(post => post.comments?.length || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Views',
        data: posts.map(post => post.metrics?.views || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.5)', // green
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Post Engagement Metrics',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
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

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewVideos([files[0]]);
    }
  };

  const handleCreatePost = async () => {
    try {
      const sessionUser = getSessionUser();
      if (!sessionUser) {
        toast.error('Please login to create a post');
        return;
      }

      setIsPosting(true);  // Set loading state

      // Upload images first if any
      const uploadedImages = await Promise.all(
        newImages.map(async (image) => {
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
            return {
              url: data.url,
              path: data.path
            };
          }
          return null;
        })
      );

      // Upload video if exists
      let uploadedVideos = [];
      if (newVideos.length > 0) {
        const formData = new FormData();
        formData.append('file', newVideos[0]);
        formData.append('folder', 'Posts');
        formData.append('access', 'private');
        formData.append('generateThumbnail', 'true');

        const response = await fetch('/api/storage', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          uploadedVideos = [{
            url: data.url,
            path: data.path,
            thumbnail: data.thumbnail
          }];
        }
      }

      // Create post document
      await addDoc(collection(db, 'posts'), {
        content: newPostContent,
        authorId: sessionUser.uid,
        author: {
          name: userProfile.name,
          avatar: userProfile.avatar
        },
        createdAt: serverTimestamp(),
        images: uploadedImages.filter(Boolean),
        videos: uploadedVideos,
        likes: 0,
        comments: [],
        metrics: {
          likes: 0,
          comments: 0,
          views: 0
        },
        shares: 0,
        sharedBy: [],
        reports: 0,
        reportedBy: [],
        likedBy: []
      });

      setNewPostContent('');
      setNewImages([]);
      setNewVideos([]);
      logAnalyticsEvent('post_created');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);  // Reset loading state
    }
  };

  // Calculate pagination values
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of posts section
    const postsSection = document.getElementById('posts-section');
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Explore Link - Mobile optimized */}
        <div className="text-center mb-6 sm:mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 py-8 sm:py-12 px-4 rounded-xl sm:rounded-2xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Posts Dashboard
          </h1>
          <Link 
            href="/explore"
            className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={20} className="mr-2" />
            <span>Go to Explore</span>
          </Link>
        </div>

        {/* Info Card - Mobile responsive */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 text-sm sm:text-base">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-blue-700">
                <span className="font-medium">Pro tip:</span> To add a title to your post, start the first line with #, ## or ###. For example:
                <br />
                ## My Post Title
                <br />
                Then write your post content on the next line.
              </p>
            </div>
          </div>
        </div>

        {/* Create Post Card Section - Mobile optimized */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Image
              src={userProfile.avatar || '/user.png'}
              alt="Current user"
              width={40}
              height={40}
              className="rounded-full hidden sm:block"
              unoptimized
            />
            <div className="flex-grow">
              <textarea
                placeholder="What's on your mind?"
                className="w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center justify-start gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="post-images"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={newVideos.length > 0}
                    />
                    <label 
                      htmlFor="post-images" 
                      className={`cursor-pointer text-purple-600 hover:text-purple-700 flex items-center gap-2 text-sm sm:text-base ${
                        newVideos.length > 0 ? 'text-gray-400 cursor-not-allowed' : ''
                      }`}
                    >
                      <ImagePlus size={18} />
                      <span>Add Images</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="post-videos"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                      disabled={newImages.length > 0}
                    />
                    <label 
                      htmlFor="post-videos" 
                      className={`cursor-pointer text-purple-600 hover:text-purple-700 flex items-center gap-2 text-sm sm:text-base ${
                        newImages.length > 0 ? 'text-gray-400 cursor-not-allowed' : ''
                      }`}
                    >
                      <Video size={18} />
                      <span>Add Video</span>
                    </label>
                  </div>
                </div>
                {(newPostContent.trim() || newImages.length > 0 || newVideos.length > 0) && (
                  <button
                    onClick={handleCreatePost}
                    disabled={isPosting}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPosting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </button>
                )}
              </div>
              
              {/* Preview Images */}
              {newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Preview */}
              {newVideos.length > 0 && (
                <div className="mt-4">
                  <div className="relative w-full" style={{ maxHeight: '300px' }}>
                    <video
                      src={URL.createObjectURL(newVideos[0])}
                      className="w-full rounded-lg"
                      controls
                      preload="metadata"
                      playsInline
                      muted={false}
                      style={{
                        maxHeight: '300px',
                        maxWidth: '300px',
                        objectFit: 'contain',
                        backgroundColor: '#000'
                      }}
                    />
                    <button
                      onClick={() => setNewVideos([])}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Mobile responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <MetricCard 
            title="Posts" 
            value={stats.totalPosts}
            icon={FileText}
            color="bg-blue-100"
          />
          <MetricCard 
            title="Likes" 
            value={stats.totalLikes}
            icon={ThumbsUp}
            color="bg-yellow-100"
          />
          <MetricCard 
            title="Comments" 
            value={stats.totalComments}
            icon={MessageSquare}
            color="bg-purple-100"
          />
          <MetricCard 
            title="Engagement" 
            value={stats.engagement}
            icon={BarChart2}
            color="bg-pink-100"
          />
        </div>

        {/* Chart Section - Mobile responsive */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Engagement Analytics</h2>
          <div className="h-[300px] sm:h-[400px]">
            <Bar data={chartData} options={chartOptions as any} />
          </div>
        </div>

        {/* Posts List Section - Mobile optimized */}
        <div className="bg-white rounded-lg shadow mb-5">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Posts</h2>
            <div className="space-y-4">
              {currentPosts.map(post => (
                <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
              ))}
            </div>

            {/* Pagination - Mobile responsive */}
            {posts.length > postsPerPage && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastPost, posts.length)}
                    </span>{' '}
                    of <span className="font-medium">{posts.length}</span> posts
                  </p>
                </div>
                <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`relative hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === index + 1
                          ? 'z-10 bg-purple-600 text-white'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({ title, value, icon: Icon, color }: { 
  title: string; 
  value: number; 
  icon: LucideIcon;
  color: string;
}) => (
  <div className={`${color} rounded-lg p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-gray-700" />
      <h3 className="text-gray-700 text-sm sm:text-base font-semibold uppercase tracking-wide">{title}</h3>
    </div>
    <div className="flex items-baseline mt-2 sm:mt-3">
      <p className="text-xl sm:text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <span className="ml-2 text-xs sm:text-sm text-gray-500">total</span>
    </div>
  </div>
);

const PostCard = ({ post, onRefresh }: { 
  post: Post; 
  onRefresh: () => void;
}) => {
  const [editImages, setEditImages] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatContent = (content: string) => {
    const MAX_LENGTH = 210;
    const lines = content.split('\n');
    const firstLine = lines[0];
    
    // Check if first line starts with title markers
    const isTitleLine = /^(#{1,3}|\*)\s/.test(firstLine);
    
    let title = '';
    let mainContent = content;
    
    if (isTitleLine) {
      // Remove the markers for title
      title = firstLine.replace(/^(#{1,3}|\*)\s/, '');
      mainContent = lines.slice(1).join('\n');
    }

    const shouldTruncate = mainContent.length > MAX_LENGTH && !isExpanded;
    const displayContent = shouldTruncate 
      ? mainContent.substring(0, MAX_LENGTH) + '...' 
      : mainContent;

    return (
      <>
        {isTitleLine && (
          <h2 className="font-bold text-base mb-2">
            {title}
          </h2>
        )}
        <div className="whitespace-pre-wrap">
          {displayContent}
          {shouldTruncate && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium ml-1"
            >
              Read more
            </button>
          )}
        </div>
      </>
    );
  };

  const handleEdit = async () => {
    const result: SweetAlertResult<EditFormValues> = await Swal.fire({
      title: 'Edit Post',
      html: `
        <div class="p-1">
          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Post Content</label>
            <textarea 
              id="content" 
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
              placeholder="What's on your mind?"
              rows="4"
              style="max-height: 400px; overflow-y: auto;"
            >${post.content}</textarea>
          </div>
          
          ${post.videos && post.videos[0] ? `
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Video</label>
              <div class="relative rounded-lg overflow-hidden bg-black">
                <video 
                  src="${post.videos[0].url}" 
                  controls 
                  class="w-full h-auto max-h-[200px] object-contain"
                ></video>
              </div>
            </div>
          ` : ''}
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ${post.videos && post.videos[0] ? 'Replace Video' : 'Add Video'}
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="videos" class="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Upload a video</span>
                    <input id="videos" type="file" accept="video/*" class="sr-only">
                  </label>
                </div>
                <p class="text-xs text-gray-500">MP4, WebM up to 10MB</p>
              </div>
            </div>
            <div id="video-preview" class="mt-2"></div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      width: '90%',
      customClass: {
        container: 'edit-post-modal',
        popup: 'rounded-xl shadow-xl max-w-2xl mx-auto',
        title: 'text-xl font-semibold text-gray-800 border-b pb-3',
        htmlContainer: 'pt-4',
        confirmButton: 'bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-medium transition-colors',
        cancelButton: 'bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg text-gray-800 font-medium transition-colors',
        actions: 'border-t pt-3 gap-3',
      },
      didOpen: () => {
        const videoInput = document.getElementById('videos') as HTMLInputElement;
        const previewContainer = document.getElementById('video-preview');
        const contentTextarea = document.getElementById('content') as HTMLTextAreaElement;
        
        // Set initial height based on content
        contentTextarea.style.height = 'auto';
        const initialHeight = Math.min(contentTextarea.scrollHeight, 400);
        contentTextarea.style.height = `${initialHeight}px`;

        // Auto-resize on input, but respect max height
        contentTextarea.addEventListener('input', () => {
          contentTextarea.style.height = 'auto';
          const newHeight = Math.min(contentTextarea.scrollHeight, 400);
          contentTextarea.style.height = `${newHeight}px`;
        });
        
        if (videoInput && previewContainer) {
          videoInput.onchange = () => {
            const files = videoInput.files;
            if (files && files.length > 0) {
              const urls = Array.from(files).map(file => URL.createObjectURL(file));
              previewContainer.innerHTML = `
                <div class="mt-4 space-y-2">
                  ${urls.map((url, index) => `
                    <div class="relative rounded-lg overflow-hidden bg-black">
                      <video 
                        src="${url}" 
                        controls 
                        class="w-full h-auto max-h-[200px] object-contain"
                      ></video>
                    </div>
                  `).join('')}
                </div>
              `;
            }
          };
        }
      },
      preConfirm: () => {
        const content = (document.getElementById('content') as HTMLTextAreaElement).value;
        const videoFiles = (document.getElementById('videos') as HTMLInputElement).files;
        
        if (!content.trim()) {
          Swal.showValidationMessage('Please enter some content');
          return false;
        }
        
        return {
          content: content,
          videos: videoFiles ? Array.from(videoFiles) : []
        };
      }
    });

    if (result.value) {
      try {
        const postRef = doc(db, 'posts', post.id);
        
        // Handle video upload/update
        let uploadedVideos = post.videos || [];
        if (result.value.videos && result.value.videos.length > 0) {
          // Delete old video if exists
          if (post.videos && post.videos[0]) {
            await fetch('/api/storage', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                path: decodeURIComponent(post.videos[0].path),
                access: 'private'
              })
            });
          }

          // Upload new video
          const formData = new FormData();
          formData.append('file', result.value.videos[0]);
          formData.append('folder', 'Posts');
          formData.append('access', 'private');
          formData.append('generateThumbnail', 'true');

          const response = await fetch('/api/storage', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          if (data.success) {
            uploadedVideos = [{
              url: data.url,
              path: data.path,
              thumbnail: data.thumbnail
            }];
          }
        }

        // Update post document
        await updateDoc(postRef, {
          content: result.value.content,
          videos: uploadedVideos,
          isEdited: true,
          lastEditedAt: serverTimestamp()
        });

        onRefresh();
        toast.success('Post updated successfully');
        logAnalyticsEvent('post_edited', { postId: post.id });
      } catch (error) {
        console.error('Error updating post:', error);
        toast.error('Failed to update post');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (confirmDelete.isConfirmed) {
        // Delete video if exists
        if (post.videos && post.videos[0]) {
          const videoPath = `Posts/${post.videos[0].path.split('/').pop()}`; // Ensure folder structure
          await fetch('/api/storage', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              path: videoPath,
              folder: 'Posts',
              access: 'private'
            })
          });
        }

        // Delete images if they exist
        if (post.images && post.images.length > 0) {
          await Promise.all(post.images.map(image => {
            const imagePath = `Posts/${image.path.split('/').pop()}`; // Ensure folder structure
            return fetch('/api/storage', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                path: imagePath,
                folder: 'Posts',
                access: 'private'
              })
            });
          }));
        }
        
        // Delete post document
        const postRef = doc(db, 'posts', post.id);
        await deleteDoc(postRef);
        
        onRefresh();
        toast.success('Post deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handlePostClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was on the edit or delete buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    
    // Store the post ID in sessionStorage for navigation
    sessionStorage.setItem('scrollToPost', post.id);
    router.push('/explore');
  };

  // Clean up video preview URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  return (
    <div 
      className="border rounded-lg p-2 sm:p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
      onClick={handlePostClick}
    >
      <div className="flex justify-between items-start gap-2 sm:gap-4">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-grow">
          <Image
            src={post.author.avatar || '/user.png'}
            alt={post.author.name}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            unoptimized
          />
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{post.author.name}</h4>
              <p className="text-xs sm:text-sm text-gray-500">
                {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Main Content Section */}
            <div className="space-y-2">
              {/* Video Icon and Indicator - Show only if first video exists */}
              {post.videos && post.videos[0] && (
                <div className={`flex items-center gap-2 text-blue-600 ${post.content.length < 100 ? 'mb-4 scale-110' : 'mb-2'}`}>
                  <Video 
                    size={post.content.length < 100 ? 32 : 24} 
                    className={`${post.content.length < 100 ? 'animate-pulse' : ''}`}
                  />
                  <span className="text-sm font-medium">Video Post</span>
                </div>
              )}

              {/* Post Content - Added text-justify */}
              <div className="text-gray-800 break-words whitespace-pre-line text-sm sm:text-base text-justify">
                {formatContent(post.content)}
              </div>
            </div>

            {/* Posts Icons Details Section */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <ThumbsUp size={14} className="sm:w-4 sm:h-4" />
                {post.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} className="sm:w-4 sm:h-4" />
                {post.comments?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 size={14} className="sm:w-4 sm:h-4" />
                {(post.likes || 0) + (post.comments?.length || 0) + (post.metrics?.views || 0)}
              </span>
              <span className="flex items-center gap-1">
                <Share2 size={14} className="text-blue-500 sm:w-4 sm:h-4" />
                {post.shares || 0}
              </span>
              <span className="flex items-center gap-1">
                <ShieldPlus size={14} className="text-red-500 sm:w-4 sm:h-4" />
                {post.reports || 0}
              </span>
              {post.videos && post.videos[0] && (
                <span className="flex items-center gap-1 text-blue-600" title='Video'>
                  <Video size={14} className="sm:w-4 sm:h-4" />
                  <span>Video</span>
                </span>
              )}
              {post.images && post.images.length > 0 && (
                <span className="flex items-center gap-1 text-purple-600">
                  <ImagePlus size={14} className="sm:w-4 sm:h-4" />
                  {post.images.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1 sm:space-x-2 shrink-0">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors z-10"
            title="Edit post"
          >
            <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors z-10"
            title="Delete post"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};