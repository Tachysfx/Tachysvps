'use client';

import { useState, useEffect } from 'react';
import { realtimeDb, db } from '../../functions/firebase';
import { ref, onValue } from 'firebase/database';
import { collection, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserCheck
} from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  name: string;
  email: string;
  downloads: string[];
  status: 'active' | 'inactive';
  joinDate: string;
}

interface ActiveUser {
  email: string;
  lastActive: number;
  name: string;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
}

const MetricCard = ({ title, value, icon, color }: MetricCardProps) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <FontAwesomeIcon icon={icon} className="text-3xl opacity-80" />
    </div>
  </div>
);

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<{[key: string]: ActiveUser}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Listen to active users in real-time
    const activeUsersRef = ref(realtimeDb, 'activeUsers');
    const unsubscribe = onValue(activeUsersRef, (snapshot) => {
      const activeUsersData = snapshot.val() || {};
      
      // Filter out stale sessions (inactive for more than 15 minutes)
      const now = Date.now();
      const filteredActiveUsers = Object.entries(activeUsersData).reduce((acc, [key, user]: [string, any]) => {
        const lastActive = user.lastActive;
        if (now - lastActive < 15 * 60 * 1000) { // 15 minutes in milliseconds
          acc[key] = user;
        }
        return acc;
      }, {} as {[key: string]: ActiveUser});

      setActiveUsers(filteredActiveUsers);
      
      // Update metrics for active users
      setMetrics(prev => ({
        ...prev,
        activeUsers: Object.keys(filteredActiveUsers).length
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        const usersData = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          const activeUserData = activeUsers[doc.id];
          const isActive = activeUserData !== undefined && 
                          Date.now() - activeUserData.lastActive < 15 * 60 * 1000; // 15 minutes
          
          return {
            id: doc.id,
            name: data.name || activeUserData?.name || 'N/A',
            email: data.email || 'N/A',
            downloads: data.downloads || [],
            status: isActive ? 'active' : 'inactive',
            joinDate: data.createdAt || 'N/A',
          } as User;
        });
        
        setUsers(usersData);
        setMetrics(prev => ({
          ...prev,
          totalUsers: usersData.length,
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-purple-600 font-medium text-center">Loading Tachys FX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={faUsers}
          color="text-blue-600"
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          icon={faUserCheck}
          color="text-green-600"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.downloads?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(user.joinDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
