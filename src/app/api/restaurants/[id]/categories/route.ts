import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const categories = await prisma.category.findMany({
    where: { restaurantId: params.id },
    include: { _count: { select: { items: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { name } = body

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  try {
    const category = await prisma.category.create({
      data: { name, restaurantId: params.id },
    })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
  }
}
