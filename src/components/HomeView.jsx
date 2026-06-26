import React, { useEffect, useState } from 'react';

const HomeView = ({ onTabChange }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([
    { name: 'Marco R.', text: 'Nuestra metodología de mentoría redefine la evolución artística. No solo enseñamos pasos; guiamos la maestría.', stars: 5 },
    { name: 'Elena S.', text: 'El perfeccionamiento técnico requiere disciplina y una visión clara. Aquí lo hacemos posible.', stars: 5 },
    { name: 'Andrés L.', text: 'Dancing Flow es el epicentro de la excelencia en el baile social y profesional.', stars: 5 }
  ]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/backend-service/users/testimonials');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
      } catch (e) { console.error(e); }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const mentors = [
    {
      name: 'Marco Rivera',
      role: 'Master de Bachata',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Sanchís',
      role: 'Técnica & Estilo',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80',
    }
  ];

  // Determine which background to show based on scroll
  const getBgImage = () => {
    if (scrollY < 800) return '/assets/backgrounds/bg-viewer.jpg';
    if (scrollY < 1800) return '/assets/backgrounds/bg-steps.jpg';
    return '/assets/backgrounds/bg-editor.jpg';
  };

  return (
    <div className="relative text-white overflow-hidden -mx-4 md:-mx-8 -mt-[56px]">
      {/* Background Parallax Layer */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out will-change-transform"
        style={{
          backgroundImage: `url(${getBgImage()})`,
          transform: `scale(${1.1 + (scrollY * 0.0001)})`,
          filter: 'brightness(0.3)'
        }}
      />
      <div className="fixed inset-0 z-[-1] bg-black/60" />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center max-w-5xl">
          <span className="label-luxury !text-[10px] mb-4 block animate-in fade-in slide-in-from-bottom-2 duration-700">Prestigio • Maestría • Disciplina</span>
          <h1 className="font-sora text-5xl md:text-[100px] lg:text-[120px] font-extrabold italic text-primary tracking-tighter leading-[0.9] uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            DANCING FLOW
          </h1>
          <p className="font-sora text-sm md:text-lg font-bold text-white/80 uppercase tracking-[0.6em] mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            The Elite Academy
          </p>

          <button
            onClick={() => onTabChange('login')}
            className="btn-primary !px-12 !h-14 !text-sm group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500"
          >
            <span>Comenzar el Viaje</span>
            <span className="material-symbols-outlined !text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <div className="absolute bottom-10 animate-bounce text-primary/40">
          <span className="material-symbols-outlined !text-[32px]">keyboard_double_arrow_down</span>
        </div>
      </section>

      {/* Content Sections with Black Background for Contrast */}
      <div className="relative bg-black/80 backdrop-blur-sm">
        {/* Mentors Grid */}
        <section className="section-padding px-4 md:px-8 max-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="label-luxury !text-[9px]">Nuestros Guías</span>
              <h2 className="font-sora text-4xl md:text-5xl font-bold italic text-white uppercase tracking-tighter mt-2">La Mesa Maestra</h2>
            </div>
            <p className="font-sora text-zinc-500 max-w-sm text-sm italic">Liderados por los mejores exponentes del mundo para llevar tu baile a un nivel inalcanzable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor, i) => (
              <div key={i} className="group relative h-[500px] overflow-hidden rounded-lg glass-card border-white/5">
                <img src={mentor.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={mentor.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="label-luxury !text-[8px] !text-primary">{mentor.role}</span>
                  <h3 className="font-sora text-3xl font-bold text-white italic uppercase tracking-tighter mt-1">{mentor.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Stats */}
        <section className="py-16 border-y border-white/5 bg-white/[0.02]">
          <div className="max-container grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
            {[
              { val: '15+', label: 'Años de Maestría' },
              { val: '2K+', label: 'Alumnos Activos' },
              { val: '42', label: 'Premios Mundiales' },
              { val: '24/7', label: 'Mentoría Digital' }
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="font-sora text-4xl md:text-5xl font-bold text-primary italic mb-1 group-hover:scale-110 transition-transform">{stat.val}</div>
                <div className="label-luxury !text-[8px] !text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Carrousel */}
        <section className="section-padding bg-black/40 overflow-hidden relative">
          <div className="max-container px-4 text-center relative z-10">
            <span className="label-luxury mb-12 block">Voces del Cambio</span>
            <div className="relative h-48 md:h-64 flex items-center justify-center">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                    activeTestimonial === i ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                  }`}
                >
                  <p className="font-sora text-xl md:text-3xl italic font-light text-white leading-relaxed max-w-3xl">
                    "{t.text}"
                  </p>
                  <p className="label-luxury !text-primary mt-8">
                    — {t.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-0.5 transition-all duration-500 ${
                    activeTestimonial === i ? 'bg-primary w-8' : 'bg-white/10 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-b from-black to-primary/10 text-center border-t border-white/5">
          <h2 className="font-sora text-4xl md:text-7xl font-extrabold italic text-white uppercase tracking-tighter mb-12">¿Estás listo?</h2>
          <button
            onClick={() => onTabChange('login')}
            className="btn-primary !px-16 !h-16 !text-lg shadow-[0_0_50px_rgba(212,175,55,0.1)]"
          >
            Unirme a la Academia
          </button>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 md:px-8 border-t border-white/5 max-container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-sora text-lg font-extrabold italic text-primary tracking-tighter">DANCING FLOW</div>
          <div className="flex gap-6 label-luxury !text-[8px] !text-zinc-600">
            <span className="cursor-pointer hover:text-white transition-colors">Privacidad</span>
            <span className="cursor-pointer hover:text-white transition-colors">Términos</span>
            <span className="cursor-pointer hover:text-white transition-colors">Soporte</span>
          </div>
          <p className="label-luxury !text-[8px] !text-zinc-700">© 2024 DANCING FLOW ACADEMY.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomeView;
