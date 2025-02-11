import { put, del, list, head } from '@vercel/blob';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export interface StorageOptions {
  access: 'public' | 'private';
  folder: string;
  token: string;
  metadata?: Record<string, string>;
  dbUpdate?: {
    collection: string;
    docId: string;
    field: string;
  };
}

export class StorageService {
  private static instance: StorageService;
  private readonly token: string;
  
  private constructor() {
    this.token = process.env.BLOB_READ_WRITE_TOKEN || '';
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Generate a storage path for a file
   */
  private generatePath(folder: string, filename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${folder}/${timestamp}-${randomString}-${filename}`;
  }

  /**
   * Upload a file to Vercel Blob storage
   */
  async uploadFile(file: Blob | File, options: StorageOptions): Promise<{url: string, path: string}> {
    try {
      const filename = 'name' in file ? file.name : 'blob';
      const path = this.generatePath(options.folder, filename);
      
      const { url } = await put(path, file, {
        access: 'public',
        token: options.token || this.token,
        ...(options.metadata || {}) as Record<string, string>
      });

      // Update Firestore if dbUpdate is provided
      if (options.dbUpdate) {
        const { collection, docId, field } = options.dbUpdate;
        const docRef = doc(db, collection, docId);
        await updateDoc(docRef, { 
          [field]: url,
          isPrivate: options.access === 'private'
        });
      }

      return { url, path };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Get file URL from Vercel Blob storage
   */
  async getFileUrl(path: string, options: Omit<StorageOptions, 'folder'>): Promise<string> {
    try {
      const { url } = await head(path, {
        token: options.token || this.token
      });
      return url;
    } catch (error) {
      console.error('Get URL error:', error);
      throw new Error('Failed to get file URL');
    }
  }

  /**
   * Delete a file from Vercel Blob storage
   */
  async deleteFile(path: string, options: StorageOptions): Promise<void> {
    try {
      await del(path, {
        token: options.token || this.token
      });

      // Update Firestore if dbUpdate is provided
      if (options.dbUpdate) {
        const { collection, docId, field } = options.dbUpdate;
        const docRef = doc(db, collection, docId);
        await updateDoc(docRef, { [field]: null });
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Replace an existing file
   */
  async replaceFile(file: Blob | File, oldPath: string, options: StorageOptions): Promise<{url: string, path: string}> {
    try {
      // Delete old file
      try {
        await this.deleteFile(oldPath, options);
      } catch (error) {
        console.warn('Old file deletion failed:', error);
      }
      
      // Upload new file
      return await this.uploadFile(file, options);
    } catch (error) {
      console.error('Replace error:', error);
      throw new Error('Failed to replace file');
    }
  }

  /**
   * List all files in a folder
   */
  async listFiles(options: StorageOptions): Promise<Array<{url: string, path: string}>> {
    try {
      const { blobs } = await list({
        prefix: options.folder,
        token: options.token || this.token
      });
      return blobs.map(blob => ({
        url: blob.url,
        path: blob.pathname
      }));
    } catch (error) {
      console.error('List error:', error);
      throw new Error('Failed to list files');
    }
  }
}

export const storageService = StorageService.getInstance();

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