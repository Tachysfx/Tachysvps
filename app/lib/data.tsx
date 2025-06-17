import { db } from "../functions/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export interface Screenshot {
  link: string;
}

export interface EnrichedAlgo {
  id: string;
  identity: string;
  name: string;
  rating: number;
  image: string;
  buy_price: number;
  type: string;
  sellerName: string;
  sellerId: string;
  uploaded: string;
  updated: string;
  version: string;
  downloads: number;
  descriptionHTML?: string;
  md_description?: string;
  screenshots: Array<string>;
  platform: string;
  description: string;
  cost?: string;
  ratingCount: number;
}

export async function fetchEnrichedAlgo(id: string): Promise<EnrichedAlgo> {
  try {
    const algoRef = doc(db, "algos", id);
    const algoDoc = await getDoc(algoRef);
    
    if (!algoDoc.exists()) {
      throw new Error('Algorithm not found');
    }

    const algoData = algoDoc.data();

    return {
      id: algoDoc.id,
      identity: algoData.identity || 'Internal',
      name: algoData.name,
      rating: algoData.rating || 0,
      image: algoData.image,
      buy_price: algoData.buy_price,
      type: algoData.type,
      sellerName: algoData.sellerName,
      sellerId: algoData.sellerId,
      uploaded: algoData.uploaded,
      updated: algoData.updated,
      version: algoData.version,
      downloads: algoData.downloads || 0,
      descriptionHTML: algoData.descriptionHTML,
      md_description: algoData.md_description,
      screenshots: algoData.screenshots,
      platform: algoData.platform,
      description: algoData.description || '',
      cost: algoData.cost,
      ratingCount: algoData.ratingCount || 0
    };
  } catch (error) {
    console.error('Error fetching algorithm:', error);
    throw error;
  }
}

export async function MarketFrontData(): Promise<EnrichedAlgo[]> {
  try {
    const algosRef = collection(db, "algos");
    const algosDocs = await getDocs(algosRef);
    
    return algosDocs.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        identity: data.identity || 'Internal',
        name: data.name,
        rating: data.rating || 0,
        image: data.image,
        buy_price: data.buy_price,
        type: data.type,
        sellerName: data.sellerName,
        sellerId: data.sellerId,
        uploaded: data.uploaded,
        updated: data.updated,
        version: data.version,
        downloads: data.downloads || 0,
        descriptionHTML: data.descriptionHTML,
        md_description: data.md_description,
        screenshots: data.screenshots,
        platform: data.platform,
        description: data.description || '',
        cost: data.cost,
        ratingCount: data.ratingCount || 0
      };
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
} 