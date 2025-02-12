'use client';

import { useState, useEffect } from 'react';
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
  ShieldPlus
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

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
            likedBy: data.likedBy || []
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

  const handleCreatePost = async () => {
    try {
      const sessionUser = getSessionUser();
      if (!sessionUser) {
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

      await addDoc(collection(db, 'posts'), {
        content: newPostContent,
        authorId: sessionUser.uid,
        author: {
          name: userProfile.name,
          avatar: userProfile.avatar
        },
        createdAt: serverTimestamp(),
        images: uploadedImages,
        likes: 0,
        comments: [],
        likedBy: [],
        metrics: {
          likes: 0,
          comments: 0,
          views: 0
        },
        shares: 0,
        sharedBy: [],
        reports: 0,
        reportedBy: []
      });

      setNewPostContent('');
      setNewImages([]);
      logAnalyticsEvent('post_created');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
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

  const handleReport = async (postId: string) => {
    try {
      const sessionUser = getSessionUser();
      if (!sessionUser) {
        toast.error('Please login to report posts');
        return;
      }

      // Add post to hidden posts
      const updatedHiddenPosts = [...hiddenPosts, postId];
      setHiddenPosts(updatedHiddenPosts);
      
      // Save to localStorage
      localStorage.setItem(`hiddenPosts_${sessionUser.uid}`, JSON.stringify(updatedHiddenPosts));

      // Add report to Firestore
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const post = postDoc.data() as Post;

      // Check if user has already reported
      if (post.reportedBy?.includes(sessionUser.uid)) {
        toast.info('You have already reported this post');
        return;
      }

      // Update report count and add user to reportedBy array
      await updateDoc(postRef, {
        reports: increment(1),
        reportedBy: arrayUnion(sessionUser.uid)
      });

      toast.success('Post has been reported and hidden from your feed');
      logAnalyticsEvent('post_reported', { postId });
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Failed to report post');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const sessionUser = getSessionUser();
      if (!sessionUser) {
        toast.error('Please login to share posts');
        return;
      }

      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const post = postDoc.data() as Post;

      // Check if user has already shared
      if (post.sharedBy?.includes(sessionUser.uid)) {
        toast.info('You have already shared this post');
        return;
      }

      // Update share count and add user to sharedBy array
      await updateDoc(postRef, {
        shares: increment(1),
        sharedBy: arrayUnion(sessionUser.uid)
      });

      logAnalyticsEvent('post_shared', { postId });
      toast.success('Post shared successfully');
    } catch (error) {
      console.error('Error updating share count:', error);
      toast.error('Failed to share post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-purple-600 font-medium text-center">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Explore Link */}
        <div className="text-center mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 py-12 px-4 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Posts Dashboard
          </h1>
          <div className="flex justify-between items-center justify-content-center">
          <Link 
            href="/v6/explore"
              className="btn btn-light d-flex"
          >
              <BookOpen size={20} className='me-2' />
              <span>Go to Explore</span>
          </Link>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Pro tip:</span> Add a title to your post by starting the first line with ## or ### (e.g. ## My Post Title). 
                This title can be used for filtering, ranking and searching posts.
              </p>
            </div>
          </div>
        </div>

        {/* Create Post Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
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
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />
              <div className="mt-2 flex items-center justify-between">
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
                    <ImagePlus size={20} />
                    <span>Add Images</span>
                  </label>
                </div>
                {(newPostContent.trim() || newImages.length > 0) && (
                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Post
                  </button>
                )}
              </div>
              {/* Preview Images */}
              {newImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
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
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            title="Total Posts" 
            value={stats.totalPosts}
            icon={FileText}
            color="bg-blue-100"
          />
          <MetricCard 
            title="Total Likes" 
            value={stats.totalLikes}
            icon={ThumbsUp}
            color="bg-yellow-100"
          />
          <MetricCard 
            title="Total Comments" 
            value={stats.totalComments}
            icon={MessageSquare}
            color="bg-purple-100"
          />
          <MetricCard 
            title="Total Engagement" 
            value={stats.engagement}
            icon={BarChart2}
            color="bg-pink-100"
          />
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Engagement Analytics</h2>
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions as any} />
          </div>
        </div>

        {/* Posts List Section */}
        <div className="bg-white rounded-lg shadow" id="posts-section">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
            <div className="space-y-4">
              {currentPosts.map(post => (
                <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
              ))}
            </div>

            {/* Pagination */}
            {posts.length > postsPerPage && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastPost, posts.length)}
                      </span>{' '}
                      of <span className="font-medium">{posts.length}</span> posts
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                          currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-700'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === index + 1
                              ? 'z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                          currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-gray-700'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
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
  <div className={`${color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
    <div className="flex items-center gap-2">
      <Icon size={20} className="text-gray-700" />
      <h3 className="text-gray-700 text-base font-semibold uppercase tracking-wide">{title}</h3>
    </div>
    <div className="flex items-baseline mt-3">
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <span className="ml-2 text-sm text-gray-500">total</span>
    </div>
  </div>
);

const PostCard = ({ post, onRefresh }: { 
  post: Post; 
  onRefresh: () => void;
}) => {
  const [editImages, setEditImages] = useState<File[]>([]);
  const router = useRouter();

  // Add this helper function to format content
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const handleEdit = async () => {
    const result: SweetAlertResult<EditFormValues> = await Swal.fire({
      title: 'Edit Post',
      html: `
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 text-left mb-2">Content</label>
            <textarea 
              id="content" 
              class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[170px]"
              style="min-height: 170px;"
            >${post.content}</textarea>
          </div>
          
          ${post.images && post.images.length > 0 ? `
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 text-left mb-2">Current Images</label>
              <div class="grid grid-cols-3 gap-3">
                ${post.images.map((img, idx) => `
                  <div class="relative rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <img 
                      src="${img.url}" 
                      alt="Current ${idx + 1}" 
                      class="w-full h-24 object-cover"
                    />
                  </div>
                `).join('')}
              </div>
              <p class="mt-2 text-sm text-gray-500 text-left">Uploading new images will replace the current ones</p>
            </div>
          ` : ''}
          
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 text-left mb-2">
              ${post.images && post.images.length > 0 ? 'Replace Images' : 'Add Images'}
            </label>
            <input 
              type="file" 
              id="images" 
              accept="image/*" 
              multiple 
              class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100"
            />
          </div>
          <div id="image-preview" class="grid grid-cols-3 gap-3 mt-2"></div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      width: '600px',
      customClass: {
        container: 'edit-post-modal',
        popup: 'rounded-lg shadow-xl',
        title: 'text-xl font-semibold text-gray-800 border-b pb-3',
        htmlContainer: 'pt-4',
        confirmButton: 'bg-purple-600 hover:bg-purple-700',
        cancelButton: 'bg-gray-500 hover:bg-gray-600',
        actions: 'border-t pt-3',
      },
      didOpen: () => {
        // Add image preview functionality
        const imageInput = document.getElementById('images') as HTMLInputElement;
        const previewContainer = document.getElementById('image-preview');
        
        if (imageInput && previewContainer) {
          imageInput.onchange = () => {
            previewContainer.innerHTML = '';
            if (imageInput.files) {
              Array.from(imageInput.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  previewContainer.innerHTML += `
                    <div class="relative rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img src="${e.target?.result}" class="w-full h-24 object-cover" />
                    </div>
                  `;
                };
                reader.readAsDataURL(file);
              });
            }
          };
        }
      },
      preConfirm: () => {
        const content = (document.getElementById('content') as HTMLTextAreaElement).value;
        const imageFiles = (document.getElementById('images') as HTMLInputElement).files;
        if (!content.trim()) {
          Swal.showValidationMessage('Please enter some content');
          return false;
        }
        return {
          content: content,
          images: imageFiles ? Array.from(imageFiles) : []
        };
      }
    });

    if (result.value) {
      try {
        const postRef = doc(db, 'posts', post.id);
        
        // Upload new images if any
        const uploadedImages: Array<{ url: string; path: string }> = [];
        if (result.value.images.length > 0) {
          for (const image of result.value.images) {
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
        if (result.value.images.length > 0 && post.images && post.images.length > 0) {
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
          content: result.value.content,
          images: uploadedImages.length > 0 ? uploadedImages : (post.images || []),
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // Delete all images first if they exist
        if (post.images && post.images.length > 0) {
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
        
        // Delete the post document
        const postRef = doc(db, 'posts', post.id);
        await deleteDoc(postRef);
        
        onRefresh();
        toast.success('Post deleted successfully');
        logAnalyticsEvent('post_deleted', { postId: post.id });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const handlePostClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was on the edit or delete buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    
    // Navigate to Explore page and scroll to this post
    router.push('/v6/explore');
    // Add a small delay to ensure the Explore page is loaded
    setTimeout(() => {
      const postElement = document.getElementById(`post-${post.id}`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        postElement.classList.add('post-highlight');
        setTimeout(() => {
          postElement.classList.remove('post-highlight');
        }, 2000);
      }
    }, 500);
  };

  return (
    <div 
      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
      onClick={handlePostClick}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start space-x-3 flex-grow">
          <Image
            src={post.author.avatar || '/user.png'}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
              <p className="text-sm text-gray-500">
                {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-gray-800 break-words whitespace-pre-line">
              {formatContent(post.content)}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <ThumbsUp size={16} />
                {post.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={16} />
                {post.comments?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 size={16} />
                {(post.likes || 0) + (post.comments?.length || 0) + (post.metrics?.views || 0)}
              </span>
              <span className="flex items-center gap-1">
                <Share2 size={16} className="text-blue-500" />
                {post.shares || 0} shares
              </span>
              <span className="flex items-center gap-1">
                <ShieldPlus size={16} className="text-red-500" />
                {post.reports || 0} reports
              </span>
              {post.images && post.images.length > 0 && (
                <span className="flex items-center gap-1 text-purple-600">
                  <ImagePlus size={16} />
                  {post.images.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors z-10"
            title="Edit post"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors z-10"
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};