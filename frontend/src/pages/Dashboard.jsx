import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CATEGORIES = ["Men", "Women", "Unisex"];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    origin: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    stock: "",
    tags: "",
    featured: false,
    image: null,
  });

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm((f) => ({ ...f, image: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        data.append(key, form[key]);
      }
    });

    try {
      await axios.post("/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added");
      setForm({
        name: "",
        brand: "",
        origin: "",
        category: "",
        price: "",
        originalPrice: "",
        description: "",
        stock: "",
        tags: "",
        featured: false,
        image: null,
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add product form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow mb-10 space-y-4">
        <h2 className="text-xl font-semibold">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="input"
            required
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="input"
            required
          />
          <input
            name="origin"
            value={form.origin}
            onChange={handleChange}
            placeholder="Origin"
            className="input"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="input"
            required
          />
          <input
            name="originalPrice"
            type="number"
            value={form.originalPrice}
            onChange={handleChange}
            placeholder="Original price"
            className="input"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="input"
          />
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="input"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="input col-span-1 md:col-span-2"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              id="featured"
            />
            <label htmlFor="featured" className="text-sm">Featured</label>
          </div>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="col-span-1 md:col-span-2"
          />
        </div>
        <button type="submit" className="btn-primary mt-4">Add Product</button>
      </form>

      {/* List of products with delete button */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="border rounded-lg p-4 relative">
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.brand}</p>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
