import { NextRequest, NextResponse } from 'next/server';
import { storageService, StorageOptions } from '../../functions/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const access = formData.get('access') as 'public' | 'private' || 'private';
    const collection = formData.get('collection') as string;
    const docId = formData.get('docId') as string;
    const field = formData.get('field') as string;
    const oldPath = formData.get('oldPath') as string;

    const options: StorageOptions = {
      access,
      folder,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      dbUpdate: collection && docId && field ? {
        collection,
        docId,
        field
      } : undefined
    };

    let result;
    if (oldPath) {
      // Replace existing file
      result = await storageService.replaceFile(file, oldPath, options);
    } else {
      // Upload new file
      result = await storageService.uploadFile(file, options);
    }

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      path: result.path
    });
  } catch (error) {
    console.error('Storage operation error:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const access = searchParams.get('access') as 'public' | 'private' || 'private';

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    const url = await storageService.getFileUrl(path, {
      access,
      token: process.env.BLOB_READ_WRITE_TOKEN || ''
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get file URL' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const access = searchParams.get('access') as 'public' | 'private' || 'private';
    const collection = searchParams.get('collection');
    const docId = searchParams.get('docId');
    const field = searchParams.get('field');

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    await storageService.deleteFile(path, {
      access,
      folder: path.split('/')[0],
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      dbUpdate: collection && docId && field ? {
        collection,
        docId,
        field
      } : undefined
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
} 