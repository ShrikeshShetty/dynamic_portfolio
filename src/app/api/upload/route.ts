import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob, uploadPdfToBlob } from '@/lib/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'portfolio';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let result;
    if (file.type === 'application/pdf') {
      result = await uploadPdfToBlob(file);
    } else {
      const url = await uploadToBlob(file, folder);
      result = { url, filename: file.name };
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
