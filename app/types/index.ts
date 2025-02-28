export enum Ratings { One = 1, Two, Three, Four, Five }
export enum AlgoType { EAs = "EAs", Indicators = "Indicators", Libraries = "Libraries", Utilities = "Utilities" }
export enum Cost { Free = "Free", Premium = "Premium" }
export enum Status { Complete = "Complete", NotComplete = "NotComplete" }
export enum Identity { Internal = "Internal", External = "External" }
export enum Role { Normal = "Normal", Premium = "Premium", Admin = "Admin" }

export interface AddAlgoFormProps {
    id: string;
    name: string;
    location: string;
    onSuccess: () => void;
}

export interface AlgoFormData {
    name: string;
    type: AlgoType;
    platform: string;
    shortDescription: string;
    cost: Cost;
    buy_price?: number;
    version: string;
}

export type Seller = {
    id: string;
    name: string;
    location: string;
    ratingsCount: number;
    rating: Array<number>;
    overallRating: number;
    aboutMe: string;
    algos: Array<string>;
    comments: Array<string>;
    reviews: Array<string>;
    createdAt: string;
};

export type PlanKey = "lite" | "basic" | "standard" | "ultra" | "dedicated";

export type VPSStatus = 
  | "Running" 
  | "Stopped" 
  | "Suspended" 
  | "PendingPayment" 
  | "PendingUpgrade" 
  | "Failed";

export const VPS_STATUS_TRANSITIONS: Record<VPSStatus, VPSStatus[]> = {
  PendingPayment: ["Running", "Failed"],
  Running: ["Stopped", "Suspended", "PendingUpgrade"],
  Stopped: ["Running", "Suspended"],
  Suspended: ["Running"],
  PendingUpgrade: ["Running", "Failed"],
  Failed: ["PendingPayment"]
};

export const isValidStatusTransition = (currentStatus: VPSStatus, newStatus: VPSStatus): boolean => {
  return VPS_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
};

export interface StorageOption {
  label: string;
  price: number;
  isDefault?: boolean;
}

export interface Region {
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface Length {
  duration: string;
  discount?: number;
  isDefault?: boolean;
}

export interface Addon {
  label: string;
  prices: { [key: string]: number };
  isDefault?: boolean;
}

export interface PlanConfig {
  vCPU: string;
  ram: string;
  os: string[];
  storage: {
    type: string;
    size: string;
    options: StorageOption[];
  };
  snapshots: number;
  traffic: string;
  regions: Region[];
  monthlyPrice: number;
  annualPrice: number;
  lengths: Length[];
  addons: {
    backupStorage: Addon[];
    monitoring: Addon[];
  };
}

export interface PayProps {
  plan: PlanKey;
}

export interface VPSPlan {
  id: string;
  selectedPlan: string;
  length: string;
  quantity: number;
  region: string;
  storageOption: string;
  os: string;
  backupStorage: string;
  monitoring: string;
  price: number;
  paymentType: "monthly" | "annual";
  status: VPSStatus;
  purchaseDate: string;
  expiryDate: string;
  createdAt: string;
  serverCredentials: {
    username: string;
    password: string;
  };
  cpu?: number;
  ram?: number;
  storage?: number;
  bandwidth?: number;
  lastUpdated?: string;
}

export interface VPSOrder extends Omit<VPSPlan, 'status'> {
  userId: string;
  userName: string;
  status: VPSStatus;
  paymentStatus: "pending" | "completed" | "failed";
  type?: "new" | "upgrade";
  originalPlanId?: string;
}

export interface ReferralEarning {
  id: string;
  orderId: string;
  amount: number;
  status: "pending" | "completed";
  createdAt: string;
  paidAt?: string;
}

export interface UserReferral {
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  earnings: ReferralEarning[];
  type: "referral";
  isVerified?: boolean;
}

// Zod Schemas
import { z } from 'zod';

export const vpsCredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*]/)
});

export const vpsPlanSchema = z.object({
  id: z.string().uuid(),
  selectedPlan: z.string(),
  length: z.string(),
  quantity: z.number().int().min(1).max(10),
  region: z.string(),
  storageOption: z.string(),
  os: z.string(),
  backupStorage: z.string(),
  monitoring: z.string(),
  price: z.number().positive(),
  paymentType: z.enum(["monthly", "annual"]),
  status: z.enum([
    "Running",
    "Stopped",
    "Suspended",
    "PendingPayment",
    "PendingUpgrade",
    "Failed"
  ]),
  purchaseDate: z.string(),
  expiryDate: z.string(),
  createdAt: z.string(),
  serverCredentials: vpsCredentialsSchema,
  cpu: z.number().optional(),
  ram: z.number().optional(),
  storage: z.number().optional(),
  bandwidth: z.number().optional(),
  lastUpdated: z.string().optional()
});

export const vpsOrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  userName: z.string(),
  selectedPlan: z.string(),
  length: z.string(),
  quantity: z.number().int().min(1).max(10),
  region: z.string(),
  storageOption: z.string(),
  os: z.string(),
  backupStorage: z.string(),
  monitoring: z.string(),
  price: z.number().positive(),
  paymentType: z.enum(["monthly", "annual"]),
  status: z.enum([
    "Running",
    "Stopped",
    "Suspended",
    "PendingPayment",
    "PendingUpgrade",
    "Failed"
  ]),
  purchaseDate: z.string(),
  expiryDate: z.string(),
  createdAt: z.string(),
  paymentStatus: z.enum(["pending", "completed", "failed"]),
  lastUpdated: z.string(),
  serverCredentials: vpsCredentialsSchema,
  type: z.enum(["new", "upgrade"]).optional(),
  originalPlanId: z.string().optional()
});

