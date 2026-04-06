import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')

  const items = await prisma.item.findMany({
    where: categoryId ? { categoryId } : {},
    include: { category: { include: { restaurant: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, price, thumbnailUrl, modelGlbUrl, modelUsdzUrl, categoryId } = body

  if (!name || !categoryId) {
    return NextResponse.json({ error: 'Name and category required' }, { status: 400 })
  }

  const item = await prisma.item.create({
    data: {
      name,
      description: description || null,
      price: price ? parseFloat(price) : null,
      thumbnailUrl: thumbnailUrl || null,
      modelGlbUrl: modelGlbUrl || null,
      modelUsdzUrl: modelUsdzUrl || null,
      categoryId,
    },
  })

  return NextResponse.json(item, { status: 201 })
}
