import { db } from "../functions/firebase";
import { getDocs, collection } from "firebase/firestore";
import { Algo } from "../types/index";

export default async function MarketFrontData(): Promise<Algo[]> {
  try {
    // Reference to the "algos" collection
    const algosCollection = collection(db, "algos");

    // Fetch the documents from the "algos" collection
    const snapshot = await getDocs(algosCollection);

    // Map over the documents to extract the data
    // Map documents to Algo type
    const data: Algo[] = snapshot.docs.map((doc) => {
        const rawData = doc.data();
        return {
          id: doc.id, // Firestore document ID
          sellerId: rawData.sellerId || "",
          sellerName: rawData.sellerName || "",
          sellerLocation: rawData.sellerLocation || "",
          type: rawData.type || "Unknown",
          platform: rawData.platform || "",
          name: rawData.name || "",
          description: rawData.description || "",
          descriptionHTML: rawData.descriptionHTML || "",
          image: rawData.image || "",
          identity: rawData.identity || {},
          cost: rawData.cost || {},
          buy_price: rawData.buy_price || 0,
          demo_price: rawData.demo_price || 0,
          downloads: rawData.downloads || 0,
          downloadLink: rawData.downloadLink || "",
          remoteDownloadLink: rawData.remoteDownloadLink || "",
          version: rawData.version || "1.0",
          uploaded: rawData.uploaded || "",
          updated: rawData.updated || "",
          md_description: rawData.md_description || "",
          ratings: rawData.ratings || [],
          rating: rawData.rating || 0,
          ratingCount: rawData.ratingCount || 0,
          commentCount: rawData.commentCount || 0,
          comments: rawData.comments || [],
          reviews: rawData.reviews || [],
          screenshots: rawData.screenshots,
          status: rawData.status || "NotComplete",
        };
      });
      
    return data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw new Error("Unable to load market data at this time.");
  }
}
