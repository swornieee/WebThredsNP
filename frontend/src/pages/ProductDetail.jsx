import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="font-display text-3xl font-bold mb-4">Product Not Found</h2>
      <Link to="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  );

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/shop" className="text-primary-500 hover:underline text-sm mb-8 block">← Back to Shop</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl object-cover aspect-square shadow-lg"
          />
          {discount > 0 && (
            <span className="absolute top-5 left-5 badge bg-red-500 text-white text-sm">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-primary-100 text-primary-700">{product.origin}</span>
              <span className="badge bg-gray-100 text-gray-600">{product.category}</span>
              <span className="badge bg-blue-100 text-blue-700">{product.brand}</span>
            </div>
            <h1 className="font-display text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold text-primary-600">
              NPR {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-gray-400 line-through pb-1">
                NPR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stock</span>
              <span className={`font-medium ${product.stock <= 5 ? "text-orange-500" : "text-green-500"}`}>
                {product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} available`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Imported From</span>
              <span className="font-medium">🌍 {product.origin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Brand</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{product.category}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="badge bg-primary-50 text-primary-600 border border-primary-200">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => addToCart(product.id)}
              className="flex-1 btn-primary py-4 text-base"
            >
              🛒 Add to Cart
            </button>
            <Link to="/cart" className="btn-outline py-4 px-6">
              View Cart
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[["✈️", "Imported"], ["🔄", "7-day return"], ["🚚", "2–5 day delivery"]].map(([icon, txt]) => (
              <div key={txt} className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-xs text-gray-500">{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
