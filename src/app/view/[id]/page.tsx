'use client'

import { useState, useEffect } from 'react'
import { use } from 'next/navigation'

interface Item {
  id: string
  name: string
  description: string | null
  price: number | null
  thumbnailUrl: string | null
  modelGlbUrl: string | null
  modelUsdzUrl: string | null
  category: { name: string; restaurant: { name: string } }
}

export default function ARViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Detect device
    const ua = navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua))
    setIsAndroid(/android/.test(ua))

    // Fetch item
    fetch(`/api/items/${id}`)
      .then(res => res.json())
      .then(setItem)
      .catch(() => setError('Failed to load item'))
      .finally(() => setLoading(false))
  }, [id])

  function openAR() {
    if (!item) return

    if (isIOS && item.modelUsdzUrl) {
      // iOS Quick Look
      window.location.href = item.modelUsdzUrl
    } else if (isAndroid && item.modelGlbUrl) {
      // Android Scene Viewer
      const gltf = encodeURIComponent(item.modelGlbUrl)
      const title = encodeURIComponent(item.name)
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${gltf}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`
    } else {
      // Fallback - show model info
      setError('AR not supported on this device. Please use an iPhone or Android phone.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Item Not Found</h1>
          <p className="text-gray-600">{error || 'This item does not exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">{item.category.restaurant.name}</p>
          <h1 className="text-2xl font-bold">{item.name}</h1>
          {item.category.name && (
            <p className="text-sm text-gray-400">{item.category.name}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Preview Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {item.thumbnailUrl ? (
            <img 
              src={item.thumbnailUrl} 
              alt={item.name}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-600 text-center mb-6">{item.description}</p>
        )}

        {/* Price */}
        {item.price && (
          <p className="text-3xl font-bold text-center mb-8">${item.price.toFixed(2)}</p>
        )}

        {/* AR Button */}
        <button
          onClick={openAR}
          className="w-full bg-black text-white text-lg font-semibold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          {isIOS ? 'View in AR (Quick Look) 📱' : isAndroid ? 'View in AR (Scene Viewer) 📱' : 'View in AR 📱'}
        </button>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Works on iPhone (iOS 12+) and Android phones</p>
          <p className="mt-1">Point your camera at any surface to place the item</p>
        </div>
      </main>
    </div>
  )
}
