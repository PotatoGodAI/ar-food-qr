import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['model/gltf-binary', 'model/gltf+json', 'model/vnd.usdz+zip', 'application/octet-stream']
    const allowedExtensions = ['.glb', '.gltf', '.usdz']
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

    if (!allowedExtensions.includes(ext) && !allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use GLB, GLTF, or USDZ' }, { status: 400 })
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 50MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name}`

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type || 'application/octet-stream',
    })

    return NextResponse.json({ url: blob.url, filename: blob.filename })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