export type Algo = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  app?: string;
  shortDescription?: string;
  type: AlgoType;
  paid?: boolean;
  platform: string;
  name: string;
  description: string;
  descriptionHTML: string;
  image: string;
  image_path: string;
  identity: Identity;
  cost: Cost;
  buy_price: number;
  demo_price: number;
  downloads: number;
  downloadLink: string;
  remoteDownloadLink: string;
  version: string;
  uploaded: string;
  updated: string;
  md_description?: string;
  md_path?: string;
  ratings: Array<string>; // Array of rating IDs
  rating: number; // Average rating
  ratingCount: number;
  commentCount: number;
  comments: Array<string>; // Array of comment IDs
  reviews: Array<string>; // Array of review IDs
  screenshots: Array<{
    url: string;
    path: string;
  }>;
  status: Status;  // default NotComplete
  app_path: string;
};

export type User = {
  id: string;
  username?: string;
  password: string;
  role: Role;
  premiumExpiration?: string;
  email: string;
  photoURL?: string;
  photoURL_path?: string;
  location: {
    city: string;
    country: string;
    lastUpdated: string;
  };
  verification: boolean;
  downloads?: Array<string>;
  wishlist: Array<string>;
  comments: Array<string>;
  reviews: Array<string>;
  name: string;
  vpsPlans: VPSPlan[];
  notifications: Notification[];
  appsCount: number;
  subscriptionsCount: number;
  signalsCount: number;
  activities2: Activity[];
  urgent: UrgentNotification[];
  statistics: {
    tradingVolume: number;
    monthlyProfit: number;
  };
};

export interface StatCard {
  title: string;
  value: number;
  icon: IconDefinition;
  color: string;
}

export interface UrgentNotification {
  title: string;
  message: string;
  severity: "critical" | "warning" | "info" | "success";
  timeLeft: string;
  timestamp: Date;
}

export interface SalesData {
  earnings: number;
  pendingEarnings: number;
  activeListings: number;
  pendingApprovals: number;
}

export interface Activity {
  title: string;
  time: string;
  description: string;
  timestamp: Date;
}

export type Review = {
  id: string;
  userId: string;
  username: string;
  algoId: string;
  review: string;
  lang: string;
  date: string;
  replies?: string[];
  parentId?: string | null;
  rating: Ratings; // Or: rating: number if you don't use the Ratings enum
};

export type Comment = {
  id: string;
  userId: string;
  algoId: string;
  parentId: string | null;
  comment: string;
  lang: string;
  date: string;
  replies: string[];
};

export type PaymentMethod = 'payoneer' | 'crypto' | 'bank_transfer';

export type PaymentStatus = 'processing' | 'completed' | 'failed' | 'pending' | 'cancelled';

export interface PaymentData {
  subscriptions: Subscription[];
  invoices: Invoice[];
  totalDue: number;
  nextPaymentDate: string;
  autoRenewal: boolean;
  paymentMethod?: PaymentMethod;
  paymentDetails?: {
    payoneerId?: string;
    cryptoAddress?: string;
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      swiftCode: string;
    };
  };
}

export interface Subscription {
  id: string;
  serviceName: string;
  planDetails: string;
  price: number;
  nextPaymentDue: string;
  status: 'Active' | 'Pending' | 'Cancelled';
  paymentMethod: PaymentMethod;
  billingCycle: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: PaymentMethod;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
  billingAddress?: {
    name: string;
    address: string;
    country: string;
  };
  pdfUrl?: string;
}

export interface PaymentAnalytics {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  total: number;
  currency: string;
  period: 'monthly' | 'annual';
}

export interface PaymentProps {
  plan: PlanKey;
  paymentMethod?: PaymentMethod;
  billingCycle?: 'monthly' | 'annual';
}

export interface UnverifiedAlgo {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sellerId: string;
  sellerName: string;
  image: string;
  buy_price: number;
  rating: number;
  type: string;
  version: string;
  uploaded: string;
  updated: string;
  downloads: number;
  screenshots: Array<string | { link: string }>;
  cost: string;
  platform: string;
  md_description: string;
}

export interface MembershipDuration {
  months: number;
  price: number;
  savings?: number;
}

export interface MembershipPlan {
  duration: MembershipDuration;
  isPopular?: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  orderId?: string;
  customerEmail?: string;
  payeeEmail?: string;
  type: 'payment' | 'withdrawal';
  metadata?: {
    algoId?: string;
    sellerId?: string;
    algoName?: string;
    vpsOrderId?: string;
    membershipId?: string;
    membershipDuration?: number;
    membershipExpiry?: string;
  };
}

// Add date formatting function
export const formatDate = (date: Date | number | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
};

export type IconDefinition = any; // Replace 'any' with the correct type if known

export interface StorageResult {
  url: string;
  path: string;
  metadata?: {
    contentType: string;
    size: number;
    [key: string]: any;
  };
}

export interface ProfileUpdateOptions extends StorageOptions {
  currentPhotoURL?: string;
  currentPhotoPath?: string;
}