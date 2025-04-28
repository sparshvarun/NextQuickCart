import { NextResponse } from "next/server";
import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import { 
  syncUserCreation, 
  syncUserDeletion, 
  syncUserUpdation,
  createUserOrder 
} from "@/config/inngest";

// Create handlers with wrapped responses
const handlers = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    createUserOrder
  ]
});

// Add CORS headers to help with connectivity
export async function GET(req) {
  const res = await handlers.GET(req);
  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      ...Object.fromEntries(res.headers),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function POST(req) {
  const res = await handlers.POST(req);
  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      ...Object.fromEntries(res.headers),
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}