import React, { useEffect, useState } from 'react';
import { ChevronDown, Star, Instagram, Twitter, Facebook } from 'lucide-react';
import { DFButton, DFCard, DFContainer } from '../components/ui';

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
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    },
    {
      name: 'Elena Sanchís',
      role: 'Técnica de Movimiento',
      bio: 'Coreógrafa profesional, experta en expresión corporal y técnica femenina. Su visión une la danza clásica con el flujo moderno.',
      career: 'Directora artística con giras mundiales y especialista en perfeccionamiento técnico de alto rendimiento.',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    }
  ];

  return (
    <div className="relative overflow-hidden -mx-4 md:-mx-8 -mt-[64px] md:-mt-[80px]">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center transition-transform duration-300"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80)',
            transform: `translateY(${scrollY * 0.4}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-df-bg/60 to-df-bg z-[-1]" />

        <div className="text-center px-6">
          <h1 className="df-display-xl text-df-primary mb-6 uppercase tracking-tighter shadow-2xl">
            DANCING FLOW
          </h1>
          <p className="df-nav text-df-text-soft mb-12 opacity-90">
            MASTERY & MENTORSHIP
          </p>

          <DFButton
              onClick={() => onTabChange('login')}
              size="xl"
              className="px-16 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
          >
              Comenzar ahora
          </DFButton>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-df-primary opacity-60">
          <span className="df-label !text-[10px]">Descubre el prestigio</span>
          <ChevronDown className="animate-bounce" size={28} />
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-32 bg-df-bg">
        <DFContainer>
          <div className="mb-20">
             <span className="df-label border-l-4 border-df-primary pl-4 mb-4 block text-df-primary">PRESTIGIO & TÉCNICA</span>
             <h2 className="df-display-lg text-df-text uppercase tracking-tight">Conoce a tus mentores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {mentors.map((mentor, idx) => (
              <DFCard key={idx} noPadding className="overflow-hidden group bg-df-surface-1 border-df-border-subtle hover:border-df-primary/30">
                <div className="h-[440px] relative overflow-hidden">
                   <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-df-surface-1 via-transparent to-transparent" />
                   <div className="absolute bottom-10 left-10">
                      <h3 className="df-display text-df-text mb-2">{mentor.name}</h3>
                      <p className="df-label text-df-primary">{mentor.role}</p>
                   </div>
                </div>
                <div className="p-10 space-y-8">
                   <p className="df-body-lg text-df-text italic border-l-2 border-df-primary/40 pl-8 opacity-95">"{mentor.bio}"</p>
                   <p className="df-body text-df-text-muted leading-relaxed">{mentor.career}</p>
                   <div className="flex gap-4">
                      <button className="w-12 h-12 flex items-center justify-center bg-df-surface-3 rounded-xl hover:bg-df-primary hover:text-black transition-all cursor-pointer shadow-lg">
                        <Instagram size={20} />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center bg-df-surface-3 rounded-xl hover:bg-df-primary hover:text-black transition-all cursor-pointer shadow-lg">
                        <Facebook size={20} />
                      </button>
                   </div>
                </div>
              </DFCard>
            ))}
          </div>
        </DFContainer>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-df-surface-1 border-y border-df-border-subtle">
        <DFContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { val: '15+', label: 'Años de Excelencia' },
                { val: '2k+', label: 'Alumnos Graduados' },
                { val: '42', label: 'Premios Internacionales' },
                { val: '12', label: 'Sedes Mundiales' }
            ].map((stat, i) => (
                <div key={i} className="text-center p-10 bg-df-surface-2/50 rounded-3xl border border-df-border-subtle hover:border-df-primary/20 transition-all group">
                    <div className="df-display-lg text-df-primary mb-3 group-hover:scale-110 transition-transform duration-500">{stat.val}</div>
                    <div className="df-label !text-[9px] text-df-text-muted">{stat.label}</div>
                </div>
            ))}
        </DFContainer>
      </section>

      {/* Testimonials */}
      <section className="py-40 bg-df-bg relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-df-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <DFContainer size="md" className="text-center relative">
            <span className="df-label mb-12 block text-df-primary">La voz de la maestría</span>

            <div className="relative min-h-[340px] flex items-center justify-center">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center ${
                            activeTestimonial === i ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                        }`}
                    >
                        <div className="flex text-df-primary mb-8 gap-2">
                            {[...Array(5)].map((_, s) => <Star key={s} size={22} fill="currentColor" />)}
                        </div>
                        <p className="df-display text-df-text mb-10 font-light italic leading-tight">
                            "{t.text}"
                        </p>
                        <p className="df-label text-df-primary tracking-[0.3em]">
                           — {t.name}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-5 mt-16">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${
                            activeTestimonial === i ? 'bg-df-primary w-14 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-df-surface-3 w-5'
                        }`}
                    />
                ))}
            </div>
        </DFContainer>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-gradient-to-t from-df-primary/10 to-transparent border-t border-df-border-subtle text-center">
        <h2 className="df-display-lg text-df-text mb-14 uppercase tracking-tighter">Únete a la Élite</h2>
        <DFButton
            onClick={() => onTabChange('login')}
            size="xl"
            className="px-20 shadow-2xl"
        >
            Inscribirme ahora
        </DFButton>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-df-bg border-t border-df-border-subtle">
        <DFContainer className="flex flex-col md:flex-row justify-between items-center gap-12">
            <span className="df-display text-2xl text-df-primary tracking-tighter">DANCING FLOW</span>
            <div className="flex gap-10">
                <span className="df-label !text-[9px] text-df-text-muted hover:text-df-text transition-colors cursor-pointer">Privacidad</span>
                <span className="df-label !text-[9px] text-df-text-muted hover:text-df-text transition-colors cursor-pointer">Soporte</span>
                <span className="df-label !text-[9px] text-df-text-muted hover:text-df-text transition-colors cursor-pointer">Términos</span>
            </div>
            <p className="df-label !text-[9px] !text-df-text-disabled">© 2024 DANCING FLOW ACADEMY.</p>
        </DFContainer>
      </footer>
    </div>
  );
};

export default HomeView;
