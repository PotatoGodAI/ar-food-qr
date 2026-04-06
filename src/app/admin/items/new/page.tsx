'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Category { id: string; name: string; restaurant: { name: string } }

export default function NewItemPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const restaurantId = searchParams.get('restaurantId')

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: categoryId || '',
    thumbnailUrl: '',
    modelGlbUrl: '',
    modelUsdzUrl: '',
  })

  useEffect(() => {
    if (restaurantId) {
      fetch(`/api/restaurants/${restaurantId}/categories`)
        .then(res => res.json())
        .then(setCategories)
    }
  }, [restaurantId])

  async function uploadFile(file: File, type: 'glb' | 'usdz' | 'thumbnail') {
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        if (type === 'thumbnail') setForm(f => ({ ...f, thumbnailUrl: url }))
        if (type === 'glb') setForm(f => ({ ...f, modelGlbUrl: url }))
        if (type === 'usdz') setForm(f => ({ ...f, modelUsdzUrl: url }))
      }
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const item = await res.json()
        router.push(`/admin/items/${item.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/restaurants" className="text-gray-600 hover:text-black">← Back</Link>
          <h1 className="text-xl font-bold">New Item</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold">Basic Info</h2>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Item name"
              required
            />
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="input"
              placeholder="Description"
              rows={3}
            />
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="input"
              placeholder="Price"
            />
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.restaurant.name} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold">Thumbnail</h2>
            <input
              type="file"
              accept="image/*"
              onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'thumbnail')}
              className="w-full border p-2 rounded"
            />
            {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="" className="w-32 h-32 object-cover rounded" />}
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold">3D Models</h2>
            <div>
              <label className="block text-sm mb-1">GLB/GLTF File</label>
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'glb')}
                className="w-full border p-2 rounded"
              />
              {form.modelGlbUrl && <span className="text-sm text-green-600">✓ Uploaded</span>}
            </div>
            <div>
              <label className="block text-sm mb-1">USDZ File (iOS)</label>
              <input
                type="file"
                accept=".usdz"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'usdz')}
                className="w-full border p-2 rounded"
              />
              {form.modelUsdzUrl && <span className="text-sm text-green-600">✓ Uploaded</span>}
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/admin/restaurants" className="btn btn-secondary flex-1 text-center">Cancel</Link>
            <button type="submit" disabled={loading || uploading} className="btn btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
