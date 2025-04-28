import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const { userId } = getAuth(request)

        const addresses = await prisma.address.findMany({
            where: { userId }
        });

        return NextResponse.json({ success: true, addresses });
    } catch (error) {
        return NextResponse.json({ success: false, message:error.message });
    }
}