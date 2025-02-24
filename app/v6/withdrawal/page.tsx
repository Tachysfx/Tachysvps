'use client'

import { useState, useEffect } from 'react'
import { 
  Wallet, 
  ArrowDownToLine, 
  Clock,
  BadgeCheck,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { toast } from 'react-toastify'
import { db } from "../../functions/firebase"
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore"
import Loading from '../../loading'

interface WithdrawalData {
  availableBalance: number;
  pendingEarnings: number;
  totalWithdrawn: number;
  transactions: Transaction[];
  referralEarnings: number;
  salesEarnings: number;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const formatAmount = (amount: number | undefined | null): string => {
  const num = Number(amount) || 0
  return num.toFixed(2)
}

const WithdrawalPage = () => {
  const [amount, setAmount] = useState('')
  const [payoneerEmail, setPayoneerEmail] = useState('')
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>({
    availableBalance: 0,
    pendingEarnings: 0,
    totalWithdrawn: 0,
    transactions: [],
    referralEarnings: 0,
    salesEarnings: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showEarningsBreakdown, setShowEarningsBreakdown] = useState(false)

  useEffect(() => {
    loadWithdrawalData()
  }, [])

  const loadWithdrawalData = async () => {
    try {
      const userStr = sessionStorage.getItem("user")
      if (!userStr) {
        toast.error("Please login first")
        return
      }

      const user = JSON.parse(userStr)
      
      // Get seller data
      const sellerRef = doc(db, "sellers", user.uid)
      const sellerDoc = await getDoc(sellerRef)
      const sellerData = sellerDoc.exists() ? sellerDoc.data() : null
      
      // Get user data for referral info
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.exists() ? userDoc.data() : null

      // Calculate earnings breakdown
      const sellerPendingEarnings = Number(sellerData?.pendingEarnings) || 0
      const referralPendingEarnings = Number(userData?.referral?.pendingEarnings) || 0
      const totalPendingEarnings = sellerPendingEarnings + referralPendingEarnings

      // Calculate available balance
      const sellerEarnings = Number(sellerData?.earnings) || 0
      const referralEarnings = Number(userData?.referral?.totalEarnings) || 0
      const availableBalance = sellerEarnings + referralEarnings

      // Get transaction history
      const transactionsRef = collection(db, "transactions")
      const q = query(transactionsRef, where("userId", "==", user.uid))
      const transactionDocs = await getDocs(q)
      const transactions = transactionDocs.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          date: data.date,
          amount: Number(data.amount) || 0,
          method: data.method,
          status: data.status
        } as Transaction
      })

      // Calculate total withdrawn
      const totalWithdrawn = transactions
        .filter(t => t.status === 'Completed')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

      setWithdrawalData({
        availableBalance: Number(availableBalance),
        pendingEarnings: Number(totalPendingEarnings),
        totalWithdrawn: Number(totalWithdrawn),
        transactions,
        referralEarnings: Number(referralPendingEarnings),
        salesEarnings: Number(sellerPendingEarnings)
      })
    } catch (error) {
      console.error("Error loading withdrawal data:", error)
      toast.error("Failed to load withdrawal data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!amount || isNaN(Number(amount))) {
        toast.error("Please enter a valid amount")
        return
      }

      if (!payoneerEmail) {
        toast.error("Please enter your Payoneer email")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(payoneerEmail)) {
        toast.error("Please enter a valid Payoneer email address")
        return
      }

      const withdrawalAmount = Number(amount)
      const feeAmount = 3
      const totalDeduction = withdrawalAmount + feeAmount
      
      if (withdrawalAmount < 10) {
        toast.error("Minimum withdrawal amount is $10")
        return
      }

      if (totalDeduction > withdrawalData.pendingEarnings) {
        toast.error("Insufficient pending earnings (including $3 fee)")
        return
      }

      const userStr = sessionStorage.getItem("user")
      if (!userStr) {
        toast.error("Please login first")
        return
      }

      const user = JSON.parse(userStr)

      // Create withdrawal request
      const withdrawalRequest = {
        userId: user.uid,
        amount: withdrawalAmount,
        fee: feeAmount,
        totalAmount: totalDeduction,
        payoneerEmail,
        status: 'Pending',
        date: new Date().toISOString(),
        method: 'Payoneer',
        referralAmount: Math.min(withdrawalData.referralEarnings, withdrawalAmount),
        salesAmount: Math.min(withdrawalData.salesEarnings, withdrawalAmount)
      }

      // Add to transactions collection
      await addDoc(collection(db, "transactions"), withdrawalRequest)

      // Update pending earnings
      const userRef = doc(db, "users", user.uid)
      const sellerRef = doc(db, "sellers", user.uid)

      // Deduct from referral earnings first
      if (withdrawalRequest.referralAmount > 0) {
        await updateDoc(userRef, {
          "referral.pendingEarnings": withdrawalData.referralEarnings - withdrawalRequest.referralAmount
        })
      }

      // Deduct remaining from sales earnings if any
      if (withdrawalRequest.salesAmount > 0) {
        await updateDoc(sellerRef, {
          pendingEarnings: withdrawalData.salesEarnings - withdrawalRequest.salesAmount
        })
      }

      toast.success("Withdrawal request submitted successfully")
      setAmount('')
      setPayoneerEmail('')
      loadWithdrawalData() // Refresh data
    } catch (error) {
      console.error("Error processing withdrawal:", error)
      toast.error("Failed to process withdrawal")
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl text-white p-6 mb-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Withdrawal Dashboard</h1>
        <p>Withdraw your earnings to your Payoneer account</p>
      </div>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Earnings</p>
              <h2 className="text-2xl font-bold">${formatAmount(withdrawalData.availableBalance)}</h2>
            </div>
          </div>
        </div>
        
        <div 
          className="bg-white rounded-xl shadow p-6 cursor-pointer relative"
          onClick={() => setShowEarningsBreakdown(!showEarningsBreakdown)}
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600">Pending Earnings</p>
              <h2 className="text-2xl font-bold">${formatAmount(withdrawalData.pendingEarnings)}</h2>
            </div>
            <Info className="h-5 w-5 text-gray-400 ml-2" />
          </div>
          
          {/* Earnings Breakdown Popup */}
          {showEarningsBreakdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg p-4 z-10">
              <h3 className="font-semibold mb-2">Earnings Breakdown:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Referral Earnings:</span>
                  <span className="font-medium">${formatAmount(withdrawalData.referralEarnings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales Earnings:</span>
                  <span className="font-medium">${formatAmount(withdrawalData.salesEarnings)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <ArrowDownToLine className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Withdrawn</p>
              <h2 className="text-2xl font-bold">${formatAmount(withdrawalData.totalWithdrawn)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Form and Transaction History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Withdraw to Payoneer</h2>
          
          {/* Withdrawal Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-6">
            <h5 className="text-blue-800 mb-2">Withdrawal Information</h5>
            <ul className="text-sm text-blue-700 space-y-1 ps-1">
              <li>• Minimum withdrawal amount: $10</li>
              <li>• Flat withdrawal fee: $3</li>
              <li>• Withdrawals are processed to Payoneer only</li>
              <li>• Processing time: 1-3 hours</li>
            </ul>
          </div>

          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payoneer Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={payoneerEmail}
                onChange={(e) => setPayoneerEmail(e.target.value)}
                placeholder="Enter your Payoneer email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (min. $10)"
                  required
                />
              </div>
              {amount && !isNaN(Number(amount)) && (
                <p className="text-sm text-gray-500 mt-2">
                  You will receive: ${formatAmount(Number(amount) - 3)} (after $3 fee)
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Request Withdrawal
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow md:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawalData.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  withdrawalData.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${formatAmount(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {transaction.status === 'Completed' && <BadgeCheck className="w-4 h-4 mr-1" />}
                          {transaction.status === 'Pending' && <Clock className="w-4 h-4 mr-1" />}
                          {transaction.status === 'Failed' && <XCircle className="w-4 h-4 mr-1" />}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalPage
