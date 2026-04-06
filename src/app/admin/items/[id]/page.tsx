'use client'

import { useState, useEffect } from 'react'
import { useRouter, use } from 'next/navigation'
import Link from 'next/link'

interface Item {
  id: string
  name: string
  description: string | null
  price: number | null
  thumbnailUrl: string | null
  modelGlbUrl: string | null
  modelUsdzUrl: string | null
  qrCodeUrl: string | null
  category: { id: string; name: string; restaurant: { name: string; id: string } }
}

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [generatingQR, setGeneratingQR] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    thumbnailUrl: '',
    modelGlbUrl: '',
    modelUsdzUrl: '',
    qrCodeUrl: '',
  })

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then(res => res.json())
      .then(data => {
        setItem(data)
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          thumbnailUrl: data.thumbnailUrl || '',
          modelGlbUrl: data.modelGlbUrl || '',
          modelUsdzUrl: data.modelUsdzUrl || '',
          qrCodeUrl: data.qrCodeUrl || '',
        })
      })
      .finally(() => setLoading(false))
  }, [id])

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

  async function saveChanges() {
    setSaving(true)
    try {
      await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: form.price ? parseFloat(form.price) : null,
          thumbnailUrl: form.thumbnailUrl || null,
          modelGlbUrl: form.modelGlbUrl || null,
          modelUsdzUrl: form.modelUsdzUrl || null,
        }),
      })
    } finally {
      setSaving(false)
    }
  }

  async function generateQR() {
    setGeneratingQR(true)
    try {
      const res = await fetch(`/api/items/${id}/qr`, { method: 'POST' })
      if (res.ok) {
        const { qrCodeUrl } = await res.json()
        setForm(f => ({ ...f, qrCodeUrl }))
      }
    } finally {
      setGeneratingQR(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!item) return <div className="p-8">Item not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/admin/restaurants/${item.category.restaurant.id}`} className="text-gray-600 hover:text-black">← Back</Link>
          <h1 className="text-xl font-bold">{item.name}</h1>
          <button onClick={saveChanges} disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="input"
              rows={3}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="card">
          <h2 className="font-semibold mb-4">Thumbnail</h2>
          <div className="flex items-center gap-4">
            {form.thumbnailUrl && (
              <img src={form.thumbnailUrl} alt="" className="w-32 h-32 object-cover rounded-lg" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'thumbnail')}
              className="flex-1"
            />
          </div>
        </div>

        {/* 3D Models */}
        <div className="card space-y-4">
          <h2 className="font-semibold">3D Models</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">GLB/GLTF</label>
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'glb')}
              />
              {form.modelGlbUrl && <span className="text-sm text-green-600">✓ Uploaded</span>}
            </div>
            <div>
              <label className="block text-sm mb-1">USDZ (iOS)</label>
              <input
                type="file"
                accept=".usdz"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'usdz')}
              />
              {form.modelUsdzUrl && <span className="text-sm text-green-600">✓ Uploaded</span>}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">QR Code</h2>
            <button
              onClick={generateQR}
              disabled={generatingQR || !form.modelGlbUrl}
              className="btn btn-secondary"
            >
              {generatingQR ? 'Generating...' : 'Generate QR'}
            </button>
          </div>
          {form.qrCodeUrl ? (
            <div className="flex items-center gap-4">
              <img src={form.qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              <div>
                <p className="text-sm text-gray-600 mb-2">Scan this QR with your phone to view in AR</p>
                <Link href={`/view/${id}`} className="text-blue-600 hover:underline">
                  Preview AR Page →
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              {form.modelGlbUrl ? 'Click Generate to create QR code' : 'Upload a 3D model first'}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
