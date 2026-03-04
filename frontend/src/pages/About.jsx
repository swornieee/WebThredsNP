import { Link } from "react-router-dom";

export default function About() {
  const team = [
    { name: "Aarav Sharma", role: "Founder & CEO", emoji: "👨‍💼" },
    { name: "Priya Shrestha", role: "Head of Imports", emoji: "👩‍✈️" },
    { name: "Bikash Rai", role: "Marketing Lead", emoji: "👨‍💻" },
    { name: "Sita Karki", role: "Customer Relations", emoji: "👩‍🤝‍👩" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-gray-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            Threds NP was born from a simple frustration — why was it so hard to find quality international fashion in Nepal? We decided to fix that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge bg-primary-100 text-primary-700 mb-4 inline-block">Our Mission</span>
            <h2 className="font-display text-4xl font-bold mb-5">Making World Fashion Accessible to Nepal</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2022 in Kathmandu, Threds NP started as a small operation importing a handful of pieces from Seoul and Tokyo. Today, we curate hundreds of styles from 10+ countries.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe every Nepali deserves access to the same quality and style as fashion capitals of the world — without breaking the bank or waiting months for an online order.
            </p>
            <Link to="/shop" className="btn-primary">Shop Our Collection</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🌍", title: "10+ Countries", desc: "Import origins" },
              { icon: "👕", title: "500+ Items", desc: "In catalog" },
              { icon: "😊", title: "5000+ Customers", desc: "Served across Nepal" },
              { icon: "⭐", title: "4.8/5 Rating", desc: "Average review" },
            ].map((s) => (
              <div key={s.title} className="card p-5 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="font-bold text-xl text-primary-600">{s.title}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">What We Stand For</h2>
            <p className="text-gray-500">Our core values guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "💎", title: "Quality First", desc: "We never compromise on quality. Every item is carefully inspected before it reaches our customers." },
              { icon: "🤝", title: "Fair Pricing", desc: "No import markups of 300%. We pass our savings directly to you, keeping prices honest and transparent." },
              { icon: "🌱", title: "Sustainability", desc: "We prioritize brands with ethical manufacturing practices and are moving toward more sustainable packaging." },
            ].map((v) => (
              <div key={v.title} className="card p-7">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-semibold text-xl mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold mb-3">The Team Behind Threds NP</h2>
          <p className="text-gray-500">A passionate group of fashion lovers from Kathmandu</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-200">
              <div className="text-5xl mb-4">{member.emoji}</div>
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-primary-500 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-display text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-primary-100 mb-8 text-lg">Have questions? We'd love to hear from you.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: "📍", title: "Visit Us", info: "Thamel, Kathmandu" },
              { icon: "📞", title: "Call Us", info: "+977 9800000000" },
              { icon: "✉️", title: "Email Us", info: "hello@thredsnp.com" },
            ].map((c) => (
              <div key={c.title} className="bg-white/10 rounded-2xl p-5">
                <div className="text-3xl mb-2">{c.icon}</div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-primary-100 text-sm mt-1">{c.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
