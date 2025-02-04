

export default function Loading() {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
      <p className="text-purple-600 font-medium text-center">Loading Tachys FX...</p>
    </div>
  </div>
}