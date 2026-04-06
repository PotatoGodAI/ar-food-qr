import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: { categories: { include: { _count: { select: { items: true } } } } },
  })
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(restaurant)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const restaurant = await prisma.restaurant.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(restaurant)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.restaurant.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
