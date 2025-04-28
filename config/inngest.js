import { Inngest } from "inngest";
import prisma from "@/config/db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    await prisma.user.create({
      data: {
        id,
        email: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        imageUrl: image_url
      }
    });
  }
);

// Inngest Function to update user data in database 
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    await prisma.user.update({
      where: { id },
      data: {
        email: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        imageUrl: image_url
      }
    });
  }
);

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await prisma.user.delete({
      where: { id }
    });
  }
);

// Inngest Function to create user's order in database
export const createUserOrder = inngest.createFunction(
  {
    id: 'create-user-order',
    batchEvents: {
      maxSize: 5,
      timeout: '5s'
    }
  },
  { event: 'order/created' },
  async ({ events }) => {
    const orderPromises = events.map(async (event) => {
      return prisma.order.create({
        data: {
          userId: event.data.userId,
          amount: event.data.amount,
          addressId: event.data.address, // <-- Use addressId if that's your schema
          date: new Date(event.data.date), // <-- Ensure this is a Date object
          items: {
            create: event.data.items.map(item => ({
              productId: item.productId, // <-- Adjust if your schema uses a different field
              quantity: item.quantity
            }))
          }
        }
      });
    });

    await Promise.all(orderPromises);

    return { success: true, processed: events.length };
  }
);