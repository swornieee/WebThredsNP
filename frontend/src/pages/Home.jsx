import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get("/api/products?featured=true").then((r) => setFeatured(r.data));
    axios.get("/api/stats").then((r) => setStats(r.data));
  }, []);

  const origins = [
    { country: "Japan", flag: "🇯🇵", desc: "Minimalist & precision crafted" },
    { country: "South Korea", flag: "🇰🇷", desc: "Trendy K-fashion styles" },
    { country: "France", flag: "🇫🇷", desc: "Classic Parisian elegance" },
    { country: "USA", flag: "🇺🇸", desc: "Bold American streetwear" },
    { country: "Italy", flag: "🇮🇹", desc: "Luxury Italian tailoring" },
    { country: "UK", flag: "🇬🇧", desc: "Timeless British fashion" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-charcoal via-dark to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl animate-slide-up">
            <span className="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-6 inline-block">
              🌍 Imported Fashion in Nepal
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              World Fashion,{" "}
              <span className="text-primary-400">Nepal Prices.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Curated clothing imported from Japan, Korea, Europe & beyond — delivered to your doorstep in Kathmandu.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary text-base px-8 py-4">
                Explore Collection →
              </Link>
              <Link to="/about" className="btn-outline text-base px-8 py-4 border-white/40 text-white hover:bg-white hover:text-dark">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Products", value: stats.totalProducts || "50+" },
              { label: "Countries", value: `${stats.countries || 10}+` },
              { label: "Orders Delivered", value: stats.totalOrders >= 0 ? stats.totalOrders : "1000+" },
              { label: "Happy Customers", value: "500+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary-400">{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origins Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold mb-3">Where We Import From</h2>
          <p className="text-gray-500 max-w-md mx-auto">We travel the world (digitally) so you don't have to. Each piece is handpicked from top fashion hubs.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {origins.map((o) => (
            <Link
              key={o.country}
              to={`/shop?search=${o.country}`}
              className="card p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer group"
            >
              <div className="text-4xl mb-3 animate-float">{o.flag}</div>
              <p className="font-semibold text-sm text-gray-900">{o.country}</p>
              <p className="text-xs text-gray-400 mt-1 leading-tight">{o.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold mb-2">Featured Picks</h2>
              <p className="text-gray-500">Our most loved imported pieces this season</p>
            </div>
            <Link to="/shop" className="hidden md:block btn-outline text-sm py-2 px-5">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link to="/shop" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold mb-3">Why Choose Threds NP?</h2>
          <p className="text-gray-500">We make international fashion accessible for everyone in Nepal</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "✈️", title: "Direct Imports", desc: "We import directly from manufacturers, cutting middlemen to give you the best prices." },
            { icon: "✅", title: "Quality Guaranteed", desc: "Every item is inspected before it reaches you. No compromises on quality." },
            { icon: "🚚", title: "Fast Delivery", desc: "Doorstep delivery across Nepal within 2–5 working days in major cities." },
            { icon: "🔄", title: "Easy Returns", desc: "Not satisfied? Return within 7 days for a full refund, no questions asked." },
            { icon: "💳", title: "Secure Payments", desc: "Pay with eSewa, Khalti, cards or cash on delivery. 100% secure checkout." },
            { icon: "🤝", title: "Local Support", desc: "Our Kathmandu-based team is always ready to help you in Nepali or English." },
          ].map((f) => (
            <div key={f.title} className="card p-7 hover:-translate-y-1 transition-transform duration-200">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-500 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Elevate Your Style?</h2>
          <p className="text-primary-100 text-lg mb-8">Join thousands of fashion-forward Nepalis who trust Threds NP.</p>
          <Link to="/shop" className="bg-white text-primary-600 font-semibold px-10 py-4 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-block">
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
