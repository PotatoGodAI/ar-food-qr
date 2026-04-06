'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewRestaurantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', logo: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const restaurant = await res.json()
        router.push(`/admin/restaurants/${restaurant.id}`)
      } else {
        alert('Failed to create restaurant')
      }
    } catch {
      alert('Error creating restaurant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/restaurants" className="text-gray-600 hover:text-black">← Back</Link>
          <h1 className="text-xl font-bold">New Restaurant</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="The Golden Fork"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="input"
              placeholder="golden-fork"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Used in URLs: /admin/restaurants/{form.slug || 'slug'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo URL (optional)</label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="input"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/admin/restaurants" className="btn btn-secondary flex-1 text-center">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Restaurant'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
