import React, { useEffect, useState } from 'react';

const HomeView = ({ onTabChange }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative text-on-surface bg-background -mx-4 md:-mx-[64px] -mt-[56px] overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-parallax z-0 transition-transform duration-500 ease-out"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo6MkpKhKyTjMAXSbel_6IbQb8AGimkaiy4rTh04azmtybqczvrtb_nEu11xa7JUHA9L153x6tqgkXfwekm6iNToxXKfRoJXnGQNBzI6_2YYB-tpehN9wT_SXW83QgdrqJfCAXhHkGRaJATcYcPvqUmztaUw_m8cvSqz8XFmU0AJO_zA8PWe1eW4tdM09noZC7Z45aiDMqV5fz12Whb33-JjpA4ZYB4XaTSpmTOMj0rYEmf5gv2ZVuP_-aI4UsnxyfZrnizttF0vbb')",
            transform: `translateY(${scrollY * 0.4}px)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 md:px-0">
          <h1 className="text-primary italic leading-none mb-2 tracking-tight uppercase" style={{ fontSize: 'clamp(64px, 12vw, 128px)' }}>
            DANCING FLOW
          </h1>
          <p className="label-luxury !text-on-surface !tracking-[0.4em] mb-12">
            MASTERY & MENTORSHIP
          </p>

          <div className="flex flex-col items-center gap-4 mt-10">
            <p className="label-luxury !text-primary !text-[10px]">CONOCE A TUS MENTORES</p>
            <span className="material-symbols-outlined text-primary text-[40px] animate-bounce">expand_more</span>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-24 px-4 md:px-[64px] bg-background">
        <div className="max-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-2xl">
              <span className="label-luxury !text-primary border-l-2 border-primary pl-3 mb-3 block">PRESTIGIO & TÉCNICA</span>
              <h2 className="text-4xl md:text-5xl text-on-surface mb-4">Conoce a tus mentores</h2>
              <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed">
                Nuestros instructores no solo enseñan pasos; guían tu evolución artística con décadas de experiencia en escenarios internacionales.
              </p>
            </div>
            <button className="btn-secondary !py-3 !px-8 hover:!bg-primary/10">
              Ver todo el staff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 group relative overflow-hidden rounded-xl h-[500px] glass-card border-none">
              <div
                className="absolute inset-0 bg-cover bg-center grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6_ysBWOT-MDQGt4JuNzmaQOtAdifbef1jwo80FK1E3aSSpgKyeE5J41xohcGpKKSFzXNwMxDrrFTDMbnh_tSdE6WXyc2ydK1CfCBOSRoDmDMvrlMBsUr0YGep6O68w8kQHt8wKdbDyMygCHSyEU5SJgUP92l0rCbw1RrYASiHMpI_8PIaEgvq9ZB7oCB6EYelmpCiX9tgBRCUWzMudPgDKR2k7-h9YBf8BaAzssoBSYxPpGx5ALIVRvb_K0MMsLSyW3cUTBUVV9qv')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="text-3xl text-on-surface mb-2">Marco Rivera</h3>
                <p className="label-luxury !text-primary">Director de Bachata Sensual</p>
              </div>
            </div>

            <div className="md:col-span-4 group relative overflow-hidden rounded-xl h-[500px] glass-card border-none">
              <div
                className="absolute inset-0 bg-cover bg-center grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtLtQKuESDWYfl8UbwoePbjSXnMdxsEtD0hRsN7tzc3qiOgHqlRwr3IZwFJXidG25iy65TY47Wi6Auyc_HdvVhk5f_G9foylkVuNNmFy-h-n1jLU2P9XVY8pWK4juIhS94ATn0abGRb1JhGf4zwhrPrHP3BMNC832klmPkRUxlRZA_99zmOGTivhw1ip_CqYEO2zEQyfdIM5S2odgkEclfEBrBTJBl2R8n0UUG9WZ41mHVmoGsPioaEzj6omVbTrG3JmQx6Z0s0WD9')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="text-3xl text-on-surface mb-2">Elena Sanchís</h3>
                <p className="label-luxury !text-primary">Técnica de Movimiento</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trayectoria Section */}
      <section className="py-24 px-4 md:px-[64px] bg-surface">
        <div className="max-container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl text-on-surface mb-4">Nuestra Trayectoria</h2>
            <div className="h-1.5 w-32 bg-primary"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { val: '15+', label: 'Años de Excelencia', icon: 'military_tech' },
              { val: '2k+', label: 'Alumnos Graduados', icon: 'groups' },
              { val: '42', label: 'Premios Internacionales', icon: 'workspace_premium' },
              { val: '12', label: 'Sedes Mundiales', icon: 'public' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-10 flex flex-col items-center text-center hover:-translate-y-2">
                <span className="material-symbols-outlined text-primary text-[40px] mb-6">{stat.icon}</span>
                <div className="text-5xl font-bold text-on-surface mb-2 italic">{stat.val}</div>
                <p className="label-luxury !text-on-surface-variant !text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card overflow-hidden grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[500px]">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl text-primary mb-8 italic leading-tight">Redefiniendo la disciplina del baile</h3>
              <p className="text-lg md:text-xl text-on-surface-variant mb-12 font-light leading-relaxed">
                Desde 2008, Dancing Flow ha sido el epicentro del perfeccionamiento técnico. Nuestra metodología combina la libertad de la Bachata Sensual con la estructura rigurosa del entrenamiento profesional.
              </p>

              <div className="flex gap-12">
                {[
                  { year: '2008', label: 'Fundación' },
                  { year: '2015', label: 'Expansión EU' },
                  { year: '2024', label: 'Mastery App', active: true }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className={`text-xl font-bold ${step.active ? 'text-primary' : 'text-on-surface'}`}>{step.year}</span>
                    <div className={`h-1 w-full ${step.active ? 'bg-primary' : 'bg-white/10'}`}></div>
                    <span className={`text-[10px] label-luxury !tracking-wider ${step.active ? '!text-primary' : '!text-on-surface-variant'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="bg-cover bg-center grayscale opacity-60"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Lam6wkZROFBsJ_TuktOow9WknRup6M5X3DKewPh_moxhWOzZmJgIWVOtQLgYInSQdzUwBboeK5Hx1S7cPG3mvLqyPLAnFNubDdTTNuPeAqC9slo1tQJRHBPxpPkg03Kz0inabSW7y8MlZGFrOb76k4C0F1LVCyLsukBUSqN6pIEDMy4bhRttUMzwWggw8vnRRTmoI-0huWxXxSZxun10ljT7uxiaIjRSNPccrfPURmKyASBlvoamtZUeED3IzfUMgElIbBh2req_')" }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="max-container flex flex-col md:flex-row justify-between items-center px-4 md:px-[64px] gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-2xl font-extrabold italic text-primary tracking-tighter">DANCING FLOW</span>
            <p className="text-[10px] label-luxury !text-on-surface-variant">© 2024 Dancing Flow Academy. Precision in every step.</p>
          </div>

          <div className="flex gap-8">
            {['Privacidad', 'Soporte', 'Términos'].map(link => (
              <a key={link} href="#" className="label-luxury !text-[11px] !text-on-surface-variant hover:!text-primary transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* FAB */}
      <button
        onClick={() => onTabChange('login')}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined !text-[32px] font-bold">login</span>
      </button>
    </div>
  );
};

export default HomeView;
