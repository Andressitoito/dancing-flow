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
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80',
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
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80',
    }
  ];

  return (
    <div className="relative text-white overflow-hidden -mx-4 md:-mx-8 -mt-[56px] bg-black">
      {/* Background Parallax Layer */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: scrollY < 600 ? 'url(/assets/backgrounds/bg-account.jpg)' : 'url(/assets/backgrounds/bg-videos.jpg)',
          transform: `scale(${1.1 + (scrollY * 0.0001)})`,
          filter: 'brightness(0.2)'
        }}
      />
      <div className="fixed inset-0 z-[-1] bg-black/40" />

      <header className="section-padding text-center relative z-10">
        <span className="label-luxury !text-[10px] mb-4 block">Nuestra Historia</span>
        <h1 className="font-sora text-5xl md:text-8xl font-extrabold text-white italic uppercase tracking-tighter leading-none">
          QUIENES <span className="text-primary">SOMOS</span>
        </h1>
        <div className="h-0.5 w-16 bg-primary mx-auto mt-6" />
      </header>

      <main className="max-container px-4 md:px-8 space-y-32 pb-32 relative z-10 bg-black/60 backdrop-blur-sm">
        {teachers.map((teacher, idx) => (
          <section key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute -inset-2 bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-lg" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg glass-card border-white/5 bg-white/[0.02]">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6">
                  <p className="label-luxury !text-primary !text-[8px] mb-1">{teacher.role}</p>
                  <h2 className="font-sora text-3xl md:text-4xl font-bold text-white italic tracking-tighter leading-none uppercase">{teacher.name}</h2>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-10">
              <div className="space-y-4">
                <div className="flex text-primary gap-1">
                   {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined !text-[20px]">star</span>)}
                </div>
                <p className="font-sora text-xl md:text-3xl text-white font-light leading-tight italic opacity-90">
                  "{teacher.bio}"
                </p>
              </div>

              <div className="space-y-6">
                 <h3 className="label-luxury flex items-center gap-3 !text-[10px] !text-zinc-500">
                   <span className="material-symbols-outlined !text-[18px]">verified</span> TRAYECTORIA & LOGROS
                 </h3>
                 <ul className="space-y-3">
                   {teacher.career.map((item, i) => (
                     <li key={i} className="flex items-start gap-4 text-zinc-400 group">
                        <div className="mt-2.5 w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                        <span className="font-sora text-base md:text-lg font-medium group-hover:text-white transition-colors">{item}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="flex gap-4 pt-4">
                {['brand_instagram', 'brand_facebook', 'brand_twitter'].map((icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-md border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/30 transition-all">
                    <span className="material-symbols-outlined !text-[20px]">link</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="py-24 border-t border-white/5 text-center bg-white/[0.01]">
         <span className="material-symbols-outlined !text-[48px] text-white/5 mb-6">workspace_premium</span>
         <h3 className="label-luxury !text-[9px] !text-zinc-600">Excelencia en cada paso</h3>
      </footer>
    </div>
  );
};

export default AboutUsView;
