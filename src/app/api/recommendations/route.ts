import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '5';
    const algorithm = searchParams.get('algorithm') || 'hybrid';
    const userId = searchParams.get('userId') || 'user1';

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/recommendations?limit=${limit}&algorithm=${algorithm}&userId=${userId}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recommendations'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/recommendations`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recommendations interaction API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record interaction'
      },
      { status: 500 }
    );
  }
}