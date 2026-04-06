import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">AR Food QR</h1>
            <nav className="flex gap-4">
              <Link href="/admin/restaurants" className="btn btn-primary">
                Manage Restaurants
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            3D Food AR Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload 3D food models, generate QR codes, and let your customers 
            view dishes in augmented reality on their phones.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-lg font-semibold mb-2">Multi-Restaurant</h3>
            <p className="text-gray-600">
              Manage multiple restaurants with their own menus and categories
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">3D Models</h3>
            <p className="text-gray-600">
              Upload GLB, GLTF, or USDZ files for your food items
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold mb-2">AR Viewing</h3>
            <p className="text-gray-600">
              Customers scan QR codes to view dishes in AR on their phones
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              href="/admin/restaurants/new" 
              className="p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <div className="font-medium">Add New Restaurant</div>
              <div className="text-sm text-gray-500">Create a new restaurant profile</div>
            </Link>
            <Link 
              href="/admin/restaurants" 
              className="p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <div className="font-medium">View All Restaurants</div>
              <div className="text-sm text-gray-500">Manage existing restaurants</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
