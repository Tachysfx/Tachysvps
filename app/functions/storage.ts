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
  generateThumbnail?: boolean;
  maxDuration?: number;
  maxSize?: number;
}

export interface VideoMetadata {
  duration: number;
  thumbnail?: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export class StorageService {
  private static instance: StorageService;
  private readonly token: string;
  private readonly maxVideoSize = 100 * 1024 * 1024;
  private readonly maxVideoDuration = 300;
  private readonly allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  
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
   * Generate video thumbnail using canvas
   */
  private async generateVideoThumbnail(videoFile: File): Promise<string | null> {
    // Skip thumbnail generation on server side
    if (typeof window === 'undefined') {
      return null;
    }

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              this.uploadFile(blob, {
                folder: 'thumbnails',
                access: 'public',
                token: this.token
              }).then(result => {
                resolve(result.url);
              }).catch(reject);
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/jpeg', 0.7);
        }
      };

      video.onerror = () => {
        reject(new Error('Error loading video'));
      };

      video.src = URL.createObjectURL(videoFile);
      video.onloadeddata = () => {
        const seekTime = Math.min(1, video.duration * 0.25);
        video.currentTime = seekTime;
      };
    });
  }

  /**
   * Get video metadata
   */
  private async getVideoMetadata(videoFile: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          dimensions: {
            width: video.videoWidth,
            height: video.videoHeight
          }
        });
      };

      video.onerror = () => {
        reject(new Error('Error loading video metadata'));
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  /**
   * Validate video file
   */
  private async validateVideo(file: File, options?: StorageOptions): Promise<void> {
    if (!this.allowedVideoTypes.includes(file.type)) {
      throw new Error('Invalid video format. Supported formats: MP4, WebM, QuickTime');
    }

    const maxSize = options?.maxSize || this.maxVideoSize;
    if (file.size > maxSize) {
      throw new Error(`Video size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`);
    }

    const metadata = await this.getVideoMetadata(file);
    const maxDuration = options?.maxDuration || this.maxVideoDuration;
    if (metadata.duration > maxDuration) {
      throw new Error(`Video duration exceeds maximum limit of ${maxDuration} seconds`);
    }
  }

  /**
   * Upload a video file with thumbnail generation
   */
  async uploadVideo(file: File, options: StorageOptions): Promise<{
    url: string;
    path: string;
    thumbnail?: string;
    metadata: VideoMetadata;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', options.folder);
      formData.append('access', options.access);
      formData.append('generateThumbnail', 'true');
      
      if (options.metadata) {
        Object.entries(options.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, value);
        });
      }

      const response = await fetch('/api/storage', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Video upload failed');
      }

      return {
        url: data.url,
        path: data.path,
        thumbnail: data.thumbnail,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Video upload error:', error);
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Upload a file to Vercel Blob storage
   */
  async uploadFile(file: Blob | File, options: StorageOptions): Promise<{url: string, path: string}> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', options.folder);
      formData.append('access', options.access);
      
      if (options.metadata) {
        Object.entries(options.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, value);
        });
      }

      const response = await fetch('/api/storage', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      return {
        url: data.url,
        path: data.path
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Get file URL from Vercel Blob storage with signed URLs for private files
   */
  async getFileUrl(path: string, options: Omit<StorageOptions, 'folder'>): Promise<string> {
    try {
      const response = await fetch(`/api/storage?path=${encodeURIComponent(path)}&access=${options.access}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get file URL');
      }
      
      return data.url;
    } catch (error) {
      console.error('Get URL error:', error);
      throw new Error('Failed to get file URL');
    }
  }

  /**
   * Delete a file from Vercel Blob storage with improved error handling
   */
  async deleteFile(path: string, options: StorageOptions): Promise<void> {
    try {
      // Ensure path is properly formatted
      const formattedPath = decodeURIComponent(path);
      
      const response = await fetch('/api/storage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path: formattedPath,
          access: options.access
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Delete operation failed');
      }

      // Update Firestore if needed
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
      await this.deleteFile(oldPath, options);
      
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

// Helper functions for videos
export const uploadVideo = async (
  file: File,
  generateThumbnail = true
): Promise<{ url: string; path: string; thumbnail?: string } | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'videos');
    formData.append('generateThumbnail', generateThumbnail.toString());

    const response = await fetch('/api/storage', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.success ? {
      url: data.url,
      path: data.path,
      thumbnail: data.thumbnail
    } : null;
  } catch (error) {
    console.error('Error uploading video:', error);
    return null;
  }
};

export const getVideoUrl = async (folder: string, fileName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `/api/storage?folder=${folder}&fileName=${fileName}&type=video`
    );
    const data = await response.json();
    return data.success ? data.url : null;
  } catch (error) {
    return null;
  }
}; 