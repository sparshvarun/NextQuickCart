import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";

// Import all your functions from config/inngest.js
import { 
  syncUserCreation, 
  syncUserDeletion, 
  syncUserUpdation,
  createUserOrder 
} from "@/config/inngest";

// This properly serves the Inngest API endpoint
export const { GET, POST } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    createUserOrder
  ]
});
