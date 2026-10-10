import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToDrive } from '@/lib/gdrive';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folderId = formData.get('folderId') as string | undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const driveFile = await uploadFileToDrive(file, folderId);

    return NextResponse.json({
      success: true,
      file: driveFile,
    });
  } catch (error: any) {
    console.error('Google Drive Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload to Google Drive' },
      { status: 500 }
    );
  }
}
