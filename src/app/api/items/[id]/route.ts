import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: { category: { include: { restaurant: true } } },
  })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const item = await prisma.item.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(item)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.item.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
