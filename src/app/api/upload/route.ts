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

    const hasServiceAccount = !!(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.trim() !== '');
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const hasOAuth = !!(refreshToken && refreshToken !== 'your_google_refresh_token_here' && refreshToken.trim() !== '');
    const canUploadToDrive = hasServiceAccount || hasOAuth;

    if (canUploadToDrive) {
      try {
        const driveFile = await uploadFileToDrive(file, folderId);
        return NextResponse.json({
          success: true,
          file: driveFile,
          storage: 'google_drive',
          authType: hasServiceAccount ? 'service_account' : 'oauth2',
        });
      } catch (driveErr: any) {
        console.warn('Google Drive direct upload failed, falling back to local base64 preview:', driveErr);
      }
    }

    // Fallback: Generate local data URL preview so user workflow is never blocked
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      file: {
        id: `local-${Date.now()}`,
        name: file.name,
        webViewLink: dataUrl,
        thumbnailLink: dataUrl,
        mimeType: file.type,
        size: file.size,
      },
      storage: 'fallback_preview',
      note: canUploadToDrive ? undefined : 'Menggunakan preview lokal. Hubungkan Google Service Account atau OAuth untuk menyimpan langsung ke Google Drive Cloud.',
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses upload file' },
      { status: 500 }
    );
  }
}
