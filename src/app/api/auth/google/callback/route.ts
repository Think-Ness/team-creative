import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error) {
    return new NextResponse(`<h1>OAuth Error: ${error}</h1>`, {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }

  if (!code) {
    return new NextResponse('<h1>No authorization code provided</h1>', {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth2Client.getToken(code);

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Google Drive Connected</title>
        <style>
          body { font-family: -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; max-width: 600px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h2 { margin-top: 0; color: #38bdf8; font-size: 22px; }
          p { color: #94a3b8; line-height: 1.5; }
          .token-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; color: #34d399; word-break: break-all; margin: 16px 0; }
          .btn { display: inline-block; background: #0284c7; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Google Drive OAuth2 Connected Successfully!</h2>
          <p>Here is your <strong>GOOGLE_REFRESH_TOKEN</strong>. Copy this value into your <code>.env.local</code> and Vercel Environment Variables:</p>
          <div class="token-box">${tokens.refresh_token || 'No new refresh token issued (consent was already granted previously). If needed, revoke app access in your Google Account security settings and re-authenticate.'}</div>
          <p>Once set, your application can automatically upload creative assets directly to your personal Google Drive account.</p>
          <a class="btn" href="/settings">Return to Creative System</a>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (err: any) {
    return new NextResponse(`<h1>Token Exchange Failed</h1><p>${err.message}</p>`, {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    });
  }
}
