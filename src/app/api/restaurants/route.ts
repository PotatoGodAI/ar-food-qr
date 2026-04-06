import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    include: { categories: { include: { _count: { select: { items: true } } } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(restaurants)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, slug, logo } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug required' }, { status: 400 })
  }

  const restaurant = await prisma.restaurant.create({
    data: { name, slug, logo: logo || null },
  })

  return NextResponse.json(restaurant, { status: 201 })
}
