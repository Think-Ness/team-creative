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

  if (folderId) {
    requestBody.parents = [folderId];
  }

  const response = await drive.files.create({
    requestBody,
    media: {
      mimeType: file.type || 'application/octet-stream',
      body: stream,
    },
    fields: 'id, name, webViewLink, webContentLink, size, mimeType',
  });

  return response.data;
}
