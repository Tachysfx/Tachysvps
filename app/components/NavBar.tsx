"use client"

import {
  Server,
  Store,
  User as UserIcon,
  HeadphonesIcon,
  CreditCard,
  Users2,
  HelpCircle,
  MapPin,
  Users,
  Building2,
  LayoutDashboard,
  UserCircle,
  Settings,
  ArrowUpCircle,
  FileText,
  BanknoteIcon,
  Download,
  Bell
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useEffect, useState } from 'react';
import { auth, db } from '../functions/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Role, User as UserType } from '../types/index';

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data() as UserType;
          
          if (userData) {
            setUser(firebaseUser);
            setIsAdmin(userData.role === Role.Admin);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Nav auth state change error:', error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Common navigation items for all users
  const commonNavItems = (
    <>
      <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 group boldd" href="/#pricing" data-bs-toggle="dropdown" aria-expanded="false">
          <Server className="text-purple-600 w-5 h-5 me-3 md:group-hover:text-purple-600 group-hover:text-white" />
          Forex VPS Plans
        </Link>
        <ul className="dropdown-menu">
          <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item group" href="/#pricing">Cheap Forex VPS <small>Starts $34 per month</small></Link></li>
          <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item group" href="/#pricing">Best Forex VPS <small>starts $80 per month</small></Link></li>
          <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item group" href="/#pricing">Virtual Dedicated Server <small>starts $250 per month</small></Link></li>
        </ul>
      </li>
      <li className="nav-item" data-bs-dismiss="offcanvas" aria-label="Close">
        <Link className="nav-link d-flex align-items-center px-3 py-2 group boldd" href="/market">
          <Store className="text-purple-600 w-5 h-5 me-3 md:group-hover:text-purple-600 group-hover:text-white" />
          Algos Market
        </Link>
      </li>
      <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 group boldd" href="/partnership" data-bs-toggle="dropdown" aria-expanded="false">
          <Users2 className="text-purple-600 w-5 h-5 me-3 md:group-hover:text-purple-600 group-hover:text-white" />
          Partnerships
        </Link>
          <ul className="dropdown-menu">
            <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item d-flex align-items-center hover:bg-purple-600 group" href="/partnership"><Users2 className="text-purple-600 me-2 group-hover:text-white" />Affiliates & Promotions</Link></li>
            {user && (
              <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item d-flex align-items-center hover:bg-purple-600 group" href="/v6/affiliates"><LayoutDashboard className="text-purple-600 me-2 group-hover:text-white" />Dashboard</Link></li>
            )}
          </ul>
        </li>
        <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
        <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/#pricing">
          <CreditCard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
          Pricing
        </Link>
      </li>
      <li className="nav-item dropdown separate">
        <Link className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group boldd" href="/about" data-bs-toggle="dropdown" aria-expanded="false">
          <Users className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
          About Us
        </Link>
        <ul className="dropdown-menu">
          <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item d-flex align-items-center hover:bg-purple-600 group" href="/about#location"><MapPin className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />Locations</Link></li>
          <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item d-flex align-items-center hover:bg-purple-600 group" href="/#faq"><HelpCircle className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />FAQs</Link></li>
          <li data-bs-dismiss="offcanvas" aria-label="Close"><Link className="dropdown-item d-flex align-items-center hover:bg-purple-600 group" href="/about#team"><Building2 className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />Team</Link></li>
        </ul>
      </li>
      <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
        <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/contact-us">
          <HeadphonesIcon className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
          Support
        </Link>
      </li>
      <div className='separate mb-5'>
          <br />
          <br />
          <br />
      </div>
    </>
  );

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light sticky-top bg-white py-0" aria-label="Offcanvas navbar large">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt="blur"
              className="align-middle logo"
            />
            <span className='text-purple'>Tachys FX</span>
          </Link>

          <div className='user p-1 me-2'>
            <div className='d-flex'>
              <LanguageSelector />
              <Link href="/v6/account" className='text-decoration-none'>
                <UserIcon className="text-purple-600 w-8 h-8" />
              </Link>
            </div>
          </div>
          <div className="offcanvas offcanvas-start text-bg-light" tabIndex={-1} id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
            <div className="offcanvas-header py-2">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="blur"
                className="align-middle logo"
              />
              <span className='text-purple'>Tachys FX</span>
              <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            {/* Off Canvas Body Section */}
            <div className="offcanvas-body ps-1">
              <ul className="navbar-nav justify-content-end flex-grow-1 d-md-flex gap-md-5">
                {/* Authenticated user items */}
                {user && (
                  <>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" aria-current="page" href="/v6/dashboard">
                        <LayoutDashboard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/account">
                        <UserCircle className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        My Account
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/vps">
                        <Server className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>VPS Management</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/vps/edits">
                        <ArrowUpCircle className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>Upgrade</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/seller">
                        <Store className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        Seller
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/posts">
                        <FileText className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>Posts</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/payment">
                        <CreditCard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>Payments</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/withdrawal">
                        <BanknoteIcon className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>Withdrawal</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/downloads">
                        <Download className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span>Downloads</span>
                      </Link>
                    </li>
                    <li className="nav-item separate" data-bs-dismiss="offcanvas" aria-label="Close">
                      <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/v6/notifications">
                        <Bell className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                        <span className="text-gray-800 group-hover:text-white">Notifications</span>
                        <span className="ms-2 text-purple-600 group-hover:text-white">
                          (0)
                          <span className="visually-hidden">unread notifications</span>
                        </span>
                      </Link>
                    </li>
                  </>
                )}

                {/* Common items for all users */}
                {commonNavItems}

                {/* Admin-only items */}
                {isAdmin && (
                  <li className="nav-item separate mb-5" data-bs-dismiss="offcanvas" aria-label="Close">
                    <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/dashboard">
                      <Settings className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {/* Mobile-only items */}
                <li className="nav-item nutch">
                  <LanguageSelector />
                </li>
                <li className="nav-item nutch">
                  <Link className="nav-link" href="/v6/account">
                    <button className='nav-butt'>
                      Account
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
