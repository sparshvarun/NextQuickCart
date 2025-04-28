import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        
        // Get orders with related address and product data
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                address: true,  // Include all address details
                items: {
                    include: {
                        product: true  // Include product details for each order item
                    }
                }
            },
            orderBy: {
                date: 'desc'  // Most recent orders first
            }
        })

        return NextResponse.json({ success: true, orders })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}