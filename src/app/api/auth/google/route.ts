import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret || clientId === 'your_google_client_id_here') {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured in .env.local first.' },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  });

  return NextResponse.redirect(authUrl);
}
