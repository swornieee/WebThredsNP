import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const successId = searchParams.get("success");

  useEffect(() => {
    axios.get("/api/orders")
      .then((r) => setOrders(r.data.reverse()))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    Confirmed: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-yellow-100 text-yellow-700",
    Delivered: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">Track all your Threds NP purchases</p>

      {/* Success Banner */}
      {successId && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 animate-slide-up flex items-start gap-4">
          <div className="text-4xl">🎉</div>
          <div>
            <h3 className="font-semibold text-green-800 text-lg">Order Placed Successfully!</h3>
            <p className="text-green-600 text-sm mt-1">
              Order <strong>#{successId}</strong> has been confirmed. We'll deliver to you within 2–5 business days.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h3 className="font-semibold text-xl mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Your order history will appear here once you make a purchase.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {Array.isArray(orders) && orders.map((order) => (
            <div key={order.id || Math.random()} className="card p-6 animate-fade-in">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <span className={`badge ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-NP", { dateStyle: "long" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-primary-600">NPR {order.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{((order.customer?.payment || "cash") === "cash") ? "Cash on Delivery" : order.customer?.payment}</p>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                {(order.items || []).map((item) => (
                  <div key={item.id || Math.random()} className="flex-shrink-0 flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-medium line-clamp-1 max-w-32">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>👤 {order.customer?.name || order.customer?.firstName || 'N/A'}</span>
                <span>📍 {order.address || 'N/A'}</span>
                <span>📞 {order.customer?.phone || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
