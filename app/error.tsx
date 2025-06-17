"use client"

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 mb-5">
        <Image
            src='/error.svg'
            width={0}
            height={0}
            sizes="100vw"
            className="w-full max-w-md h-auto"
            alt="Error illustration"
            priority
        />
        <h2 className="text-xl font-bold mt-4 mb-4">Something went wrong!</h2>
        <div className="space-x-4">
            <button 
                onClick={() => reset()}
                className="btn btn-purple"
            >
                Try again
            </button>
            <button 
                onClick={() => router.back()}
                className="btn btn-outline-purple"
            >
                Go back
            </button>
        </div>
    </div>
  )
}