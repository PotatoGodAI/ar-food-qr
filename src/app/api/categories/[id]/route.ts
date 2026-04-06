import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { items: true, restaurant: true },
  })
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(category)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const category = await prisma.category.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(category)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
