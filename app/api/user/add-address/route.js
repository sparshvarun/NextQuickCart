import prisma from "@/config/db"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const {address} = await request.json()

        const newAddress = await prisma.address.create({
            data: {
                ...address,
                userId,
                // Ensure pincode is stored as integer
                pincode: typeof address.pincode === 'string' ? parseInt(address.pincode) : address.pincode
            }
        })

        return NextResponse.json({ success: true, message: "Address added successfully", newAddress })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}