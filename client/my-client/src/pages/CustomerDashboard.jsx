import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch all products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
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
    setCurrentPage(1); // reset pagination
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-6 py-10 bg-slate-50 min-h-screen font-sans">

      {/* Sidebar Filters */}
      <aside className="lg:w-1/4 w-full mb-10 lg:mb-0">
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

      {/* Product Section */}
      <main className="lg:w-3/4 w-full px-2">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800 tracking-tight">🛍️ Explore Products</h2>

        {/* Sticky Category Filter */}
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

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-slate-500">No products found.</p>
          ) : (
            currentProducts.map(product => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 border border-slate-200 group"
              >
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-600 font-bold">₹{product.discountPrice}</span>
                    <span className="line-through text-slate-400">₹{product.price}</span>
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
        {filteredProducts.length > itemsPerPage && (
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
