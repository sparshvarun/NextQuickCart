import prisma from '@/config/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const products = await prisma.product.findMany()
        return NextResponse.json({ success:true, products })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}