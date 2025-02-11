"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from 'next/link';
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from "../functions/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CheckCircle } from 'lucide-react'
import { PlanKey, PlanConfig, vpsPlanSchema, vpsOrderSchema, ReferralEarning } from '../types/index';

interface PayProps {
  plan: PlanKey;
}

const planConfig: Record<PlanKey, PlanConfig> = {
  lite: {
    vCPU: "4vCPU",
    ram: "4GB",
    os: ["Windows Server 2022"],
    storage: {
      type: "Hybrid",
      size: "100GB NVMe/400GB SSD",
      options: [
        { label: "400GB SSD", price: 0, isDefault: true },
        { label: "600GB SSD", price: 4 },
        { label: "100GB NVMe", price: 0 },
        { label: "150GB NVMe", price: 2.30 }
      ]
    },
    snapshots: 1,
    traffic: "32TB",
    regions: [
      { name: "European Union", price: 0 },
      { name: "United States Central", price: 0, isDefault: true },
      { name: "United Kingdom", price: 2 },
      { name: "United States East", price: 2 },
      { name: "United States West", price: 2 },
      { name: "Asia - Singapore", price: 3 },
      { name: "Asia - Japan", price: 3 },
      { name: "Asia - India", price: 3 },
      { name: "Africa - South Africa", price: 2 },
      { name: "Australia - Sydney", price: 3 }
    ],
    monthlyPrice: 34,
    annualPrice: 34 * 12 * 0.85,
    lengths: [
      { duration: "1 Month", isDefault: true },
      { duration: "3 Months", discount: 1.35 },
      { duration: "6 Months", discount: 2.75 },
      { duration: "1 Year", discount: 5.50 }
    ],
    addons: {
      backupStorage: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "100GB FTP Storage", 
          prices: { 
            "1 Month": 12.34, 
            "3 Months": 11.50, 
            "6 Months": 10.75, 
            "1 Year": 9.99 
          }
        },
        { 
          label: "500GB FTP Storage", 
          prices: { 
            "1 Month": 38, 
            "3 Months": 36, 
            "6 Months": 34, 
            "1 Year": 32 
          }
        },
        { 
          label: "1TB FTP Storage", 
          prices: { 
            "1 Month": 60, 
            "3 Months": 58, 
            "6 Months": 56, 
            "1 Year": 54 
          }
        },
        { 
          label: "2TB FTP Storage", 
          prices: { 
            "1 Month": 120, 
            "3 Months": 118, 
            "6 Months": 116, 
            "1 Year": 114 
          }
        }
      ],
      monitoring: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "Full Monitoring", 
          prices: { 
            "1 Month": 47, 
            "3 Months": 44, 
            "6 Months": 42, 
            "1 Year": 40 
          }
        }
      ]
    }
  },
  basic: {
    vCPU: "6vCPU",
    ram: "16GB",
    os: ["Windows Server 2022"],
    storage: {
      type: "Hybrid",
      size: "200GB NVMe/400GB SSD",
      options: [
        { label: "400GB SSD", price: 0, isDefault: true },
        { label: "600GB SSD", price: 4 },
        { label: "200GB NVMe", price: 0 },
        { label: "300GB NVMe", price: 4 }
      ]
    },
    snapshots: 2,
    traffic: "32TB",
    regions: [
      { name: "European Union", price: 0 },
      { name: "United States Central", price: 0, isDefault: true },
      { name: "United Kingdom", price: 2 },
      { name: "United States East", price: 2 },
      { name: "United States West", price: 2 },
      { name: "Asia - Singapore", price: 3 },
      { name: "Asia - Japan", price: 3 },
      { name: "Asia - India", price: 3 },
      { name: "Africa - South Africa", price: 2 },
      { name: "Australia - Sydney", price: 3 }
    ],
    monthlyPrice: 48,
    annualPrice: 48 * 12 * 0.85,
    lengths: [
      { duration: "1 Month", isDefault: true },
      { duration: "3 Months", discount: 3.15 },
      { duration: "6 Months", discount: 5.25 },
      { duration: "1 Year", discount: 12.50 }
    ],
    addons: {
      backupStorage: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "100GB FTP Storage", 
          prices: { 
            "1 Month": 12.34, 
            "3 Months": 11.50, 
            "6 Months": 10.75, 
            "1 Year": 9.99 
          }
        },
        { 
          label: "500GB FTP Storage", 
          prices: { 
            "1 Month": 38, 
            "3 Months": 36, 
            "6 Months": 34, 
            "1 Year": 32 
          }
        },
        { 
          label: "1TB FTP Storage", 
          prices: { 
            "1 Month": 60, 
            "3 Months": 58, 
            "6 Months": 56, 
            "1 Year": 54 
          }
        },
        { 
          label: "2TB FTP Storage", 
          prices: { 
            "1 Month": 120, 
            "3 Months": 118, 
            "6 Months": 116, 
            "1 Year": 114 
          }
        }
      ],
      monitoring: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "Full Monitoring", 
          prices: { 
            "1 Month": 47, 
            "3 Months": 44, 
            "6 Months": 42, 
            "1 Year": 40 
          }
        }
      ]
    }
  },
  standard: {
    vCPU: "8vCPU",
    ram: "24GB",
    os: ["Windows Server 2022"],
    storage: {
      type: "Hybrid",
      size: "300GB NVMe/1.2TB SSD",
      options: [
        { label: "1.2TB SSD", price: 0, isDefault: true },
        { label: "1.6TB SSD", price: 6 },
        { label: "300GB NVMe", price: 0 },
        { label: "500GB NVMe", price: 6 }
      ]
    },
    snapshots: 2,
    traffic: "32TB",
    regions: [
      { name: "European Union", price: 0 },
      { name: "United States Central", price: 0, isDefault: true },
      { name: "United Kingdom", price: 4 },
      { name: "United States East", price: 7 },
      { name: "United States West", price: 7 },
      { name: "Asia - Singapore", price: 10 },
      { name: "Asia - Japan", price: 10 },
      { name: "Asia - India", price: 10 },
      { name: "Africa - South Africa", price: 10 },
      { name: "Australia - Sydney", price: 10 }
    ],
    monthlyPrice: 80,
    annualPrice: 80 * 12 * 0.85,
    lengths: [
      { duration: "1 Month", isDefault: true },
      { duration: "3 Months", discount: 4 },
      { duration: "6 Months", discount: 8 },
      { duration: "1 Year", discount: 17 }
    ],
    addons: {
      backupStorage: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "100GB FTP Storage", 
          prices: { 
            "1 Month": 12.34, 
            "3 Months": 11.50, 
            "6 Months": 10.75, 
            "1 Year": 9.99 
          }
        },
        { 
          label: "500GB FTP Storage", 
          prices: { 
            "1 Month": 38, 
            "3 Months": 36, 
            "6 Months": 34, 
            "1 Year": 32 
          }
        },
        { 
          label: "1TB FTP Storage", 
          prices: { 
            "1 Month": 60, 
            "3 Months": 58, 
            "6 Months": 56, 
            "1 Year": 54 
          }
        },
        { 
          label: "2TB FTP Storage", 
          prices: { 
            "1 Month": 120, 
            "3 Months": 118, 
            "6 Months": 116, 
            "1 Year": 114 
          }
        }
      ],
      monitoring: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "Full Monitoring", 
          prices: { 
            "1 Month": 47, 
            "3 Months": 44, 
            "6 Months": 42, 
            "1 Year": 40 
          }
        }
      ]
    }
  },
  ultra: {
    vCPU: "12vCPU",
    ram: "48GB",
    os: ["Windows Server 2022"],
    storage: {
      type: "Hybrid",
      size: "400GB NVMe/1.8TB SSD",
      options: [
        { label: "1.6TB SSD", price: 0, isDefault: true },
        { label: "2TB SSD", price: 6 },
        { label: "400GB NVMe", price: 0 },
        { label: "800GB NVMe", price: 12 }
      ]
    },
    snapshots: 3,
    traffic: "32TB",
    regions: [
      { name: "European Union", price: 0 },
      { name: "United States Central", price: 0, isDefault: true },
      { name: "United Kingdom", price: 10 },
      { name: "United States East", price: 10 },
      { name: "United States West", price: 10 },
      { name: "Asia - Singapore", price: 20 },
      { name: "Asia - Japan", price: 20 },
      { name: "Asia - India", price: 18 },
      { name: "Africa - South Africa", price: 18 },
      { name: "Australia - Sydney", price: 16 }
    ],
    monthlyPrice: 130,
    annualPrice: 130 * 12 * 0.85,
    lengths: [
      { duration: "1 Month", isDefault: true },
      { duration: "3 Months", discount: 8 },
      { duration: "6 Months", discount: 16 },
      { duration: "1 Year", discount: 30 }
    ],
    addons: {
      backupStorage: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "100GB FTP Storage", 
          prices: { 
            "1 Month": 12.34, 
            "3 Months": 11.50, 
            "6 Months": 10.75, 
            "1 Year": 9.99 
          }
        },
        { 
          label: "500GB FTP Storage", 
          prices: { 
            "1 Month": 38, 
            "3 Months": 36, 
            "6 Months": 34, 
            "1 Year": 32 
          }
        },
        { 
          label: "1TB FTP Storage", 
          prices: { 
            "1 Month": 60, 
            "3 Months": 58, 
            "6 Months": 56, 
            "1 Year": 54 
          }
        },
        { 
          label: "2TB FTP Storage", 
          prices: { 
            "1 Month": 120, 
            "3 Months": 118, 
            "6 Months": 116, 
            "1 Year": 114 
          }
        }
      ],
      monitoring: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "Full Monitoring", 
          prices: { 
            "1 Month": 47, 
            "3 Months": 44, 
            "6 Months": 42, 
            "1 Year": 40 
          }
        }
      ]
    }
  },
  dedicated: {
    vCPU: "3 Physical Cores AMD EPYC 7282 2.8 GHz",
    ram: "24GB",
    os: ["Windows Server 2022"],
    storage: {
      type: "Hybrid",
      size: "180GB NVMe",
      options: [
        { label: "180GB NVMe SSD", price: 0, isDefault: true },
        { label: "1TB SSD", price: 32 },
        { label: "2TB SSD", price: 47 },
        { label: "4TB SSD", price: 133 }
      ]
    },
    snapshots: 3,
    traffic: "32TB",
    regions: [
      { name: "European Union", price: 0 },
      { name: "United States Central", price: 0, isDefault: true },
      { name: "United Kingdom", price: 10 },
      { name: "United States East", price: 10 },
      { name: "United States West", price: 10 },
      { name: "Asia - Singapore", price: 20 },
      { name: "Asia - Japan", price: 20 },
      { name: "Asia - India", price: 18 },
      { name: "Africa - South Africa", price: 18 },
      { name: "Australia - Sydney", price: 16 }
    ],
    monthlyPrice: 250,
    annualPrice: 250 * 12 * 0.85,
    lengths: [
      { duration: "1 Month", isDefault: true },
      { duration: "3 Months", discount: 14 },
      { duration: "6 Months", discount: 28 },
      { duration: "1 Year", discount: 58 }
    ],
    addons: {
      backupStorage: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "100GB FTP Storage", 
          prices: { 
            "1 Month": 12.34, 
            "3 Months": 11.50, 
            "6 Months": 10.75, 
            "1 Year": 9.99 
          }
        },
        { 
          label: "500GB FTP Storage", 
          prices: { 
            "1 Month": 38, 
            "3 Months": 36, 
            "6 Months": 34, 
            "1 Year": 32 
          }
        },
        { 
          label: "1TB FTP Storage", 
          prices: { 
            "1 Month": 60, 
            "3 Months": 58, 
            "6 Months": 56, 
            "1 Year": 54 
          }
        },
        { 
          label: "2TB FTP Storage", 
          prices: { 
            "1 Month": 120, 
            "3 Months": 118, 
            "6 Months": 116, 
            "1 Year": 114 
          }
        }
      ],
      monitoring: [
        { 
          label: "None", 
          prices: { "1 Month": 0, "3 Months": 0, "6 Months": 0, "1 Year": 0 },
          isDefault: true 
        },
        { 
          label: "Full Monitoring", 
          prices: { 
            "1 Month": 47, 
            "3 Months": 44, 
            "6 Months": 42, 
            "1 Year": 40 
          }
        }
      ]
    }
  }
};

