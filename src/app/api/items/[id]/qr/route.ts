import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'
import QRCode from 'qrcode'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({ where: { id: params.id } })
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

    // Get the base URL from env or use a default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
    const arUrl = `${baseUrl}/view/${item.id}`

    // Generate QR code
    const qrBuffer = await QRCode.toBuffer(arUrl, {
      width: 512,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })

    // Upload to Vercel Blob
    const blob = await put(`qrcodes/${item.id}-qr.png`, qrBuffer, {
      access: 'public',
      contentType: 'image/png',
    })

    // Update item with QR URL
    await prisma.item.update({
      where: { id: params.id },
      data: { qrCodeUrl: blob.url },
    })

    return NextResponse.json({ qrCodeUrl: blob.url })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 })
  }
}
