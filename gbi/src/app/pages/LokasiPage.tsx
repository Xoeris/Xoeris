import { motion } from 'motion/react';
import { MapPin, Phone, Mail, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar';

export default function LokasiPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 60%, #1e1b4b 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-5">
            <MapPin size={28} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lokasi & Kontak
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-blue-200 text-lg max-w-xl mx-auto">
            Temukan kami dan jangan ragu untuk menghubungi
          </motion.p>
        </div>
      </section>

      {/* Map + Info */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100" style={{ height: '500px' }}>
                <iframe
                  title="Lokasi GBI Jelambar Timur"
                  src="https://maps.google.com/maps?q=-6.1420697,106.7847186&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://www.google.com/maps/place/Gereja+Bethel+Indonesia+Jelambar+Timur/@-6.1420644,106.7821437,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f6268119b4bb:0xcd6100678bff19ec!8m2!3d-6.1420697!4d106.7847186!16s%2Fg%2F11cltsj54r"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                <MapPin size={16} />
                Buka di Google Maps
                <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* Info cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4"
            >
              {/* Alamat */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Alamat</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Jl. Jelambar Timur No. 123<br />
                      Jakarta Barat 11460<br />
                      DKI Jakarta, Indonesia
                    </p>
                  </div>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Jam Ibadah</h3>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      {[
                        { day: 'Minggu', time: '08:00 – 10:00 WIB', label: 'Ibadah Umum' },
                        { day: 'Rabu', time: '19:00 – 21:00 WIB', label: 'Persekutuan Doa' },
                        { day: 'Sabtu', time: '18:00 – 20:00 WIB', label: 'Ibadah Pemuda' },
                      ].map(s => (
                        <div key={s.day} className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-medium text-gray-800">{s.day}</span>
                            <span className="text-gray-400 text-xs ml-1">— {s.label}</span>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Telepon */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600 text-sm">+62 21 1234 5678</p>
                    <p className="text-gray-400 text-xs mt-1">Senin – Sabtu, 09:00 – 17:00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 text-sm">info@gbi-jelambartimur.org</p>
                    <p className="text-gray-400 text-xs mt-1">Dibalas dalam 1×24 jam</p>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/gbi_jeltim/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Instagram</h3>
                  <p className="text-gray-600 text-sm">@gbi_jeltim</p>
                  <p className="text-pink-500 text-xs mt-1 group-hover:underline">Kunjungi Instagram ↗</p>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-6">Ingin tahu lebih banyak tentang gereja kami?</p>
          <Link to="/tentang" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-blue-800 transition-all">
            Tentang Kami <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-500 py-8 text-center text-sm">
        <p>© 2026 GBI Jelambar Timur. All rights reserved.</p>
      </footer>
    </div>
  );
}
