'use client';

import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Role } from '../types/index';

export default function ProtectedV6Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== Role.Admin) {
        router.push('/') // Redirect non-admin users
      }
    } else if (status === "unauthenticated") {
      router.push('/') // Redirect unauthenticated users
    }
  }, [session, status, router])

  // Return children to allow AuthHandler to manage authentication
  return children
}