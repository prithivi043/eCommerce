import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 12;

  const toggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products || res.data); // Ensure array format
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category === activeCategory ? '' : category);
    setCurrentPage(1);
    setSelectedProduct(null);
  };

  const minPrice = Math.min(...products.map(p => p.discountPrice || p.price), 0);
  const maxPrice = Math.max(...products.map(p => p.discountPrice || p.price), 100000);

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(search.toLowerCase());
    const stockMatch = !inStockOnly || product.stock > 0;
    const ratingMatch = (product.rating ?? 0) >= ratingFilter;
    const price = product.discountPrice || product.price;
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    const categoryMatch = activeCategory ? product.category === activeCategory : true;
    return nameMatch && stockMatch && ratingMatch && priceMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const viewableProducts = showFavorites
    ? products.filter(p => favoriteIds.includes(p._id))
    : selectedProduct
      ? []
      : currentProducts;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const relatedProducts = selectedProduct
    ? products.filter(p => p.category === selectedProduct.category && p._id !== selectedProduct._id)
    : [];

  return (
    <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-6 py-10 bg-slate-50 min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="lg:w-1/4 w-full mb-10 lg:mb-0 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 sticky top-4 border border-slate-200">
          <input
            type="text"
            placeholder="🔍 Search product name"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex items-center text-sm text-slate-700">
            <input
              type="checkbox"
              className="mr-2 accent-indigo-600"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
            />
            Show In-Stock Only
          </label>
          <div>
            <h4 className="font-semibold text-slate-700 text-sm mb-1">⭐ Minimum Rating</h4>
            {[4, 3, 2].map((star) => (
              <label key={star} className="flex items-center text-sm mb-1">
                <input
                  type="checkbox"
                  checked={ratingFilter === star}
                  onChange={() => setRatingFilter(ratingFilter === star ? 0 : star)}
                  className="mr-2 accent-yellow-400"
                />
                {[...Array(star)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                <span className="ml-2 text-slate-500">& Up</span>
              </label>
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 text-slate-700">💸 Price Range</h4>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-indigo-500"
            />
            <div className="text-xs text-slate-600 flex justify-between mt-1">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:w-3/4 w-full px-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">🛍️ Explore Products</h2>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="bg-rose-500 text-white text-sm px-4 py-2 rounded hover:bg-rose-600 transition"
          >
            {showFavorites ? '🔙 Back to Products' : `❤️ View Favorites (${favoriteIds.length})`}
          </button>
        </div>

        {/* Category Filter */}
        <div className="sticky top-0 bg-slate-50 z-20 py-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-slate-200">
          <div className="flex space-x-3 px-1 sm:px-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm border transition ${activeCategory === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              All
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm capitalize border transition ${activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Product View */}
        {selectedProduct && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-10">
            <div className="flex flex-col md:flex-row gap-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full md:w-1/2 h-64 object-cover rounded-xl" />
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">{selectedProduct.name}</h3>
                <p className="text-slate-600">{selectedProduct.description}</p>
                <p className="text-emerald-600 text-xl font-bold">₹{selectedProduct.discountPrice ?? selectedProduct.price}</p>
                {selectedProduct.discountPrice && (
                  <p className="text-sm text-slate-400 line-through">₹{selectedProduct.price}</p>
                )}
                <p className="text-sm text-slate-500">⭐ {selectedProduct.rating ?? 'N/A'}</p>
                <p className={`text-sm ${selectedProduct.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedProduct.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                </p>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="mt-4 inline-block text-indigo-600 hover:underline"
                >
                  🔙 Back to products
                </button>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <>
                <h4 className="mt-10 mb-4 font-semibold text-lg text-slate-700">Related Products</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedProducts.map(product => (
                    <div
                      key={product._id}
                      className="bg-slate-50 p-4 border rounded-lg cursor-pointer hover:shadow"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                      <h5 className="text-sm font-medium text-slate-800 line-clamp-1">{product.name}</h5>
                      <p className="text-xs text-slate-500">₹{product.discountPrice ?? product.price}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Product Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {viewableProducts.length === 0 ? (
            <p className="col-span-full text-center text-slate-500">
              {showFavorites ? 'No favorites yet.' : 'No products found.'}
            </p>
          ) : (
            viewableProducts.map(product => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 border border-slate-200 group relative cursor-pointer"
              >
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 text-right">{product.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      className="text-xl"
                    >
                      {favoriteIds.includes(product._id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-600 font-bold">₹{product.discountPrice ?? product.price}</span>
                    {product.discountPrice && (
                      <span className="line-through text-slate-400">₹{product.price}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {product.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                    </span>
                    <span className="text-slate-500">⭐ {product.rating ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!showFavorites && !selectedProduct && filteredProducts.length > itemsPerPage && (
          <div className="flex justify-center mt-10 space-x-2 text-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded disabled:opacity-40"
            >
              ⬅️ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded disabled:opacity-40"
            >
              Next ➡️
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
