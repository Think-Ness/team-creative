import { google } from 'googleapis';
import { Readable } from 'stream';

export function getDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth2 credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are missing.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  if (refreshToken && refreshToken !== 'your_google_refresh_token_here') {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  return {
    client: oauth2Client,
    drive: google.drive({ version: 'v3', auth: oauth2Client }),
  };
}

export async function uploadFileToDrive(file: File, folderId?: string) {
  const { drive } = getDriveClient();

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const requestBody: { name: string; parents?: string[] } = {
    name: file.name,
  };

  const targetFolder = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (targetFolder && targetFolder.trim() !== '') {
    requestBody.parents = [targetFolder.trim()];
  }

  const response = await drive.files.create({
    requestBody,
    media: {
      mimeType: file.type || 'application/octet-stream',
      body: stream,
    },
    fields: 'id, name, webViewLink, webContentLink, size, mimeType',
  });

  if (response.data.id) {
    try {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permErr) {
      console.warn('Could not set public permissions on drive file:', permErr);
    }
  }

  return {
    ...response.data,
    thumbnailLink: response.data.id 
      ? `https://lh3.googleusercontent.com/d/${response.data.id}` 
      : response.data.webViewLink,
  };
}