export default function Pay({ plan }: PayProps): React.ReactElement {
  const [selectedPlan, setSelectedPlan] = useState(plan);
  const [length, setLength] = useState("1 Month");
  const [quantity, setQuantity] = useState(1);
  const [region, setRegion] = useState(() => {
    const defaultRegion = planConfig[plan].regions.find(r => r.isDefault);
    return defaultRegion ? defaultRegion.name : "";
  });
  const [storageOption, setStorageOption] = useState(() => {
    const defaultStorage = planConfig[plan].storage.options.find(opt => opt.isDefault);
    return defaultStorage ? defaultStorage.label : "";
  });
  const [os, setOs] = useState("Windows Server 2022");
  const [backupStorage, setBackupStorage] = useState("None");
  const [monitoring, setMonitoring] = useState("None");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [referrerType, setReferrerType] = useState<"referral" | null>(null);

  useEffect(() => {
    const config = planConfig[selectedPlan];
    setOs(config.os[0]);
    setBackupStorage(config.addons.backupStorage[0].label);
    setMonitoring(config.addons.monitoring[0].label);
    
    const defaultStorage = config.storage.options.find(opt => opt.isDefault);
    setStorageOption(defaultStorage ? defaultStorage.label : "");
    
    const defaultRegion = config.regions.find(r => r.isDefault);
    setRegion(defaultRegion ? defaultRegion.name : "");
  }, [selectedPlan]);

  const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
  };

  const calculatePrice = () => {
    const config = planConfig[selectedPlan];
    let basePrice = config.monthlyPrice;

    // Add region cost
    const selectedRegionPrice = config.regions.find(r => r.name === region)?.price || 0;
    basePrice += selectedRegionPrice;

    // Add storage cost
    const selectedStoragePrice = config.storage.options.find(s => s.label === storageOption)?.price || 0;
    basePrice += selectedStoragePrice;

    // Calculate months in period
    const monthsInPeriod = length === "1 Year" ? 12 : 
                          length === "6 Months" ? 6 : 
                          length === "3 Months" ? 3 : 1;

    // Calculate base price for the period
    let totalPrice = basePrice * monthsInPeriod;

    // Apply length discount if applicable
    const selectedLength = config.lengths.find(l => l.duration === length);
    if (selectedLength?.discount) {
      totalPrice -= selectedLength.discount * monthsInPeriod;
    }

    // Add addon costs - multiply by months but don't apply discounts
    const selectedBackupStorage = config.addons.backupStorage.find(b => b.label === backupStorage);
    if (selectedBackupStorage?.prices[length]) {
      totalPrice += selectedBackupStorage.prices[length] * monthsInPeriod;
    }

    const selectedMonitoring = config.addons.monitoring.find(m => m.label === monitoring);
    if (selectedMonitoring?.prices[length]) {
      totalPrice += selectedMonitoring.prices[length] * monthsInPeriod;
    }

    // Multiply by quantity
    return totalPrice * quantity;
  };

  const validateOrder = () => {
    if (!password) {
      toast.error("Please set a password for your server");
      return false;
    }
    
    if (!region) {
      toast.error("Please select a server region");
      return false;
    }

    if (!storageOption) {
      toast.error("Please select a storage configuration");
      return false;
    }

    // Password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar || !isLongEnough) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Password',
        text: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.',
        confirmButtonColor: '#7A49B7'
      });
      return false;
    }

    return true;
  };

  const handleReferralCommission = async (orderId: string, orderAmount: number) => {
    try {
      if (!referralCode) return;

      // Find user with this referral code
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referralCode", "==", referralCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No referral found");
        return;
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data();
      
      // Calculate commission (10% for referrals)
      const commissionAmount = orderAmount * 0.10;

      // Create new earning entry
      const newEarning: ReferralEarning = {
        id: crypto.randomUUID(),
        orderId,
        amount: commissionAmount,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      // Update referrer's earnings
      await updateDoc(doc(db, "users", referrerDoc.id), {
        "referral.earnings": [...(referrerData.referral?.earnings || []), newEarning],
        "referral.pendingEarnings": (referrerData.referral?.pendingEarnings || 0) + commissionAmount
      });

    } catch (error) {
      console.error("Error handling referral commission:", error);
    }
  };

  const handlePayment = async (type: "monthly" | "annual") => {
    if (!validateOrder()) return;

    try {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) {
        toast.error("Please login first");
        return;
      }

      const sessionUser = JSON.parse(sessionUserString);
      const userRef = doc(db, "users", sessionUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }

      // Generate unique ID for the plan
      const planId = crypto.randomUUID();

      // Calculate final price with referral discount if applicable
      const basePrice = calculatePrice();
      const finalPrice = referrerType ? basePrice * 0.9 : basePrice;

      // Prepare VPS plan data
      const vpsPlanData = {
        id: planId,
        selectedPlan,
        length,
        quantity,
        region,
        storageOption,
        os,
        backupStorage,
        monitoring,
        price: finalPrice, // Use the same price calculation as shown in Order Summary
        paymentType: type,
        status: "PendingPayment" as const,
        purchaseDate: "",
        expiryDate: "",
        createdAt: new Date().toISOString(),
        serverCredentials: {
          username: "Administrator",
          password: password
        }
      };

      // Validate VPS plan data
      const validatedPlanData = vpsPlanSchema.parse(vpsPlanData);

      // Prepare order data without id (it will come from validatedPlanData)
      const orderData = {
        userId: sessionUser.uid,
        userName: userDoc.data()?.name || "User",
        paymentStatus: "pending" as const,
        lastUpdated: new Date().toISOString(),
        type: "new" as const
      };

      // Combine and validate order data
      const validatedOrderData = vpsOrderSchema.parse({
        ...validatedPlanData,
        ...orderData
      });

      // Get existing vpsPlans array or initialize empty array
      const currentVpsPlans = userDoc.data()?.vpsPlans || [];
      const currentActivities = userDoc.data()?.activities2 || [];

      // Add to orders collection first to get the order ID
      const orderRef = await addDoc(collection(db, "orders"), validatedOrderData);

      // Update user document
      await updateDoc(userRef, {
        vpsPlans: [...currentVpsPlans, validatedPlanData],
        activities2: [
          {
            title: "New VPS Order",
            description: `Placed order for ${quantity} ${selectedPlan} VPS`,
            timestamp: new Date().toISOString()
          },
          ...currentActivities
        ].slice(0, 5)
      });

      // Show confirmation dialog
      const result = await Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        text: 'Proceeding to payment...',
        showCancelButton: true,
        confirmButtonText: 'Proceed to Payment',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#7A49B7',
        cancelButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        // Create payment using unified API
        const paymentResponse = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: finalPrice,
            type: 'payment',
            description: `Payment for ${quantity} ${selectedPlan} VPS (${length})`,
            customerEmail: sessionUser.email,
            orderId: orderRef.id,
            metadata: {
              vpsOrderId: orderRef.id
            }
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment');
        }

        const { paymentUrl } = await paymentResponse.json();
        window.location.href = paymentUrl;
      } else {
        toast.warning('Payment cancelled. Your order is saved but pending payment.');
      }

    } catch (error: unknown) {
      console.error("Error placing order:", error);
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        toast.error('Invalid data format. Please check your inputs.');
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Failed to place order. Please try again.',
          confirmButtonColor: '#7A49B7'
        });
      }
    }
  };

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";

    // Ensure at least one of each required character type
    let generatedPassword = 
      uppercase[Math.floor(Math.random() * uppercase.length)] +
      lowercase[Math.floor(Math.random() * lowercase.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      special[Math.floor(Math.random() * special.length)];

    // Fill the rest with random characters
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = 0; i < 8; i++) {
      generatedPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    generatedPassword = generatedPassword
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    setPassword(generatedPassword);
  };

  const validateReferralCode = async (code: string) => {
    if (!code.trim()) return;
    
    setIsValidatingCode(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referral.code", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const referrerData = querySnapshot.docs[0].data();
        setReferrerType(referrerData.referral.type);
        toast.success(`Valid ${referrerData.referral.type} code applied!`);
      } else {
        setReferrerType(null);
        toast.error("Invalid referral code");
      }
    } catch (error) {
      console.error("Error validating referral code:", error);
      toast.error("Error validating code");
    } finally {
      setIsValidatingCode(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Configuration Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-6 sm:space-y-8">
            <form className="space-y-6 sm:space-y-8">
              {/* Plan Selection */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-purple fw-bold">
                  Select Your Plan
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  {Object.keys(planConfig).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key as PlanKey)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPlan === key 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium text-base sm:text-lg capitalize">{key}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        ${planConfig[key as PlanKey].monthlyPrice}/month
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm font-medium text-purple">
                  VPS Quantity
                </label>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button 
                    type="button"
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-300"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <span className="text-lg sm:text-xl">-</span>
                  </button>
                  <input
                    type="number"
                    className="w-16 sm:w-20 text-center rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= 10) {
                        setQuantity(val);
                      }
                    }}
                    min="1"
                    max="10"
                  />
                  <button 
                    type="button"
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-300"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                  >
                    <span className="text-lg sm:text-xl">+</span>
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500">(Max: 10)</span>
                </div>
              </div>

              {/* Length Selection */}
              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm font-medium text-purple">
                  Subscription Length
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {planConfig[selectedPlan].lengths.map((option) => (
                    <button
                      key={option.duration}
                      type="button"
                      onClick={() => setLength(option.duration)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                        length === option.duration 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium text-sm sm:text-base">{option.duration}</div>
                      {option.discount && (
                        <div className="text-xs sm:text-sm text-green-600">
                          Save ${option.discount}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Server Configuration */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple">
                  Server Configuration
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Server Location
                    </label>
                    <select 
                      className="w-full rounded-lg border-gray-300 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      value={region} 
                      onChange={handleInputChange(setRegion)}
                    >
                      {planConfig[selectedPlan].regions.map((reg) => (
                        <option key={reg.name} value={reg.name}>
                          {reg.name} {reg.price > 0 ? `(+$${reg.price})` : '(Included)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Storage Configuration
                    </label>
                    <select 
                      className="w-full rounded-lg border-gray-300 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      value={storageOption} 
                      onChange={handleInputChange(setStorageOption)}
                    >
                      {planConfig[selectedPlan].storage.options.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label} {option.price > 0 ? `(+$${option.price})` : '(Included)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Server Credentials */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple">
                  Server Credentials
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username:
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-gray-50 border-2 border-gray-300 cursor-not-allowed px-3"
                      value="Administrator"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password: *
                    </label>
                    <div className="space-y-3">
                      {/* Password Requirements */}
                      <div className="text-sm bg-white shadow-md border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                          </svg>
                          <h4 className="font-semibold text-gray-900">Password Requirements</h4>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/[A-Z]/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {/[A-Z]/.test(password) ? '✓' : '•'}
                            </span>
                            <span className={`${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>One uppercase letter</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/[a-z]/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {/[a-z]/.test(password) ? '✓' : '•'}
                            </span>
                            <span className={`${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>One lowercase letter</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/\d/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {/\d/.test(password) ? '✓' : '•'}
                            </span>
                            <span className={`${/\d/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>One number</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/[!@#$%^&*]/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {/[!@#$%^&*]/.test(password) ? '✓' : '•'}
                            </span>
                            <span className={`${/[!@#$%^&*]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>One special character (!@#$%^&*)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${password.length >= 8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {password.length >= 8 ? '✓' : '•'}
                            </span>
                            <span className={`${password.length >= 8 ? 'text-green-600' : 'text-gray-600'}`}>Minimum 8 characters</span>
                          </li>
                        </ul>
                      </div>

                      {/* Password Input and Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full rounded-lg border-gray-300 border-2 px-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter or generate password"
                          required
                        />
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                          <button 
                            type="button"
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                            onClick={generatePassword}
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Add-ons */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple">
                  Optional Add-ons
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Backup Storage
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Optional
                      </span>
                    </label>
                    <select 
                      className="w-full rounded-lg border-gray-300 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      value={backupStorage} 
                      onChange={handleInputChange(setBackupStorage)}
                    >
                      {planConfig[selectedPlan].addons.backupStorage.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label} {option.prices[length] > 0 
                            ? `(+$${option.prices[length]}/month for ${length})` 
                            : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Server Management
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Optional
                      </span>
                    </label>
                    <select 
                      className="w-full rounded-lg border-gray-300 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      value={monitoring} 
                      onChange={handleInputChange(setMonitoring)}
                    >
                      {planConfig[selectedPlan].addons.monitoring.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label} {option.prices[length] > 0 
                            ? `(+$${option.prices[length]}/month for ${length})` 
                            : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Referral Code Input Section */}
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Referral Code
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        (Optional)
                      </span>
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Enter a referral code to get a discount on your order
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="Enter referral code"
                        maxLength={12}
                      />
                      {referrerType && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Referral
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => validateReferralCode(referralCode)}
                      disabled={isValidatingCode || !referralCode.trim()}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px]"
                    >
                      {isValidatingCode ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle 
                              className="opacity-25" 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="4" 
                              fill="none" 
                            />
                            <path 
                              className="opacity-75" 
                              fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                            />
                          </svg>
                        </span>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>

                  {referrerType && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            Code Applied Successfully!
                          </h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              You will receive a 10% discount on your order using this referral code.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Section - Fixed at bottom*/}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-14">
            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-600 p-6 text-center">
                <h3 className="text-xl font-semibold text-white">
                  Order Summary
                </h3>
                <p className="text-purple-100 text-sm mt-1">No hidden charges</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">{quantity} VPS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Region</span>
                    <span className="font-medium">{region}</span>
                  </div>
                </div>

                {/* Total section with discount if applicable */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <div className="text-right">
                      {referrerType && (
                        <div className="text-sm text-green-600 line-through mb-1">
                          ${calculatePrice().toFixed(2)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-purple-600">
                        ${(calculatePrice() * (referrerType ? 0.90 : 1)).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        per {length.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  onClick={() => handlePayment(length === "1 Month" ? "monthly" : "annual")}
                >
                  Complete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}