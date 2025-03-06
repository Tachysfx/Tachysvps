"use client"

import { ReactNode } from "react";
import {
  LayoutDashboard,
  UserCircle,
  Server,
  ArrowUpCircle,
  FileText,
  CreditCard,
  BanknoteIcon,
  Bell,
  Download,
  ShoppingBag,
  Users2,
  Users,
  BarChart2,
  HeadphonesIcon,
  LogInIcon,
} from "lucide-react";
import CardSideBar from "../components/SideBar";
import Link from 'next/link';
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore"
import Swal from 'sweetalert2';
import { db } from "../functions/firebase";


interface LayoutProps {
    children: ReactNode;
}


export default function Layout({ children }: LayoutProps) {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const currentActivities = userDoc.data()?.activities1 || [];

        const logoutActivity = {
          action: "Logout",
          date: new Date().toISOString(),
          details: "User logged out"
        };

        await updateDoc(userRef, {
          activities1: [logoutActivity, ...currentActivities].slice(0, 5)
        });
      }

      await signOut(auth);
      sessionStorage.clear();
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Successfully logged out.',
        confirmButtonColor: '#7A49B7'
      });
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to log out.',
        confirmButtonColor: '#7A49B7'
      });
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* <!-- Left Column --> */}
          <div className="d-none d-lg-block col-lg-2 border-end border-2 px-0">
            <div className="content-left">
              <ul className="nav flex-column space-y-1">
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" aria-current="page" href="/v6/dashboard">
                    <LayoutDashboard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" aria-current="page" href="/v6/account">
                    <UserCircle className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>My Account</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/vps">
                    <Server className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>VPS Management</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/vps/edits">
                    <ArrowUpCircle className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Upgrade</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/posts">
                    <FileText className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Posts</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/payment">
                    <CreditCard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Payments</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/withdrawal">
                    <BanknoteIcon className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Withdrawal</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/downloads">
                    <Download className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Downloads</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/seller">
                    <ShoppingBag className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Seller</span>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="" data-bs-toggle="dropdown" aria-expanded="false">
                    <Users2 className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Partnerships</span>
                  </Link>
                  <ul className="dropdown-menu position-static my-0 py-2 ms-4 border-0 rounded-lg shadow-lg">
                    <li><Link className="dropdown-item px-3 py-2 hover:bg-purple-600 group d-flex align-items-center" href="/partnership"><Users className="text-purple-600 me-2 group-hover:text-white" /> Affiliates & Promotions</Link></li>
                    <li><Link className="dropdown-item px-3 py-2 hover:bg-purple-600 group d-flex align-items-center" href="/v6/affiliates"><BarChart2 className="text-purple-600 me-2 group-hover:text-white" /> Dashboard</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/notifications">
                    <Bell className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span className="text-gray-800 group-hover:text-white">Notifications</span>
                    <span className="ms-2 text-purple-600 group-hover:text-white">
                      (0)
                      <span className="visually-hidden">unread notifications</span>
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/support">
                    <HeadphonesIcon className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Support</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout}
                    className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group w-full text-left"
                  >
                    <LogInIcon className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
              <hr />
              <CardSideBar />
            </div>
          </div>

          {/* <!-- Right Column --> */}
          <div className="col-12 col-lg-10">
            <div className="content-right">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
