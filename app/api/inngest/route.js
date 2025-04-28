import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import { 
  syncUserCreation, 
  syncUserDeletion, 
  syncUserUpdation,
  createUserOrder 
} from "@/config/inngest";
import { serve } from "inngest/next";

// Export handlers directly - simpler approach that often works better
export const { GET, POST } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    createUserOrder
  ]
});

// Keep the OPTIONS handler for CORS preflight requests
export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}