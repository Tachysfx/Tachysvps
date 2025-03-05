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
  Code,
  LineChart,
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
              {/* Intro Section Start */}
              <div className="py-3">
                {/* Header */}
                <div className="text-center mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-purple-800">
                    Algorithm Marketplace
                  </h1>
                  <h2 className="text-xl md:text-2xl text-gray-700 font-medium">
                    Trading Bots • Expert Advisors • Technical Indicators • Copy Trading Systems
                  </h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="row items-center">
                    {/* Left Column - Image */}
                    <div className="d-none d-lg-flex col-lg-2 justify-content-center">
                      <div className="relative">
                        <Image
                          src={baller}
                          width={120}
                          height={120}
                          alt="Algorithm marketplace"
                          className="rounded-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-purple-800 text-white text-xs px-2 py-1 rounded-full">
                          Verified
                        </div>
                      </div>
                    </div>

                    {/* Middle Column - Main Content */}
                    <div className="col-12 col-lg-7">
                      <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                          Welcome to the premier destination for professional trading algorithms. Our expertly curated marketplace brings together the most sophisticated automated trading bots, cutting-edge technical indicators, and proven copy trading systems. Discover why thousands of traders trust our marketplace to enhance their trading journey:
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Code className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-700">Trading Bots</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <LineChart className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-700">Indicators</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">Copy Trading</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Users className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-sm text-gray-700">Signals</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - CTA */}
                    <div className="col-12 col-lg-3 mt-6 lg:mt-0">
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 text-center">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Become a Seller
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Share your trading algorithms and earn. Join our growing community of algorithm developers.
                        </p>
                        <Link 
                          href="./v6/seller" 
                          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Start Selling
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 rounded-lg bg-purple-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-3xl font-bold text-white mb-2">1,000+</div>
                        <div className="text-sm font-medium text-white">Active Algorithms</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-3xl font-bold text-white mb-2">1.2K+</div>
                        <div className="text-sm font-medium text-white">Monthly Users</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-3xl font-bold text-white mb-2">100%</div>
                        <div className="text-sm font-medium text-white">Satisfaction Rate</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-3xl font-bold text-white mb-2">24/7</div>
                        <div className="text-sm font-medium text-white">Support Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Intro Section End */}

              <MarketClient enrichedAlgos={enrichedAlgos} />
            </div>
          </div>
        </div>
      </div>


      
    </>
  )
  
}