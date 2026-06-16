import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Heart, Star, BookOpen, Users, ArrowRight, UserCircle } from 'lucide-react';
import PublicNavbar from '../components/public/PublicNavbar';
import { publicAnonKey, projectId } from '/utils/supabase/info';
import gbiLogo from '../../imports/pngegg__1_-1.png';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-561004a0`;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: string;
  partnerId: string | null;
  order: number;
  photoUrl: string | null;
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const values = [
  { label: 'Kasih',       desc: 'Mengasihi Tuhan dan sesama dengan tulus dan sepenuh hati',  icon: Heart,    color: 'text-rose-500',    bg: 'bg-rose-50',    border: 'border-rose-100' },
  { label: 'Iman',        desc: 'Bertumbuh dalam pengenalan akan Kristus setiap harinya',     icon: Star,     color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100' },
  { label: 'Pelayanan',   desc: 'Melayani dengan rendah hati dan penuh sukacita',             icon: BookOpen, color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  { label: 'Persekutuan', desc: 'Membangun komunitas yang kuat dan saling mendukung',         icon: Users,    color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
];

const timeline = [
  { year: '1993', desc: 'Gereja berdiri dengan 30 jemaat pertama' },
  { year: '2005', desc: 'Gedung utama diresmikan dan diperluas' },
  { year: '2015', desc: 'Program komsel dan pelayanan pemuda diperluas' },
  { year: '2024', desc: 'Lebih dari 500 jemaat aktif dan 20 kelompok komsel' },
];

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ url, name, size }: { url: string | null; name: string; size: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center flex-shrink-0 ring-[3px] ring-white shadow-lg"
    >
      {url
        ? <img src={url} alt={name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        : <UserCircle size={size * 0.55} className="text-blue-200" />
      }
    </div>
  );
}

// ── Couple display (two people side by side) ──────────────────────────────────
function CoupleDisplay({ a, b, avatarSize = 120 }: { a: TeamMember; b: TeamMember; avatarSize?: number }) {
  return (
    <div className="flex items-end justify-center gap-6 sm:gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar url={a.photoUrl} name={a.name} size={avatarSize} />
        <div>
          <p className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{a.name}</p>
          <p className="text-sm text-blue-600 font-medium mt-1">{a.role}</p>
        </div>
      </div>
      <div className="pb-14 text-gray-200 text-4xl font-thin leading-none select-none">&</div>
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar url={b.photoUrl} name={b.name} size={avatarSize} />
        <div>
          <p className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{b.name}</p>
          <p className="text-sm text-pink-500 font-medium mt-1">{b.role}</p>
        </div>
      </div>
    </div>
  );
}

// ── Single person display ─────────────────────────────────────────────────────
function SingleDisplay({ m, avatarSize = 88 }: { m: TeamMember; avatarSize?: number }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar url={m.photoUrl} name={m.name} size={avatarSize} />
      <div>
        <p className="font-bold text-gray-900 text-sm leading-tight">{m.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
      </div>
    </div>
  );
}

// ── Section wrapper with label ────────────────────────────────────────────────
function TierSection({ label, labelStyle, children }: { label: string; labelStyle: string; children: React.ReactNode }) {
  return (
    <FadeIn>
      <div className="flex flex-col items-center">
        <span className={`inline-flex items-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border mb-12 ${labelStyle}`}>
          {label}
        </span>
        {children}
      </div>
    </FadeIn>
  );
}

export default function TentangPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/team`, { headers: { Authorization: `Bearer ${publicAnonKey}` } })
      .then(r => r.text()).then(t => { try { const d = JSON.parse(t); if (d.success) setTeamMembers(d.members || []); } catch {} })
      .catch(() => {}).finally(() => setTeamLoading(false));
  }, []);

  // Build paired groups per tier
  const byTier = (tier: string) => teamMembers.filter(m => m.tier === tier);

  // Group members into "rows": pairs (couple) or singles
  const buildRows = (members: TeamMember[]) => {
    const seen = new Set<string>();
    const rows: Array<{ type: 'couple'; a: TeamMember; b: TeamMember } | { type: 'single'; m: TeamMember }> = [];
    for (const m of members) {
      if (seen.has(m.id)) continue;
      if (m.partnerId) {
        const partner = members.find(x => x.id === m.partnerId);
        if (partner && !seen.has(partner.id)) {
          rows.push({ type: 'couple', a: m, b: partner });
          seen.add(m.id); seen.add(partner.id);
          continue;
        }
      }
      rows.push({ type: 'single', m });
      seen.add(m.id);
    }
    return rows;
  };

  const gembalaSidang  = byTier('gembala_sidang');
  const penerusGembala = byTier('penerus_gembala');
  const wakilGembala   = byTier('wakil_gembala');
  const pastoral       = byTier('pastoral');
  const koordinator    = byTier('koordinator');
  const hasTeam        = teamMembers.length > 0;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 60%, #1e1b4b 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-white/20 shadow-2xl">
            <img src={gbiLogo} alt="GBI Logo" className="w-full h-full object-cover" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Tentang Kami</motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat komunitas iman GBI Jelambar Timur
          </motion.p>
        </div>
      </section>

      {/* Profil */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div>
                <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4">Profil Gereja</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">Komunitas Iman yang Penuh Kasih & Sukacita</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p><strong className="text-gray-900">GBI Jelambar Timur</strong> adalah komunitas iman yang berdedikasi untuk melayani Tuhan dan sesama. Berdiri sejak lebih dari 30 tahun lalu, kami telah menjadi bagian dari kehidupan ribuan keluarga di Jakarta Barat dan sekitarnya.</p>
                  <p>Kami percaya bahwa setiap orang berharga di mata Tuhan dan memiliki tujuan yang unik. Visi kami adalah menjadi gereja yang hangat, di mana setiap orang dapat bertumbuh dalam iman, membangun hubungan yang bermakna, dan melayani dengan sukacita.</p>
                  <p>Misi kami adalah memberitakan Injil, mendewasakan jemaat, dan menjangkau jiwa-jiwa baru di Jakarta Barat dan seluruh Indonesia.</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {values.map(v => (
                  <div key={v.label} className={`${v.bg} border ${v.border} rounded-2xl p-6`}>
                    <div className={`w-11 h-11 rounded-xl ${v.bg} border ${v.border} flex items-center justify-center mb-4`}>
                      <v.icon size={22} className={v.color} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{v.label}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Sejarah</span>
              <h2 className="text-3xl font-bold text-gray-900">Perjalanan Kami</h2>
            </div>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <FadeIn key={t.year} delay={i * 0.1}>
                  <div className="flex items-start gap-6">
                    <div className="w-16 flex-shrink-0 flex justify-center">
                      <span className="relative z-10 text-xs font-bold text-blue-600 bg-blue-50 border-2 border-blue-200 px-2 py-1 rounded-full">{t.year}</span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1">
                      <p className="text-gray-700 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[{ n: '500+', label: 'Jemaat Aktif' }, { n: '4', label: 'Ibadah Per Minggu' }, { n: '20+', label: 'Kelompok Komsel' }, { n: '30+', label: 'Tahun Melayani' }].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="text-3xl md:text-4xl font-bold">{s.n}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tim Pelayanan ── */}
      <section className="py-24 overflow-hidden" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-6">

          <FadeIn>
            <div className="text-center mb-20">
              <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Tim Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Hamba-Hamba Tuhan</h2>
              <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">Mereka yang dipanggil untuk melayani dan memimpin jemaat GBI Jelambar Timur</p>
            </div>
          </FadeIn>

          {teamLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : !hasTeam ? (
            <div className="text-center text-gray-300 py-12">
              <UserCircle size={52} className="mx-auto mb-3" />
              <p className="text-sm">Data jajaran belum tersedia</p>
            </div>
          ) : (
            <div className="space-y-0">

              {/* 1. Gembala Sidang */}
              {gembalaSidang.length > 0 && (() => {
                const rows = buildRows(gembalaSidang);
                return (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-64 rounded-full bg-yellow-100/40 blur-3xl" />
                    </div>
                    <TierSection label="✦  Gembala Sidang  ✦" labelStyle="bg-yellow-50 border-yellow-300 text-yellow-800">
                      <div className="space-y-12">
                        {rows.map((row, i) => (
                          <FadeIn key={i} delay={i * 0.1}>
                            {row.type === 'couple'
                              ? <CoupleDisplay a={row.a} b={row.b} avatarSize={140} />
                              : <SingleDisplay m={row.m} avatarSize={140} />
                            }
                          </FadeIn>
                        ))}
                      </div>
                    </TierSection>
                    {/* Divider */}
                    <div className="flex items-center gap-4 my-16">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
                    </div>
                  </div>
                );
              })()}

              {/* 2. Penerus Gembala */}
              {penerusGembala.length > 0 && (() => {
                const rows = buildRows(penerusGembala);
                return (
                  <div>
                    <TierSection label="Penerus Gembala Sidang" labelStyle="bg-blue-50 border-blue-200 text-blue-700">
                      <div className="flex flex-wrap justify-center gap-16">
                        {rows.map((row, i) => (
                          <FadeIn key={i} delay={i * 0.1}>
                            {row.type === 'couple'
                              ? <CoupleDisplay a={row.a} b={row.b} avatarSize={112} />
                              : <SingleDisplay m={row.m} avatarSize={112} />
                            }
                          </FadeIn>
                        ))}
                      </div>
                    </TierSection>
                    <div className="flex items-center gap-4 my-16">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
                    </div>
                  </div>
                );
              })()}

              {/* 3. Wakil Gembala */}
              {wakilGembala.length > 0 && (() => {
                const rows = buildRows(wakilGembala);
                return (
                  <div>
                    <TierSection label="Wakil Gembala" labelStyle="bg-indigo-50 border-indigo-200 text-indigo-700">
                      <div className="flex flex-wrap justify-center gap-12">
                        {rows.map((row, i) => (
                          <FadeIn key={i} delay={i * 0.1}>
                            {row.type === 'couple'
                              ? <CoupleDisplay a={row.a} b={row.b} avatarSize={96} />
                              : <SingleDisplay m={row.m} avatarSize={96} />
                            }
                          </FadeIn>
                        ))}
                      </div>
                    </TierSection>
                    <div className="flex items-center gap-4 my-16">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
                    </div>
                  </div>
                );
              })()}

              {/* 4. Pastoral */}
              {pastoral.length > 0 && (() => {
                const rows = buildRows(pastoral);
                return (
                  <div>
                    <TierSection label="Pastoral" labelStyle="bg-emerald-50 border-emerald-200 text-emerald-700">
                      <div className="flex flex-wrap justify-center gap-10">
                        {rows.map((row, i) => (
                          <FadeIn key={i} delay={i * 0.07}>
                            {row.type === 'couple'
                              ? <CoupleDisplay a={row.a} b={row.b} avatarSize={80} />
                              : <SingleDisplay m={row.m} avatarSize={80} />
                            }
                          </FadeIn>
                        ))}
                      </div>
                    </TierSection>
                    {koordinator.length > 0 && (
                      <div className="flex items-center gap-4 my-16">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 5. Koordinator */}
              {koordinator.length > 0 && (
                <TierSection label="Koordinator Pelayanan" labelStyle="bg-gray-100 border-gray-300 text-gray-600">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-10 justify-items-center">
                    {koordinator.map((m, i) => (
                      <FadeIn key={m.id} delay={i * 0.04}>
                        <SingleDisplay m={m} avatarSize={64} />
                      </FadeIn>
                    ))}
                  </div>
                </TierSection>
              )}

            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bergabunglah Bersama Kami</h2>
            <p className="text-gray-500 mb-8">Kami menyambut semua orang untuk hadir dan bertumbuh bersama dalam komunitas iman ini.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/lokasi" className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-blue-800 hover:shadow-lg transition-all">
                Temukan Lokasi Kami <ArrowRight size={18} />
              </Link>
              <Link to="/jemaat" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium px-7 py-3.5 rounded-full hover:bg-gray-50 transition-all">
                Lihat Jadwal Ibadah
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-500 py-8 text-center text-sm">
        <p>© 2026 GBI Jelambar Timur. All rights reserved.</p>
      </footer>
    </div>
  );
}
