import React, { useEffect, useState } from 'react';
import { ChevronDown, Star, Instagram, Twitter, Facebook } from 'lucide-react';
import useStore from '../store/useStore';

const HomeView = () => {
  const [scrollY, setScrollY] = useState(0);
  const { users } = useStore();
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      const filtered = users
        .filter(u => u.Questionnaire && u.Questionnaire.testimonial)
        .map(u => ({
          name: u.username,
          text: u.Questionnaire.testimonial,
          stars: u.Questionnaire.testimonialStars || 5
        }));
      setTestimonials(filtered.length > 0 ? filtered : [
        { name: 'Carlos R.', text: 'Increíble metodología. He avanzado más en un mes que en un año de clases grupales.', stars: 5 },
        { name: 'María G.', text: 'El feedback personalizado de Andrés es oro puro. Muy recomendado.', stars: 5 },
        { name: 'Juan P.', text: 'La plataforma es súper intuitiva y me ayuda a ver mis errores claramente.', stars: 5 }
      ]);
    }
  }, [users]);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  const teachers = [
    {
      name: 'Andrés',
      bio: 'Especialista en Bachata Sensual con más de 10 años de trayectoria internacional. Su enfoque se centra en la conexión y la técnica precisa.',
      career: 'Finalista de varios certámenes internacionales y profesor en los congresos más importantes de Europa y Latinoamérica.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    },
    {
      name: 'Elena',
      bio: 'Coreógrafa y bailarina profesional, experta en técnica de mujer y estilo libre. Apasionada por transmitir la esencia del baile.',
      career: 'Directora de su propia compañía de danza con giras mundiales. Especialista en expresión corporal y musicalidad.',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1887&auto=format&fit=crop',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    }
  ];

  return (
    <div className="relative text-white overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center opacity-80"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070&auto=format&fit=crop)',
            transform: `translateY(${scrollY * 0.4}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background z-[-1]" />

        <div className="text-center px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-primary drop-shadow-[0_20px_20px_rgba(0,0,0,0.7)] leading-none">
            DANCING FLOW
          </h1>
          <p className="mt-8 text-2xl md:text-3xl font-light text-white uppercase tracking-[0.4em] drop-shadow-md">
            Mastery & Mentorship
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-primary opacity-60 group cursor-pointer hover:opacity-100 transition-opacity">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black">Conoce a tus mentores</span>
          <ChevronDown className="animate-bounce" size={32} />
        </div>
      </section>

      {/* Teachers Parallax Section */}
      {teachers.map((teacher, idx) => (
        <section key={idx} className="relative min-h-[120vh] flex items-center justify-center md:justify-start px-6 md:px-32 py-32 overflow-hidden">
          <div
            className="absolute inset-0 z-[-1] bg-cover bg-center"
            style={{
                backgroundImage: `url(${teacher.image})`,
                backgroundAttachment: 'fixed',
                opacity: 0.4
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-[-1]" />

          <div className="max-w-3xl bg-surface-glass backdrop-blur-3xl p-12 md:p-16 lg:p-20 rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-left-20 duration-1000">
            <p className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">Mentor Principal</p>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 text-white italic tracking-tighter">{teacher.name}</h2>
            <div className="h-1 w-24 bg-primary mb-12" />
            <p className="text-white leading-relaxed text-2xl md:text-2xl lg:text-3xl mb-12 font-medium italic opacity-90">
              "{teacher.bio}"
            </p>
            <p className="text-zinc-400 leading-relaxed text-lg lg:text-xl mb-12 border-l-2 border-white/10 pl-8">
              {teacher.career}
            </p>
            <div className="flex gap-8">
              <a href={teacher.socials.instagram} className="p-4 bg-white/5 rounded-2xl hover:bg-primary hover:text-background transition-all duration-500 scale-110">
                <Instagram size={32} />
              </a>
              <a href={teacher.socials.twitter} className="p-4 bg-white/5 rounded-2xl hover:bg-primary hover:text-background transition-all duration-500 scale-110">
                <Twitter size={32} />
              </a>
              <a href={teacher.socials.facebook} className="p-4 bg-white/5 rounded-2xl hover:bg-primary hover:text-background transition-all duration-500 scale-110">
                <Facebook size={32} />
              </a>
            </div>
          </div>
        </section>
      ))}

      {/* Testimonials Carousel */}
      <section className="py-24 md:py-32 lg:py-48 bg-background px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
            <p className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6">Comunidad</p>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-24 italic tracking-tight text-white">HISTORIAS <span className="text-primary">FLOW</span></h2>

            <div className="relative min-h-[300px] md:min-h-[350px] flex items-center justify-center">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center px-4 ${
                            activeTestimonial === i ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                        }`}
                    >
                        <div className="flex text-primary mb-10 gap-2">
                            {[...Array(t.stars)].map((_, s) => <Star key={s} size={24} md:size={28} fill="currentColor" />)}
                        </div>
                        <p className="text-2xl md:text-3xl lg:text-4xl italic text-white mb-12 font-light leading-tight max-w-4xl">
                            "{t.text}"
                        </p>
                        <p className="font-black text-primary text-xl md:text-2xl uppercase tracking-[0.3em]">
                           <span className="text-zinc-700 mr-4">—</span> {t.name}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-20">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`h-1 transition-all duration-500 rounded-full ${
                            activeTestimonial === i ? 'bg-primary w-16' : 'bg-zinc-800 w-8 hover:bg-zinc-700'
                        }`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 bg-black border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
            <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black italic text-primary mb-4 tracking-tighter">DANCING FLOW</h2>
                <p className="text-zinc-500 text-sm tracking-[0.4em] uppercase font-bold">Evolution through mentorship</p>
            </div>

            <div className="flex gap-16">
                <div className="flex flex-col items-center gap-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600">Andrés</p>
                    <div className="flex gap-6 text-zinc-400">
                        <Instagram size={24} className="hover:text-primary transition-colors cursor-pointer" />
                        <Twitter size={24} className="hover:text-primary transition-colors cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600">Elena</p>
                    <div className="flex gap-6 text-zinc-400">
                        <Instagram size={24} className="hover:text-primary transition-colors cursor-pointer" />
                        <Facebook size={24} className="hover:text-primary transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>

            <div className="text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-bold">
                © 2026 DANCING FLOW.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
