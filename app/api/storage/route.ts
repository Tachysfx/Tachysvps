import { NextRequest, NextResponse } from 'next/server';
import { put, del, head } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'Storage configuration is missing' 
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const access = formData.get('access') as 'public' | 'private';
    
    if (!file || !folder) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Get metadata from formData
    const metadata: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('metadata[')) {
        const metaKey = key.slice(9, -1); // Remove 'metadata[' and ']'
        metadata[metaKey] = value as string;
      }
    }

    const path = `${folder}/${Date.now()}-${file.name}`;
    const { url } = await put(path, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      ...metadata
    });

    // Skip thumbnail generation on server side
    let thumbnail = null;
    if (file.type.startsWith('video/') && formData.get('generateThumbnail') === 'true') {
      // Log that thumbnail generation is skipped on server
      console.log('Video thumbnail generation is not supported in API routes');
    }

    return NextResponse.json({
      success: true,
      url,
      path,
      thumbnail,
      metadata: {
        contentType: file.type,
        size: file.size,
        ...metadata
      }
    });
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const access = searchParams.get('access') as 'public' | 'private';

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'Storage configuration is missing' 
      }, { status: 500 });
    }

    const decodedPath = decodeURIComponent(path);

    // For both private and public files, use head to get the URL
    const { url } = await head(decodedPath, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Storage GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get file URL' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { path, access = 'private' } = data;

    console.log('DELETE request received:', {
      path,
      access,
      timestamp: new Date().toISOString()
    });

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'Storage configuration is missing' 
      }, { status: 500 });
    }

    // Properly format the path for deletion
    const formattedPath = decodeURIComponent(path);
    
    try {
      // First check if the file exists
      console.log('Checking if file exists:', formattedPath);
      const exists = await head(formattedPath, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      }).catch((error) => {
        console.log('Head check error:', error);
        return null;
      });

      if (!exists) {
        console.log(`File not found: ${formattedPath}`);
        return NextResponse.json({ 
          success: true, 
          message: 'File already deleted or does not exist',
          path: formattedPath
        });
      }

      // Proceed with deletion
      console.log('Deleting file:', formattedPath);
      await del(formattedPath, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      console.log(`Successfully deleted: ${formattedPath}`);
      return NextResponse.json({ 
        success: true,
        message: 'File deleted successfully',
        path: formattedPath
      });
    } catch (error) {
      console.error('Blob deletion error:', {
        error,
        path: formattedPath,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete from blob storage',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete request error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
} 