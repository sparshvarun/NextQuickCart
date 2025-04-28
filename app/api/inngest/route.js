import { Inngest } from "inngest";
import prisma from "@/config/db";

export const inngest = new Inngest({ id: "quickcart-next" });

// Sync user creation
export const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk'
  },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    await prisma.user.create({
      data: {
        id,
        name: first_name + ' ' + last_name,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        cartItems: {}
      }
    });
  }
);

// Other functions similarly updated to use Prisma...