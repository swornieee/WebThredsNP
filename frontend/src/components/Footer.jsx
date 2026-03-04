import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">T</span>
              </div>
              <span className="font-display font-bold text-xl">
                Threds <span className="text-primary-400">NP</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Bringing the world's finest fashion to Nepal. Curated imports from Japan, Korea, Europe, and beyond — delivered right to your door.
            </p>
            <div className="flex gap-4 mt-6">
              {["Facebook", "Instagram", "Twitter"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 bg-white/10 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors text-xs font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[["Home", "/"], ["Shop", "/shop"], ["About", "/about"], ["Orders", "/orders"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 Thamel, Kathmandu, Nepal</li>
              <li>📞 +977 9800000000</li>
              <li>✉️ hello@thredsnp.com</li>
              <li>🕐 Mon–Sat: 10am – 7pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 Threds NP. All rights reserved.</p>
          <p className="text-gray-500 text-sm">🇳🇵 Proudly serving Nepal</p>
        </div>
      </div>
    </footer>
  );
}
