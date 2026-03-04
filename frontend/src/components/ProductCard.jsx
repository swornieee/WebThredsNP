import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onDelete }) {
  const { addToCart, loading } = useCart();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div className="card group overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white">-{discount}%</span>
          )}
          {product.featured && (
            <span className="badge bg-primary-500 text-white">Featured</span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="badge bg-white/90 text-gray-700 shadow-sm">🌍 {product.origin}</span>
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-800 bg-white rounded-full p-1"
              title="Delete product"
            >
              &times;
            </button>
          )}
        </div>
        {product.stock <= 5 && (
          <div className="absolute bottom-3 left-3">
            <span className="badge bg-orange-500 text-white">Only {product.stock} left!</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-1">{product.name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{product.brand}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400 text-xs">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary-600">
            NPR {product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              NPR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product.id)}
            disabled={loading}
            className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-50"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="px-4 py-2.5 border border-gray-200 rounded-full hover:border-primary-400 transition-colors text-sm text-gray-600 hover:text-primary-600"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
