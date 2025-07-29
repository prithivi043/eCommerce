import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [filterRating, setFilterRating] = useState('');
  const [filterDiscount, setFilterDiscount] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    rating: '', count: '', image: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products', {
        params: {
          page, limit, sortBy, sortOrder,
          priceMin: filterPrice.min,
          priceMax: filterPrice.max,
          ratingMin: filterRating,
          discountMin: filterDiscount
        }
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, sortOrder, filterPrice, filterRating, filterDiscount]);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      rating: '',
      count: '',
      image: ''
    });
    setEditing(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice),
      image: form.image,
      rating: Number(form.rating),
      count: Number(form.count),
      stock: Number(form.count) > 0 ? 1 : 0
    };

    try {
      if (!payload.name || !payload.price || !payload.image || !payload.description) {
        alert("❌ Please fill in all required fields: name, price, image, and description.");
        return;
      }

      const res = await axios.post('http://localhost:5000/api/admin/products', payload);

      alert('✅ Product added successfully!');
      resetForm();
      setFormVisible(false);
      fetchProducts(); // refresh list
    } catch (error) {
      console.error("❌ Error in adding product:", error);

      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Unknown error occurred";

      alert("❌ Failed to add product: " + errMsg);
    }
  };


  const handleEdit = product => {
    setFormVisible(true);
    setEditing(true);
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      rating: product.rating,
      count: product.count,
      image: product.image
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
      fetchProducts();
      alert('Deleted!');
    } catch {
      alert('Delete failed ❌');
    }
  };

  const handleLogout = () => {
    // You can also clear token/localStorage here
    alert('Logged out!');
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-100 p-4 border-r border-gray-300 z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-xl font-bold mb-4">Filters & Sort</h2>
        <button
          onClick={() => { resetForm(); setFormVisible(!formVisible); }}
          className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {formVisible ? 'Close Form' : '+ Add Product'}
        </button>

        {/* Sort */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border rounded p-1">
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="discount">Discount %</option>
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full border rounded p-1 mt-1">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Filters */}
          <div>
            <label className="block font-medium">Price Range</label>
            <div className="flex space-x-2">
              <input type="number" placeholder="Min" value={filterPrice.min} onChange={e => setFilterPrice({ ...filterPrice, min: e.target.value })} className="w-1/2 border rounded p-1" />
              <input type="number" placeholder="Max" value={filterPrice.max} onChange={e => setFilterPrice({ ...filterPrice, max: e.target.value })} className="w-1/2 border rounded p-1" />
            </div>
          </div>
          <div>
            <label className="block font-medium">Min Rating</label>
            <input type="number" step="0.1" max="5" value={filterRating} onChange={e => setFilterRating(e.target.value)} className="w-full border rounded p-1" />
          </div>


          <button
            onClick={() => {
              resetForm();
              setFormVisible(false);
              setFilterPrice({ min: '', max: '' });
              setFilterRating('');
              setFilterDiscount('');
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Reset All
          </button>

          {/* Admin Settings */}
          <Link
            to="/admin/settings"
            className={`block px-4 py-2 rounded bg-amber-800 text-white text-center  hover:bg-amber-700 ${location.pathname === "/admin/settings" ? "bg-gray-200 font-semibold" : ""
              }`}
          >
            ⚙️ Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto p-4 pt-16 md:pt-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {formVisible && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'price', 'discountPrice', 'rating', 'count', 'image'].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === 'price' || field === 'discountPrice' || field === 'rating' || field === 'count' ? 'number' : 'text'}
                value={form[field]}
                onChange={handleChange}
                className="border rounded p-2"
                required
              />
            ))}
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded p-2 col-span-full" required />
            <button type="submit" className="col-span-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
              {editing ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(product => (
            <div key={product._id} className="group relative border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative">
                <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-[250px] object-cover transition duration-300 group-hover:brightness-75" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-4 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                  <h3 className="text-white text-lg font-bold bg-black bg-opacity-40 px-2 rounded">{product.name}</h3>
                  <p className="text-white text-sm mt-1 text-center bg-black bg-opacity-30 px-2 rounded">{product.description}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <div>
                    <span className="font-bold text-green-600">₹{product.discountPrice}</span>
                    <span className="line-through text-gray-400 ml-2">₹{product.price}</span>
                  </div>
                  <div className="text-red-500 font-semibold text-xs">
                    {
                      typeof product.price === 'number' &&
                        typeof product.discountPrice === 'number' &&
                        product.price > 0 &&
                        product.discountPrice < product.price
                        ? `-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`
                        : 'No Discount'
                    }
                  </div>

                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={index < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Stock: <span className="font-semibold text-gray-700">{product.count || 0}</span>
                  </div>
                </div>
                <div className={`text-xs font-semibold ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                  {product.stock === 0 ? "Out of Stock 🔴" : "In Stock 🟢"}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;