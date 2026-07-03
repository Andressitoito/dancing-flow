import React, { useEffect, useState } from 'react';
import { ChevronDown, Trophy, Users, Award, Globe } from 'lucide-react';

const HomeView = ({ onTabChange }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg z-0"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo6MkpKhKyTjMAXSbel_6IbQb8AGimkaiy4rTh04azmtybqczvrtb_nEu11xa7JUHA9L153x6tqgkXfwekm6iNToxXKfRoJXnGQNBzI6_2YYB-tpehN9wT_SXW83QgdrqJfCAXhHkGRaJATcYcPvqUmztaUw_m8cvSqz8XFmU0AJO_zA8PWe1eW4tdM09noZC7Z45aiDMqV5fz12Whb33-JjpA4ZYB4XaTSpmTOMj0rYEmf5gv2ZVuP_-aI4UsnxyfZrnizttF0vbb')",
            transform: `translateY(${scrollY * 0.4}px)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="font-sora text-6xl md:text-[100px] italic font-black text-primary neon-glow leading-none mb-2 tracking-tight uppercase">
            DANCING FLOW
          </h1>
          <p className="font-sora text-[10px] md:text-sm tracking-[0.6em] text-on-surface uppercase mb-12">
            MASTERY & MENTORSHIP
          </p>

          <div className="flex flex-col items-center gap-4 mt-16 animate-bounce">
            <p className="font-sora text-[10px] text-primary tracking-widest uppercase">CONOCE A TUS MENTORES</p>
            <ChevronDown className="text-primary" size={32} />
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-24 px-6 md:px-16 bg-background">
        <div className="max-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="font-sora text-[10px] text-primary border-l-2 border-primary pl-3 mb-4 block uppercase tracking-widest">PRESTIGIO & TÉCNICA</span>
              <h2 className="font-sora text-4xl md:text-5xl text-on-surface uppercase italic">Conoce a tus mentores</h2>
              <p className="font-inter text-lg text-on-surface-variant mt-4 leading-relaxed">
                Nuestros instructores no solo enseñan pasos; guían tu evolución artística con décadas de experiencia en escenarios internacionales.
              </p>
            </div>
            <button className="font-sora text-[10px] font-bold text-primary border border-primary/30 px-8 py-3 hover:bg-primary/10 transition-all rounded uppercase tracking-widest">
              Ver todo el staff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Mentor 1 */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-xl h-[500px] glass-card border-none">
              <div
                className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110 bg-cover bg-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6_ysBWOT-MDQGt4JuNzmaQOtAdifbef1jwo80FK1E3aSSpgKyeE5J41xohcGpKKSFzXNwMxDrrFTDMbnh_tSdE6WXyc2ydK1CfCBOSRoDmDMvrlMBsUr0YGep6O68w8kQHt8wKdbDyMygCHSyEU5SJgUP92l0rCbw1RrYASiHMpI_8PIaEgvq9ZB7oCB6EYelmpCiX9tgBRCUWzMudPgDKR2k7-h9YBf8BaAzssoBSYxPpGx5ALIVRvb_K0MMsLSyW3cUTBUVV9qv')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="font-sora text-3xl text-on-surface mb-2 italic">Marco Rivera</h3>
                <p className="font-sora text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Director de Bachata Sensual</p>
              </div>
            </div>

            {/* Mentor 2 */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-xl h-[500px] glass-card border-none">
              <div
                className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110 bg-cover bg-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtLtQKuESDWYfl8UbwoePbjSXnMdxsEtD0hRsN7tzc3qiOgHqlRwr3IZwFJXidG25iy65TY47Wi6Auyc_HdvVhk5f_G9foylkVuNNmFy-h-n1jLU2P9XVY8pWK4juIhS94ATn0abGRb1JhGf4zwhrPrHP3BMNC832klmPkRUxlRZA_99zmOGTivhw1ip_CqYEO2zEQyfdIM5S2odgkEclfEBrBTJBl2R8n0UUG9WZ41mHVmoGsPioaEzj6omVbTrG3JmQx6Z0s0WD9')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="font-sora text-3xl text-on-surface mb-2 italic">Elena Sanchís</h3>
                <p className="font-sora text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Técnica de Movimiento</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 md:px-16 bg-[#030c16]">
        <div className="max-container">
          <div className="mb-16">
            <h2 className="font-sora text-4xl text-on-surface mb-4 italic">Nuestra Trayectoria</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Trophy, value: '15+', label: 'Años de Excelencia', color: 'primary' },
              { icon: Users, value: '2k+', label: 'Alumnos Graduados', color: 'secondary' },
              { icon: Award, value: '42', label: 'Premios Internacionales', color: 'accent' },
              { icon: Globe, value: '12', label: 'Sedes Mundiales', color: 'primary' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-10 rounded-xl border-l-4 border-primary/40 shadow-2xl hover:translate-y-[-8px] transition-all duration-500 group">
                <stat.icon className={`text-primary mb-6 group-hover:scale-110 transition-transform`} size={32} />
                <div className="font-sora text-5xl font-black text-on-surface mb-2 italic tracking-tighter">{stat.value}</div>
                <p className="font-sora text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center min-h-[450px]">
            <div className="p-12 md:p-20">
              <h3 className="font-sora text-3xl md:text-4xl text-primary mb-8 italic font-bold leading-tight">Redefiniendo la disciplina del baile</h3>
              <p className="font-inter text-lg text-on-surface-variant mb-12 leading-relaxed">
                Desde 2008, Dancing Flow ha sido el epicentro del perfeccionamiento técnico. Nuestra metodología combina la libertad de la Bachata Sensual con la estructura rigurosa del entrenamiento profesional, creando bailarines capaces de dominar cualquier escenario.
              </p>

              <div className="flex gap-12">
                {[
                  { year: '2008', text: 'Fundación' },
                  { year: '2015', text: 'Expansión EU' },
                  { year: '2023', text: 'Mastery App', active: true }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className={`font-sora text-sm font-black ${item.active ? 'text-primary' : 'text-on-surface'}`}>{item.year}</span>
                    <div className={`h-0.5 w-12 ${item.active ? 'bg-primary' : 'bg-primary/20'}`}></div>
                    <span className={`font-sora text-[9px] uppercase tracking-widest ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="h-full min-h-[400px] bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Lam6wkZROFBsJ_TuktOow9WknRup6M5X3DKewPh_moxhWOzZmJgIWVOtQLgYInSQdzUwBboeK5Hx1S7cPG3mvLqyPLAnFNubDdTTNuPeAqC9slo1tQJRHBPxpPkg03Kz0inabSW7y8MlZGFrOb76k4C0F1LVCyLsukBUSqN6pIEDMy4bhRttUMzwWggw8vnRRTmoI-0huWxXxSZxun10ljT7uxiaIjRSNPccrfPURmKyASBlvoamtZUeED3IzfUMgElIbBh2req_')" }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
