import { put, del, list, head } from '@vercel/blob';
import type { PutBlobResult } from '@vercel/blob';

// Add your blob store token
const BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_H8BF1SyDn7XDuFt2_mMwsW2OVhhvHQewWxJ45hw7ajX6pJx";

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Upload a file to Vercel Blob storage
   * @param file Blob or File to upload
   * @param folder Folder path
   * @returns URL of the uploaded file
   */
  async uploadFile(file: Blob | File, folder: string): Promise<string> {
    try {
      const filename = 'name' in file ? file.name : 'blob';
      const { url } = await put(`${folder}/${filename}`, file, {
        access: 'public',
        token: BLOB_READ_WRITE_TOKEN
      });
      return url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get file URL from Vercel Blob storage
   * @param folder Folder path
   * @param fileName File name
   * @returns URL of the file or placeholder URL if file doesn't exist
   */
  async getFileUrl(folder: string, fileName: string): Promise<string> {
    try {
      
      // First check if folder exists
      const { blobs } = await list({ 
        prefix: folder,
        token: BLOB_READ_WRITE_TOKEN 
      });
      
      if (blobs.length === 0) {
        return '/placeholder.png';
      }
      
      // Then try to get specific file
      try {
        const { url } = await head(`${folder}/${fileName}`, {
          token: BLOB_READ_WRITE_TOKEN
        });
        return url;
      } catch (error) {
        return '/placeholder.png';
      }
    } catch (error) {
      return '/placeholder.png';
    }
  }

  /**
   * Delete a file from Vercel Blob storage
   * @param folder Folder path
   * @param fileName File name
   */
  async deleteFile(folder: string, fileName: string): Promise<void> {
    try {
      await del(`${folder}/${fileName}`, {
        token: BLOB_READ_WRITE_TOKEN
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Replace an existing file
   * @param file New file to upload
   * @param folder Folder path
   * @param fileName Name of file to replace
   * @returns URL of the new file
   */
  async replaceFile(file: Blob | File, folder: string, fileName: string): Promise<string> {
    try {
      // Delete existing file if it exists
      try {
        await this.deleteFile(folder, fileName);
      } catch (error) {
        // Ignore error if file doesn't exist
      }
      
      // Upload new file
      return await this.uploadFile(file, folder);
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all files in a folder
   * @param folder Folder path
   * @returns Array of file URLs
   */
  async listFiles(folder: string): Promise<string[]> {
    try {
      const { blobs } = await list({ prefix: folder });
      return blobs.map(blob => blob.url);
    } catch (error) {
      throw error;
    }
  }
}

// Helper functions for common operations
export const getAlgoImageUrl = async (folder: string, fileName: string): Promise<string | null> => {
  try {
    
    const response = await fetch(
      `/api/storage?folder=${folder}&fileName=${fileName}`
    );
    const data = await response.json() as { success: boolean; url: string };
    return data.success ? data.url : null;
  } catch (error) {
    return null;
  }
};

export const uploadAlgoImage = async (file: File): Promise<{ url: string; fileName: string } | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'algo-images');

    const response = await fetch('/api/storage', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json() as { 
      success: boolean; 
      url: string; 
      fileName: string 
    };
    return data.success ? { url: data.url, fileName: data.fileName } : null;
  } catch (error) {
    return null;
  }
};

export const storageService = StorageService.getInstance(); 