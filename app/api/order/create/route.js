import { inngest } from "@/config/inngest";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        // Calculate amount using items
        let amount = 0;
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.product }
            });
            amount += product.offerPrice * item.quantity;
        }

        // Add 2% tax
        const finalAmount = amount + Math.floor(amount * 0.02);

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: finalAmount,
                date: Date.now()
            }
        })

        // Clear user cart
        await prisma.user.update({
            where: { id: userId },
            data: { cartItems: {} }
        });

        return NextResponse.json({ success: true, message: 'Order Placed' })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}