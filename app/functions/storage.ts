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
   * Delete a file from storage
   */
  async deleteFile(path: string, options: StorageOptions): Promise<void> {
    try {
      if (!path) {
        throw new Error('Path is required for deletion');
      }

      // Extract pathname from URL if the path looks like a URL
      let pathToDelete = path;
      if (path.startsWith('http')) {
        try {
          const url = new URL(path);
          pathToDelete = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
        } catch (error) {
          console.warn('Failed to parse URL:', path);
        }
      }

      console.log('Delete attempt:', {
        originalPath: path,
        pathToDelete,
        decodedPath: decodeURIComponent(pathToDelete),
        options,
        timestamp: new Date().toISOString()
      });

      const response = await fetch('/api/storage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: decodeURIComponent(pathToDelete),
          access: options.access
        })
      });

      const data = await response.json();
      console.log('Delete response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Delete operation failed');
      }

      // Update Firestore if needed
      if (options.dbUpdate) {
        const { collection, docId, field } = options.dbUpdate;
        const docRef = doc(db, collection, docId);
        await updateDoc(docRef, { 
          [field]: null,
          [`${field}_path`]: null
        });
      }
    } catch (error) {
      console.error('Delete error:', {
        error,
        path,
        options,
        timestamp: new Date().toISOString()
      });
      throw error;
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

  /**
   * Handle profile image update with proper blob management
   */
  async updateProfileImage(file: File, options: StorageOptions & {
    currentPhotoURL?: string;
    currentPhotoPath?: string;
  }): Promise<{url: string; path: string}> {
    try {
      const { currentPhotoURL, currentPhotoPath, ...uploadOptions } = options;

      // Only delete old image if it's from blob storage
      if (currentPhotoURL && isBlobStorageUrl(currentPhotoURL)) {
        try {
          await this.deleteFile(currentPhotoURL, {
            access: 'public',
            folder: 'Profile',
            token: this.token,
            dbUpdate: options.dbUpdate
          });
        } catch (error) {
          console.warn('Failed to delete old profile image:', error);
          // Continue with upload even if delete fails
        }
      }

      // Upload new image
      return await this.uploadFile(file, {
        ...uploadOptions,
        folder: 'Profile',
        metadata: {
          purpose: 'profile',
          contentType: file.type
        }
      });
    } catch (error) {
      console.error('Profile image update error:', error);
      throw new Error('Failed to update profile image');
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
    // Should handle old image deletion if replacing
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

// Add a helper function to check if URL is from blob storage
export const isBlobStorageUrl = (url: string): boolean => {
  try {
    if (!url) return false;
    // Check for both possible Vercel Blob URL patterns
    const isBlob = url.includes('.public.blob.vercel-storage') || 
                  url.includes('.blob.vercel-storage');
    console.log('URL check:', { 
      url, 
      isBlob,
      urlParts: url.split('/')
    });
    return isBlob;
  } catch (error) {
    console.warn('Invalid URL in blob check:', url);
    return false;
  }
};

// Add this helper function
export const replaceAlgoImage = async (
  file: File, 
  oldImageUrl?: string, 
  oldImagePath?: string
): Promise<{ url: string; fileName: string } | null> => {
  try {
    // Delete old image if it exists
    if (oldImageUrl && oldImagePath && isBlobStorageUrl(oldImageUrl)) {
      await storageService.deleteFile(oldImageUrl, {
        access: 'public',
        folder: 'algo-images',
        token: process.env.BLOB_READ_WRITE_TOKEN || ''
      });
    }

    // Upload new image
    return await uploadAlgoImage(file);
  } catch (error) {
    console.error('Replace algo image error:', error);
    return null;
  }
};

// Add this helper function
export const replaceVideo = async (
  file: File,
  oldVideoUrl?: string,
  oldVideoPath?: string,
  oldThumbnailUrl?: string,
  generateThumbnail = true
): Promise<{ url: string; path: string; thumbnail?: string } | null> => {
  try {
    // Delete old video and thumbnail if they exist
    if (oldVideoUrl && oldVideoPath && isBlobStorageUrl(oldVideoUrl)) {
      await storageService.deleteFile(oldVideoUrl, {
        access: 'public',
        folder: 'videos',
        token: process.env.BLOB_READ_WRITE_TOKEN || ''
      });

      // Delete old thumbnail if it exists
      if (oldThumbnailUrl && isBlobStorageUrl(oldThumbnailUrl)) {
        await storageService.deleteFile(oldThumbnailUrl, {
          access: 'public',
          folder: 'thumbnails',
          token: process.env.BLOB_READ_WRITE_TOKEN || ''
        });
      }
    }

    // Upload new video
    return await uploadVideo(file, generateThumbnail);
  } catch (error) {
    console.error('Replace video error:', error);
    return null;
  }
}; 