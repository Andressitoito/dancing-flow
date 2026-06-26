import React, { useState, useEffect } from 'react';

const AboutUsView = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teachers = [
    {
      name: 'Marco Rivera',
      role: 'Director & Mentor Principal',
      bio: 'Especialista en Bachata Sensual con más de 15 años de trayectoria internacional. Su enfoque se centra en la excelencia técnica y el flujo artístico.',
      career: [
        'Certificación Internacional de Élite.',
        'Top 3 en certámenes mundiales de Bachata.',
        'Mentor en los congresos más exclusivos de Europa.',
        'Más de 2000 alumnos graduados con éxito.'
      ],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6_ysBWOT-MDQGt4JuNzmaQOtAdifbef1jwo80FK1E3aSSpgKyeE5J41xohcGpKKSFzXNwMxDrrFTDMbnh_tSdE6WXyc2ydK1CfCBOSRoDmDMvrlMBsUr0YGep6O68w8kQHt8wKdbDyMygCHSyEU5SJgUP92l0rCbw1RrYASiHMpI_8PIaEgvq9ZB7oCB6EYelmpCiX9tgBRCUWzMudPgDKR2k7-h9YBf8BaAzssoBSYxPpGx5ALIVRvb_K0MMsLSyW3cUTBUVV9qv',
    },
    {
      name: 'Elena Sanchís',
      role: 'Directora Técnica & Coreógrafa',
      bio: 'Bailarina profesional y experta en expresión corporal. Elena aporta la sofisticación y la fluidez necesaria para alcanzar la maestría.',
      career: [
        'Licenciada en Artes Escénicas de Alto Rendimiento.',
        'Coreógrafa de producciones internacionales.',
        'Especialista en técnica femenina y musicalidad.',
        'Jueza internacional en competiciones de prestigio.'
      ],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtLtQKuESDWYfl8UbwoePbjSXnMdxsEtD0hRsN7tzc3qiOgHqlRwr3IZwFJXidG25iy65TY47Wi6Auyc_HdvVhk5f_G9foylkVuNNmFy-h-n1jLU2P9XVY8pWK4juIhS94ATn0abGRb1JhGf4zwhrPrHP3BMNC832klmPkRUxlRZA_99zmOGTivhw1ip_CqYEO2zEQyfdIM5S2odgkEclfEBrBTJBl2R8n0UUG9WZ41mHVmoGsPioaEzj6omVbTrG3JmQx6Z0s0WD9',
    }
  ];

  return (
    <div className="relative text-on-surface bg-background -mx-4 md:-mx-[64px] -mt-[56px] overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-parallax opacity-20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2Lam6wkZROFBsJ_TuktOow9WknRup6M5X3DKewPh_moxhWOzZmJgIWVOtQLgYInSQdzUwBboeK5Hx1S7cPG3mvLqyPLAnFNubDdTTNuPeAqC9slo1tQJRHBPxpPkg03Kz0inabSW7y8MlZGFrOb76k4C0F1LVCyLsukBUSqN6pIEDMy4bhRttUMzwWggw8vnRRTmoI-0huWxXxSZxun10ljT7uxiaIjRSNPccrfPURmKyASBlvoamtZUeED3IzfUMgElIbBh2req_")' }}></div>
        <div className="relative z-10">
          <span className="label-luxury !text-primary mb-6 block">Nuestra Historia</span>
          <h1 className="text-5xl md:text-8xl italic uppercase tracking-tighter leading-none mb-8">
            QUIENES <span className="text-primary">SOMOS</span>
          </h1>
          <div className="h-1.5 w-24 bg-primary mx-auto"></div>
        </div>
      </section>

      <main className="max-container px-4 md:px-[64px] space-y-32 pb-32 relative z-10">
        {teachers.map((teacher, idx) => (
          <section key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
            <div className="w-full md:w-1/2 group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl glass-card border-none bg-surface">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                  style={{ backgroundImage: `url(${teacher.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10">
                  <p className="label-luxury !text-primary !text-[10px] mb-2">{teacher.role}</p>
                  <h2 className="text-4xl font-bold italic tracking-tighter leading-none uppercase">{teacher.name}</h2>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-12">
              <div className="space-y-6">
                <div className="flex text-primary gap-1">
                   {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined !text-[24px]">star</span>)}
                </div>
                <p className="text-2xl md:text-3xl font-light leading-snug italic text-on-surface-variant">
                  "{teacher.bio}"
                </p>
              </div>

              <div className="space-y-8">
                 <h3 className="label-luxury flex items-center gap-3 !text-[12px] !text-primary">
                   <span className="material-symbols-outlined !text-[20px]">verified</span> TRAYECTORIA & LOGROS
                 </h3>
                 <ul className="space-y-4">
                   {teacher.career.map((item, i) => (
                     <li key={i} className="flex items-start gap-4 group">
                        <div className="mt-3 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                        <span className="text-lg md:text-xl font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{item}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="flex gap-4 pt-4">
                {['brand_instagram', 'link', 'share'].map((icon, i) => (
                  <button key={i} className="w-12 h-12 rounded bg-surface border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all">
                    <span className="material-symbols-outlined !text-[20px]">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="py-24 border-t border-white/5 text-center bg-surface">
         <span className="material-symbols-outlined !text-[48px] text-primary/20 mb-6">workspace_premium</span>
         <h3 className="label-luxury !text-[11px] !text-on-surface-variant">Excelencia en cada paso</h3>
      </footer>
    </div>
  );
};

export default AboutUsView;
