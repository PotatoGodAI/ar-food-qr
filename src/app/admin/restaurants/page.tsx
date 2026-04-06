'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Restaurant {
  id: string
  name: string
  slug: string
  logo: string | null
  categories: { id: string; name: string }[]
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  async function fetchRestaurants() {
    try {
      const res = await fetch('/api/restaurants')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRestaurants(data)
    } catch (err) {
      setError('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  async function deleteRestaurant(id: string) {
    if (!confirm('Delete this restaurant?')) return
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRestaurants(restaurants.filter(r => r.id !== id))
      }
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-black">← Back</Link>
          <h1 className="text-xl font-bold">Restaurants</h1>
          <Link href="/admin/restaurants/new" className="btn btn-primary">Add Restaurant</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {restaurants.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No restaurants yet</p>
            <Link href="/admin/restaurants/new" className="btn btn-primary">Create First Restaurant</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500">/{restaurant.slug}</p>
                  </div>
                  {restaurant.logo && (
                    <img src={restaurant.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {restaurant.categories.length} categories
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/restaurants/${restaurant.id}`} className="btn btn-secondary flex-1 text-center">
                    Manage
                  </Link>
                  <button onClick={() => deleteRestaurant(restaurant.id)} className="btn btn-secondary text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
