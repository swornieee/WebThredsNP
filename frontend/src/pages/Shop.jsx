import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Men", "Women", "Unisex"];
const SORTS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      if (sort) params.set("sort", sort);
      const res = await axios.get(`/api/products?${params}`);
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Remove this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success("Product removed");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold mb-2">Shop Collection</h1>
        <p className="text-gray-500">Discover premium imported fashion from around the world</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-60">
          <input
            type="text"
            placeholder="Search by name, brand, origin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn-primary py-2 px-5 text-sm whitespace-nowrap">
            Search
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input w-auto min-w-40 cursor-pointer"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {loading ? "Loading..." : `${products.length} products found`}
      </p>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-xl mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onDelete={localStorage.getItem("isAdmin") === "true" ? deleteProduct : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
