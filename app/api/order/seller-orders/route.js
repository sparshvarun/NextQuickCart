import prisma from "@/config/db";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        // Get all orders with their related address and product information
        const orders = await prisma.order.findMany({
            include: {
                address: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json({ success: true, orders })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}