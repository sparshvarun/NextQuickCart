import prisma from '@/config/db'
import authSeller from '@/lib/authSeller'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' });
        }

        const products = await prisma.product.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        
        return NextResponse.json({ success: true, products })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}