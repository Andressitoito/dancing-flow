import React, { useEffect, useState } from 'react';
import { ChevronDown, Star, Instagram, Twitter, Facebook } from 'lucide-react';
import { api } from '../services/api';

const HomeView = () => {
  const [scrollY, setScrollY] = useState(0);
  const [testimonials, setTestimonials] = useState([
    { name: 'Carlos R.', text: 'Increíble metodología. He avanzado más en un mes que en un año.', stars: 5 },
    { name: 'María G.', text: 'El feedback personalizado de Andrés es oro puro. Muy recomendado.', stars: 5 }
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
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
      } catch (e) { console.error(e); }
    };
    fetchTestimonials();
  }, []);

  const teachers = [
    {
      name: 'Andrés',
      bio: 'Especialista en Bachata Sensual con más de 10 años de trayectoria.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop'
    },
    {
      name: 'Elena',
      bio: 'Bailarina profesional y experta en estilo femenino. Técnica y elegancia.',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1887&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* SaaS Hero */}
      <section className="relative py-12 md:py-20 flex flex-col items-center justify-center text-center overflow-hidden bg-zinc-950 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-40" />
        <div className="relative z-10 space-y-4 px-6">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">DANCING FLOW</h1>
          <p className="text-zinc-500 text-base md:text-xl uppercase tracking-[0.3em] font-medium">Evolution Through Mentorship</p>
          <div className="flex gap-4 justify-center pt-4">
             <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">Feedback Real-Time</div>
             <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">Seguimiento Pro</div>
          </div>
        </div>
      </section>

      {/* Grid Content: High Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher, idx) => (
          <section key={idx} className="card flex items-center gap-6 group hover:border-primary/20 transition-all">
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-white/10 shadow-lg grayscale group-hover:grayscale-0 transition-all">
                <img src={teacher.image} className="w-full h-full object-cover" alt={teacher.name} />
             </div>
             <div className="flex-1 space-y-2">
                <p className="text-primary font-black uppercase tracking-widest text-[9px]">Mentor de la Academia</p>
                <h2 className="text-xl font-black italic text-white uppercase tracking-tight leading-none">{teacher.name}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{teacher.bio}</p>
             </div>
          </section>
        ))}
      </div>

      {/* Compact Testimonials */}
      <section className="card bg-zinc-950/50 border-dashed space-y-8">
        <div className="text-center">
            <h2 className="text-lg font-bold text-zinc-500 uppercase tracking-widest italic">Historias Flow</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.slice(0, 3).map((t, i) => (
                <div key={i} className="card bg-black/20 p-6 space-y-3 flex flex-col justify-between">
                    <div className="flex text-primary/40 gap-1">
                        {[...Array(5)].map((_, s) => <Star key={s} size={12} fill={s < t.stars ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-sm text-zinc-300 italic leading-relaxed">"{t.text}"</p>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">— {t.name}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Dancing Flow © 2026</span>
          <div className="flex gap-4">
              <Instagram size={16} />
              <Twitter size={16} />
              <Facebook size={16} />
          </div>
      </footer>
    </div>
  );
};

export default HomeView;
