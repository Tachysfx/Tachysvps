"use client"

import Link from "next/link"
import { LayoutDashboard, Users, BadgePoundSterling, Server, Bot, Album, CreditCard, Store, FileEdit, Home } from 'lucide-react'
import AdminProtected from "../components/AdminProtected"

interface LayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <AdminProtected>
        <div className="container-fluid">
            <div className="row">
                {/* <!-- Left Column --> */}
                <div className="d-none d-lg-block col-lg-2 border-end border-2 px-0">
                    <div className="content-left">
                        <ul className="nav flex-column space-y-1">
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" aria-current="page" href="/admin/dashboard">
                                <LayoutDashboard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Dashboard</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" aria-current="page" href="/admin/users">
                                <Users className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>User Management</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" aria-current="page" href="/admin/sales">
                                <BadgePoundSterling className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Sales Funnel</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/vps">
                                <Server className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>VPS Management</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/algos">
                                <Bot className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Algos</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/orders">
                                <Album className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Orders</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/payments">
                                <CreditCard className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Payments</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/store">
                                <Store className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Store Management</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/admin/posts">
                                <FileEdit className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Posts</span>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center px-3 py-2 hover:bg-purple-600 hover:text-white group" href="/">
                                <Home className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
                                <span>Back to Home</span>
                            </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <!-- Main Content --> */}
                <div className="col-lg-10 px-0">
                    {children}
                </div>
            </div>
        </div>
    </AdminProtected>
  )
} 