"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faChartLine, 
  faServer, 
  faRobot, 
  faDollarSign,
  faCode,
  faCopy,
  faSignal,
  faHeadset,
  faCircleInfo,
  faClock,
  faArrowRight,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../functions/firebase';
import { toast } from "react-toastify";
import CountUp from 'react-countup';
import { Activity, UrgentNotification, StatCard } from '../../types';

const congrats = '/firework2.png'

const severityStyles = {
  critical: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  warning: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  info: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  success: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" }
};

interface UserData {
  name: string;
  vpsPlans: any[];
  notifications: any[];
  appsCount: number;
  subscriptionsCount: number;
  signalsCount: number;
  activities2: Activity[];
  urgent: UrgentNotification[];
  statistics: {
    tradingVolume: number;
    monthlyProfit: number;
  }
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData>({
    name: "User",
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

  const [activities, setActivities] = useState<Activity[]>([]);
  const [urgentNotifications, setUrgentNotifications] = useState<UrgentNotification[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionUserString = sessionStorage.getItem("user");
        if (!sessionUserString) {
          toast.error("No user session found.");
          return;
        }

        const sessionUser = JSON.parse(sessionUserString);
        const userDoc = await getDoc(doc(db, "users", sessionUser.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          // Process activities2
          const userActivities = data.activities2 || [];
          const sortedActivities = userActivities
            .sort((a: Activity, b: Activity) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
            .slice(0, 5);

          // Process urgent notifications
          const urgentNotifs = data.urgent || [];
          const sortedUrgent = urgentNotifs
            .sort((a: UrgentNotification, b: UrgentNotification) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
            .slice(0, 5);

          setUserData({
            name: data.name || "User",
            vpsPlans: data.vpsPlans || [],
            notifications: data.notifications || [],
            appsCount: data.appsCount || 0,
            subscriptionsCount: data.subscriptionsCount || 0,
            signalsCount: data.signalsCount || 0,
            activities2: sortedActivities,
            urgent: sortedUrgent,
            statistics: {
              tradingVolume: data.statistics?.tradingVolume || 0,
              monthlyProfit: data.statistics?.monthlyProfit || 0
            }
          });

          setActivities(sortedActivities);
          setUrgentNotifications(sortedUrgent);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const trimData = async () => {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) return;

      try {
        const sessionUser = JSON.parse(sessionUserString);
        const userRef = doc(db, "users", sessionUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updates: any = {};

          // Trim activities2 if needed
          if (userData.activities2?.length > 5) {
            const sortedActivities = userData.activities2
              .sort((a: Activity, b: Activity) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )
              .slice(0, 5);
            updates.activities2 = sortedActivities;
          }

          // Trim urgent if needed
          if (userData.urgent?.length > 5) {
            const sortedUrgent = userData.urgent
              .sort((a: UrgentNotification, b: UrgentNotification) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )
              .slice(0, 5);
            updates.urgent = sortedUrgent;
          }

          // Only update if there are changes
          if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
          }
        }
      } catch (error) {
        console.error("Error trimming data:", error);
      }
    };

    const intervalId = setInterval(trimData, 60000);
    trimData(); // Initial check
    return () => clearInterval(intervalId);
  }, []);

  const statistics: StatCard[] = [
    { 
      title: "Total Trading Volume", 
      value: userData.statistics.tradingVolume, 
      icon: faChartLine, 
      color: "bg-gradient-purple" 
    },
    { 
      title: "Active VPS Servers", 
      value: userData.vpsPlans.length, 
      icon: faServer, 
      color: "bg-gradient-blue" 
    },
    { 
      title: "Running Bots", 
      value: userData.appsCount, 
      icon: faRobot, 
      color: "bg-gradient-green" 
    },
    { 
      title: "Profit This Month", 
      value: userData.statistics.monthlyProfit, 
      icon: faDollarSign, 
      color: "bg-gradient-orange" 
    },
  ];

  const services = [
    { 
      title: "VPS Hosting", 
      count: userData.vpsPlans.length, 
      icon: faServer, 
      color: "purple" 
    },
    { 
      title: "Trading Apps", 
      count: userData.appsCount, 
      icon: faCode, 
      color: "blue" 
    },
    { 
      title: "Copy Trading", 
      count: userData.subscriptionsCount, 
      icon: faCopy, 
      color: "green" 
    },
    { 
      title: "Trading Signals", 
      count: userData.signalsCount, 
      icon: faSignal, 
      color: "orange" 
    }
  ];

  return (
    <div className="container pt-3 pb-5">
      {/* Welcome Alert */}
      <div className="bg-gradient-custom text-white rounded-xl p-4 shadow-lg my-3">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={congrats}
            width={45}
            height={45}
            alt="Welcome"
            className="rounded-full bg-white/20 p-2"
          />
          <h4 className="text-xl font-bold m-0">Welcome back, {userData.name}!</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faCheck} className="text-white"/>
              High-performance VPS services
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faCheck} className="text-white"/>
              Copy Trading feature
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faCheck} className="text-white"/>
              Expert Trading Signals
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faCheck} className="text-white"/>
              Trading Bots Marketplace
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="row mb-4">
        {statistics.map((stat, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-3">
            <div className={`card stat-card ${stat.color} text-white`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2">{stat.title}</h6>
                    <h3 className="card-title mb-0 text-center">
                      {stat.title.includes("Volume") || stat.title.includes("Profit") ? '$' : ''}
                      <CountUp end={stat.value} separator="," duration={2.5} />
                    </h3>
                  </div>
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={stat.icon} size="2x" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="row mb-4">
        {/* Recent Activities Section */}
        <div className="col-md-6">
          <div className="card h-100 shadow-lg hover:shadow-xl transition-shadow duration-200 border-0 rounded-xl overflow-hidden">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title text-xl font-bold text-purple-600 mb-0">Recent Activities</h5>
                <button className="btn btn-link text-purple hover:text-purple-700 font-medium transition-colors duration-200">
                  View All
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
              <div className="activity-timeline space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={index} className="activity-item flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="activity-icon bg-purple-100 text-purple-600 p-3 rounded-lg mr-4">
                        <FontAwesomeIcon icon={faBell} className="text-xl" />
                      </div>
                      <div className="activity-content flex-1">
                        <h6 className="text-lg font-semibold mb-1">{activity.title}</h6>
                        <p className="text-gray-600 mb-1">{activity.description}</p>
                        <small className="text-gray-500 flex items-center">
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-purple-100 rounded-full p-4 mb-4">
                      <FontAwesomeIcon icon={faChartLine} className="text-purple-600 text-3xl" />
                    </div>
                    <h6 className="text-lg font-semibold text-gray-700 mb-2">No Recent Activities</h6>
                    <p className="text-gray-500 max-w-sm">
                      Start using our services to see your activities here. Try deploying a VPS or starting a trading bot!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Urgent Section */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0 rounded-xl">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title text-xl font-bold text-purple-600 mb-0">Urgent!!!</h5>
                <FontAwesomeIcon icon={faCircleInfo} className="text-purple-400 text-lg" />
              </div>
              <div className="status-items space-y-4">
                {urgentNotifications.length > 0 ? (
                  urgentNotifications.map((item, index) => {
                    const style = severityStyles[item.severity];
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${style.bg} ${style.border} transition-all duration-200 hover:shadow-md`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h6 className={`text-lg font-semibold mb-2 ${style.text}`}>
                              {item.title}
                            </h6>
                            <p className="text-gray-600 text-sm mb-0">{item.message}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text} flex items-center gap-2`}>
                            <FontAwesomeIcon icon={faClock} className="text-xs" />
                            {item.timeLeft}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-green-100 rounded-full p-4 mb-4">
                      <FontAwesomeIcon icon={faCheck} className="text-green-600 text-3xl" />
                    </div>
                    <h6 className="text-lg font-semibold text-gray-700 mb-2">All Clear!</h6>
                    <p className="text-gray-500 max-w-sm">
                      No urgent notifications at the moment. Everything is running smoothly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview Section */}
      <div className="row mb-4"  id="serve">
        <div className="col-12">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h5 className="text-2xl font-bold text-gray-800 mb-6">Services Overview</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${service.color}-100`}>
                        <FontAwesomeIcon 
                          icon={service.icon} 
                          className={`text-${service.color}-600 text-xl`}
                        />
                      </div>
                      <div>
                        <h6 className="font-semibold text-gray-800">{service.title}</h6>
                        <p className="text-sm text-gray-600 font-medium">
                          <span className={`text-${service.color}-600 font-bold`}>{service.count}</span> Active
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="row mb-4">
        {[
          { id: 1, label: "Buy New VPS", icon: faServer, link: "/plans/lite" },
          { id: 2, label: "Buy Trading Bots", icon: faRobot, link: "/market" },
          { id: 3, label: "Subscribe to Signals", icon: faSignal, link: "https://www.zulutrade.com/register/?ref=2760948&utm_medium=affiliate&utm_source=2760948&utm_campaign=affiliate" },
          { id: 4, label: "Support Ticket", icon: faHeadset, link: "/v6/support" },
        ].map((action) => (
          <div key={action.id} className="col-6 col-md-3">
            <div className="card border-purple mb-3">
              <Link href={action.link}>
                <div className="card-body text-center text-dark carrds d-flex flex-column align-items-center">
                  <div className="mb-2">
                    <FontAwesomeIcon icon={action.icon} size="2x" className="text-purple" />
                  </div>
                  <h6 className="card-title mb-0">{action.label}</h6>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}