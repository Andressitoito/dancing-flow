import React, { useEffect, useState } from 'react';
import { ChevronDown, Star, Instagram, Twitter, Facebook } from 'lucide-react';
import useStore from '../store/useStore';

const HomeView = () => {
  const [scrollY, setScrollY] = useState(0);
  const { users } = useStore();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Filter testimonials from users
    if (users && users.length > 0) {
      const filtered = users
        .filter(u => u.Questionnaire && u.Questionnaire.testimonial)
        .map(u => ({
          name: u.username,
          text: u.Questionnaire.testimonial,
          stars: u.Questionnaire.testimonialStars || 5
        }));
      setTestimonials(filtered);
    }
  }, [users]);

  const teachers = [
    {
      name: 'Andrés',
      bio: 'Especialista en Bachata Sensual con más de 10 años de trayectoria internacional.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    },
    {
      name: 'Elena',
      bio: 'Coreógrafa y bailarina profesional, experta en técnica de mujer y estilo libre.',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1887&auto=format&fit=crop',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    }
  ];

  return (
    <div className="relative text-white overflow-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative bg-black/40">
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center opacity-70"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070&auto=format&fit=crop)',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <h1 className="text-6xl font-black italic tracking-tighter text-primary drop-shadow-2xl text-center px-4">
          DANCING FLOW
        </h1>
        <p className="mt-4 text-xl font-light text-zinc-300 uppercase tracking-widest">Mastery & Mentorship</p>
        <ChevronDown className="absolute bottom-10 animate-bounce text-primary" size={48} />
      </section>

      {/* Teachers Parallax Section */}
      {teachers.map((teacher, idx) => (
        <section key={idx} className="relative h-screen flex items-center px-6">
          <div
            className="absolute inset-0 z-[-1] bg-cover bg-fixed bg-center opacity-30"
            style={{ backgroundImage: `url(${teacher.image})` }}
          />
          <div className="max-w-md bg-surface-glass backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">{teacher.name}</h2>
            <p className="text-zinc-300 leading-relaxed text-lg mb-6">{teacher.bio}</p>
            <div className="flex gap-4">
              <Instagram className="text-primary cursor-pointer" />
              <Twitter className="text-primary cursor-pointer" />
              <Facebook className="text-primary cursor-pointer" />
            </div>
          </div>
        </section>
      ))}

      {/* Testimonials */}
      <section className="py-20 bg-background px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros alumnos</h2>
        <div className="grid gap-6">
          {testimonials.length > 0 ? (
            testimonials.map((t, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-outline">
                <div className="flex text-yellow-500 mb-2">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="italic text-zinc-300 mb-4 text-sm">"{t.text}"</p>
                <p className="font-bold text-primary">— {t.name}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 italic">Próximamente más testimonios...</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-black text-center text-zinc-500 text-xs">
        <p>© 2026 DANCING FLOW. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Instagram size={20} />
          <Twitter size={20} />
          <Facebook size={20} />
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
