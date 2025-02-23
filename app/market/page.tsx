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
} from "lucide-react";
import MarketClient from '../components/Display';
import MarketFrontData from '../lib/MarketFrontData';
import Image from 'next/image';
import Link from 'next/link';
import CardSideBar from '../components/SideBar';
import { Algo } from '../types/index';
const baller = '/baller.png'

export default async function Market(){
  const algos: Algo[] = await MarketFrontData();

  // Enrich algos by calculating average rating and adding fallback details
  const enrichedAlgos: Algo[] = algos.map((algo) => {
    return {
      ...algo,
      sellerName: algo.sellerName || "Unknown Seller", // Fallback seller name
      sellerLocation: algo.sellerLocation || "Unknown Location", // Fallback location
      rating: algo.rating, // Ensure `rating` remains numeric
      ratingCount: algo.ratingCount || algo.ratings.length, // Total ratings count
    };
  });


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
              </ul>
              <hr />
              <CardSideBar />
            </div>
          </div>

          {/* <!-- Right Column --> */}
          <div className="col-12 col-lg-10">
            <div className="content-right">
              <h5>Algo Market for Trading Robots, Expert Advisors, Indicators, Copy Trading and Trading Applications</h5>
              <div className="row border-bottom">
                {/* <!-- First Column --> */}
                <div className="d-none d-lg-block col-lg-1 px-0 smalz">
                  <Image
                    src={baller}
                    width={65}
                    height={90}
                    alt="blur"
                    className="mx-auto ps-2"
                  />
                </div>

                {/* <!-- Main Content Column --> */}
                <div className="col-12 col-lg-8 px-0 text-center">
                  <p>
                    Every day, hundreds of new automated trading solutions emerge in the forex market. Select the ideal algorithm from thousands of options, and eliminate the hassle of manual trading routines. Trading robots operate automatically in the markets, while indicators analyze price quotes to identify patterns and trends. These tools empower you to make better-informed trading decisions and seize more opportunities.
                  </p>
                </div>

                {/* <!-- Third Column --> */}
                <div className="d-none d-lg-block col-lg-3 pe-2 mb-2 smalz">
                  <p className="mb-1 pb-1">
                    Sign up as a Seller to publish your trading applications. Showcase and sell your algorithms, trading robots, and Expert Advisors (EAs) in our store.
                  </p>
                  <Link href="./v6/seller" type='button' className="btn btn-sm btn-purple d-flex justify-content-center mx-3">
                    Register
                  </Link>
                </div>
              </div>

              <MarketClient enrichedAlgos={enrichedAlgos} />
            </div>
          </div>
        </div>
      </div>


      
    </>
  )
  
}