import { google } from 'googleapis';
import { Readable } from 'stream';

export function getDriveClient() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'creative6102@creative6102.iam.gserviceaccount.com';

  // 1. Prioritize Google Service Account
  if (serviceAccountKey && serviceAccountKey.trim() !== '') {
    const formattedKey = serviceAccountKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
    const jwtClient = new google.auth.JWT({
      email: serviceAccountEmail,
      key: formattedKey,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    return {
      client: jwtClient,
      drive: google.drive({ version: 'v3', auth: jwtClient }),
      authType: 'service_account',
    };
  }

  // 2. Fallback to OAuth2
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error('Google Drive credentials are missing.');
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
    authType: 'oauth2',
  };
}

export async function uploadFileToDrive(file: File, folderId?: string, moduleName?: string) {
  const { drive } = getDriveClient();

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const requestBody: { name: string; parents?: string[] } = {
    name: file.name,
  };

  // Determine target folder (Master Folder Majmu' or specific module folder)
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
