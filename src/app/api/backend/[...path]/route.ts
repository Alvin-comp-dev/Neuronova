import { NextRequest, NextResponse } from 'next/server';

// This is a simple proxy to your backend
export async function GET(request: NextRequest) {
  return await handleBackendRequest(request);
}

export async function POST(request: NextRequest) {
  return await handleBackendRequest(request);
}

export async function PUT(request: NextRequest) {
  return await handleBackendRequest(request);
}

export async function DELETE(request: NextRequest) {
  return await handleBackendRequest(request);
}

async function handleBackendRequest(request: NextRequest) {
  // For now, just return a simple response
  // You can expand this to handle your backend logic
  
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/backend', '');
  
  if (path === '/health') {
    return NextResponse.json({
      status: 'OK',
      message: 'Neuronova API is running on Vercel',
      timestamp: new Date().toISOString(),
    });
  }
  
  return NextResponse.json({ 
    error: 'Backend integration in progress',
    path: path,
    method: request.method 
  }, { status: 501 });
} 