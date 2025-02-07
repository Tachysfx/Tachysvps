import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/app/functions/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    const url = await storageService.uploadFile(file, folder);
    const fileName = file.name;

    return NextResponse.json({ 
      success: true, 
      url,
      fileName 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const fileName = searchParams.get('fileName');

    if (!folder || !fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    try {
      const url = await storageService.getFileUrl(folder, fileName);
      return NextResponse.json({ success: true, url });
    } catch (error) {
      // Return placeholder image URL if file doesn't exist
      return NextResponse.json({ 
        success: true, 
        url: '/placeholder.png'
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Operation failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const fileName = searchParams.get('fileName');

    if (!folder || !fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    await storageService.deleteFile(folder, fileName);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const fileName = formData.get('fileName') as string;

    const url = await storageService.replaceFile(file, folder, fileName);

    return NextResponse.json({ 
      success: true, 
      url 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Replace failed' },
      { status: 500 }
    );
  }
} 