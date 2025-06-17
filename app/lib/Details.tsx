import { db } from "../functions/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Algo, User } from "../types";

// Define types
export interface Comment {
  userId: string;
  content: string;
  timestamp: Date;
}

export interface Review {
  userId: string;
  rating: number;
  content: string;
  timestamp: Date;
}

export interface Seller {
  seller_name: string;
  location: string;
  // Add other seller fields as needed
}


export interface EnrichedAlgo extends Omit<Algo, 'cost'> {
  cost: string;
  price: number;
  sellerName: string;
  sellerLocation: string;
  id: string;
  name: string;
  description: string;
  sellerId: string;
}

// Fetch a generic entity
async function fetchEntity<T>(
  id: string,
  type: "algos" | "users" | "seller" | "comments" | "reviews"
): Promise<T | null> {
  if (!id || id.trim() === "") {
    console.warn(`Invalid ID provided for type ${type}. Returning null.`);
    return null;
  }

  try {
    const docRef = doc(db, type, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`No ${type} found with ID ${id}. Returning null.`);
      return null;
    }

    return docSnap.data() as T;
  } catch (error) {
    console.error(`Error fetching ${type} with ID ${id}:`, error);
    throw error;
  }
}

// Fetch an enriched Algo
export async function fetchEnrichedAlgo(algoId: string): Promise<EnrichedAlgo> {
  try {
    // Step 1: Fetch the base Algo
    const algo = await fetchEntity<Algo>(algoId, "algos");
    if (!algo) throw new Error(`Algo with ID ${algoId} not found.`);

    // Step 2: Fetch seller data
    let seller: Seller | null = null;
    try {
      seller = await fetchEntity<Seller>(algo.sellerId, "seller");
    } catch (error) {
      console.warn(`Seller fetch failed for Algo ID ${algoId}:`, error);
    }

    // Step 3: Fetch comments and their authors
    const commentsWithNull = await Promise.all(
      algo.comments.map((commentId) => fetchEntity<Comment>(commentId, "comments"))
    );
    const comments = commentsWithNull.filter((comment): comment is Comment => comment !== null);
    
    const commentersWithNull = await Promise.all(
      comments.map((comment) => fetchEntity<User>(comment.userId, "users"))
    );
    const commenters = commentersWithNull.filter((user): user is User => user !== null);

    const enrichedComments = comments.map((comment, index) => ({
      ...comment,
      user: commenters[index],
    }));

    // Step 4: Fetch reviews and their authors
    const reviewsWithNull = await Promise.all(
      algo.reviews.map((reviewId) => fetchEntity<Review>(reviewId, "reviews"))
    );
    const reviews = reviewsWithNull.filter((review): review is Review => review !== null);

    const reviewersWithNull = await Promise.all(
      reviews.map((review) => fetchEntity<User>(review.userId, "users"))
    );
    const reviewers = reviewersWithNull.filter((user): user is User => user !== null);

    const enrichedReviews = reviews.map((review, index) => ({
      ...review,
      user: reviewers[index],
    }));

    // Step 5: Enrich and return the Algo object
    return {
      ...algo,
      sellerName: seller?.seller_name || "N/A",
      sellerLocation: seller?.location || "N/A",
      rating: algo.rating,
      ratingCount: algo.ratingCount,
      price: algo.cost === "Premium" ? 99 : 0,
      // comments: enrichedComments,
      // reviews: enrichedReviews,
    };
  } catch (error) {
    console.error(`Error fetching enriched algo:`, error);
    throw error;
  }
}