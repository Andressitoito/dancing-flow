import React, { useEffect, useState } from 'react';
import { ChevronDown, Star, Instagram, Twitter, Facebook } from 'lucide-react';

const HomeView = ({ onTabChange }) => {
  const [scrollY, setScrollY] = useState(0);
  const [testimonials, setTestimonials] = useState([
    { name: 'Marco R.', text: 'Nuestra metodología de mentoría redefine la evolución artística. No solo enseñamos pasos; guiamos la maestría.', stars: 5 },
    { name: 'Elena S.', text: 'El perfeccionamiento técnico requiere disciplina y una visión clara. Aquí lo hacemos posible.', stars: 5 },
    { name: 'Andrés L.', text: 'Dancing Flow es el epicentro de la excelencia en el baile social y profesional.', stars: 5 }
  ]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      } catch (e) {
        console.error("Error fetching testimonials:", e);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  const mentors = [
    {
      name: 'Marco Rivera',
      role: 'Director de Bachata Sensual',
      bio: 'Especialista en técnica de conexión y musicalidad con más de 15 años de trayectoria en los escenarios más prestigiosos de Europa.',
      career: 'Finalista de varios certámenes internacionales y mentor de las nuevas generaciones de bailarines profesionales.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80', // Cinematic placeholder
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    },
    {
      name: 'Elena Sanchís',
      role: 'Técnica de Movimiento',
      bio: 'Coreógrafa profesional, experta en expresión corporal y técnica femenina. Su visión une la danza clásica con el flujo moderno.',
      career: 'Directora artística con giras mundiales y especialista en perfeccionamiento técnico de alto rendimiento.',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80', // Cinematic placeholder
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    }
  ];

  return (
    <div className="relative text-df-text-main overflow-hidden -mx-4 md:-mx-8 -mt-[64px] md:-mt-[80px]">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center transition-transform duration-300"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80)',
            transform: `translateY(${scrollY * 0.4}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-[-1]" />

        <div className="text-center px-4">
          <h1 className="font-sora text-5xl md:text-[100px] lg:text-[120px] font-extrabold italic text-primary neon-gold leading-none uppercase tracking-tighter mb-4">
            DANCING FLOW
          </h1>
          <p className="font-sora text-sm md:text-xl font-bold text-white uppercase tracking-[0.5em] opacity-90">
            MASTERY & MENTORSHIP
          </p>

          <div className="mt-12">
            <button
                onClick={() => onTabChange('login')}
                className="btn-primary px-12 py-4"
            >
                Comenzar ahora
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-primary opacity-60">
          <span className="df-label text-[10px]">Descubre el prestigio</span>
          <ChevronDown className="animate-bounce" size={32} />
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-24 px-4 md:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
             <span className="df-label border-l-2 border-primary pl-4 mb-4 block">PRESTIGIO & TÉCNICA</span>
             <h2 className="font-sora text-4xl md:text-6xl text-white font-bold italic tracking-tight">Conoce a tus mentores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="glass-card overflow-hidden group">
                <div className="h-[400px] relative overflow-hidden">
                   <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                   <div className="absolute bottom-8 left-8">
                      <h3 className="text-3xl font-sora font-bold text-white mb-1">{mentor.name}</h3>
                      <p className="df-label text-primary">{mentor.role}</p>
                   </div>
                </div>
                <div className="p-8">
                   <p className="text-xl text-white italic mb-6 opacity-90">"{mentor.bio}"</p>
                   <p className="text-zinc-400 border-l-2 border-primary/30 pl-6 mb-8">{mentor.career}</p>
                   <div className="flex gap-4">
                      <button className="p-3 bg-white/5 rounded hover:bg-primary hover:text-black transition-all">
                        <Instagram size={20} />
                      </button>
                      <button className="p-3 bg-white/5 rounded hover:bg-primary hover:text-black transition-all">
                        <Twitter size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 md:px-12 bg-black border-y border-primary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { val: '15+', label: 'Años de Excelencia' },
                { val: '2k+', label: 'Alumnos Graduados' },
                { val: '42', label: 'Premios Internacionales' },
                { val: '12', label: 'Sedes Mundiales' }
            ].map((stat, i) => (
                <div key={i} className="text-center p-8 glass-card border-none hover:bg-white/5">
                    <div className="font-sora text-4xl md:text-6xl font-bold text-primary mb-2 italic">{stat.val}</div>
                    <div className="df-label !text-[9px]">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black relative">
        <div className="max-w-4xl mx-auto text-center px-4">
            <span className="df-label mb-8 block">La voz de la maestría</span>

            <div className="relative min-h-[300px] flex items-center justify-center">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center justify-center ${
                            activeTestimonial === i ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    >
                        <div className="flex text-primary mb-6 gap-1">
                            {[...Array(5)].map((_, s) => <Star key={s} size={24} fill="currentColor" />)}
                        </div>
                        <p className="font-sora text-2xl md:text-4xl italic text-white mb-8 font-light leading-snug">
                            "{t.text}"
                        </p>
                        <p className="df-label !text-primary">
                           — {t.name}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-12">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                            activeTestimonial === i ? 'bg-primary w-12' : 'bg-zinc-800 w-4'
                        }`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-t from-primary/10 to-transparent border-t border-primary/5 text-center">
        <h2 className="font-sora text-4xl md:text-7xl font-bold text-white mb-12 italic uppercase tracking-tighter">Únete a la Élite</h2>
        <button
            onClick={() => onTabChange('login')}
            className="btn-primary px-16 py-5 text-xl"
        >
            Inscribirme ahora
        </button>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-primary/10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="font-sora text-xl font-extrabold italic text-primary tracking-tighter">DANCING FLOW</span>
            <div className="flex gap-8">
                <span className="df-label !text-[9px]">Privacidad</span>
                <span className="df-label !text-[9px]">Soporte</span>
                <span className="df-label !text-[9px]">Términos</span>
            </div>
            <p className="df-label !text-[9px] !text-zinc-600">© 2024 DANCING FLOW ACADEMY.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
