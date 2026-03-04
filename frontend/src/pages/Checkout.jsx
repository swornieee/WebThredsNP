import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Kathmandu",
    payment: "cash",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post("/api/orders", {
        customer: form,
        items: cart,
        total: cartTotal,
        address: `${form.address}, ${form.city}`,
      });
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate(`/orders?success=${res.data.id}`);
    } catch (e) {
      toast.error("Failed to place order. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-xl mb-5">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Ram Bahadur" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="ram@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+977 98XXXXXXXX" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-xl mb-5">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input name="address" value={form.address} onChange={handleChange} className="input" placeholder="Thamel, Ward No. 26" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select name="city" value={form.city} onChange={handleChange} className="input cursor-pointer">
                  {["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Birgunj", "Butwal", "Dharan"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-xl mb-5">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: "cash", label: "Cash on Delivery", icon: "💵" },
                { value: "esewa", label: "eSewa", icon: "🟢" },
                { value: "khalti", label: "Khalti", icon: "🟣" },
                { value: "card", label: "Credit/Debit Card", icon: "💳" },
              ].map((pm) => (
                <label key={pm.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment === pm.value ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={form.payment === pm.value}
                    onChange={handleChange}
                    className="text-primary-500"
                  />
                  <span className="text-xl">{pm.icon}</span>
                  <span className="font-medium">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-xl mb-5">Your Order</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">No items in cart</p>
            ) : (
              <div className="space-y-4 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-semibold text-primary-600 text-sm">NPR {(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>NPR {cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="text-green-500">Free</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">NPR {cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || cart.length === 0}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing Order..." : "Place Order 🎉"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              By placing your order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
