'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'

interface Category { id: string; name: string; _count: { items: number } }
interface Item { id: string; name: string; thumbnailUrl: string | null }

interface Restaurant {
  id: string
  name: string
  slug: string
  logo: string | null
  categories: Category[]
}

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories')

  useEffect(() => { fetchRestaurant() }, [id])

  async function fetchRestaurant() {
    try {
      const res = await fetch(`/api/restaurants/${id}`)
      if (res.ok) setRestaurant(await res.json())
    } finally { setLoading(false) }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.trim()) return
    const res = await fetch(`/api/restaurants/${id}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    })
    if (res.ok) {
      setNewCategory('')
      fetchRestaurant()
    }
  }

  async function deleteCategory(catId: string) {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/categories/${catId}`, { method: 'DELETE' })
    fetchRestaurant()
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!restaurant) return <div className="p-8">Restaurant not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/restaurants" className="text-gray-600 hover:text-black">← Back</Link>
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
          <Link href={`/admin/items/new?restaurantId=${id}`} className="btn btn-primary">Add Item</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button onClick={() => setActiveTab('categories')} className={`pb-2 px-1 ${activeTab === 'categories' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}>
            Categories ({restaurant.categories.length})
          </button>
          <button onClick={() => setActiveTab('items')} className={`pb-2 px-1 ${activeTab === 'items' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}>
            All Items
          </button>
        </div>

        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add Category */}
            <form onSubmit={addCategory} className="card flex gap-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input flex-1"
                placeholder="Category name (e.g., Appetizers)"
              />
              <button type="submit" className="btn btn-primary">Add</button>
            </form>

            {/* Categories List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurant.categories.map((cat) => (
                <div key={cat.id} className="card flex justify-between items-center">
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-gray-500">{cat._count.items} items</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/items/new?categoryId=${cat.id}`} className="text-sm text-blue-600 hover:underline">
                      Add Item
                    </Link>
                    <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="card">
            <p className="text-gray-600">Items view coming soon. Use "Add Item" from categories to add items.</p>
          </div>
        )}
      </main>
    </div>
  )
}
