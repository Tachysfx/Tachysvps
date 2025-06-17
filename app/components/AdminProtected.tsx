"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '../types'

interface AdminProtectedProps {
  children: React.ReactNode
}

const AdminProtected = ({ children }: AdminProtectedProps) => {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const sessionData = sessionStorage.getItem('user')
    if (sessionData) {
      const userData = JSON.parse(sessionData)
      if (userData.role === Role.Admin) {
        setIsAdmin(true)
        return
      }
    }
    router.push('/')
  }, [router])

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}

export default AdminProtected 