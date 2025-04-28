import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation, createUserOrder } from "@/config/inngest";

// Create an API that serves your functions - note this should match your original approach
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder
  ],
});

// No need for a separate OPTIONS handler as Inngest handles this internally