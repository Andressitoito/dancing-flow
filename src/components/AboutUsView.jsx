import React from 'react';
import { Instagram, Twitter, Facebook, Award, Star, Heart } from 'lucide-react';

const AboutUsView = () => {
  const teachers = [
    {
      name: 'Andrés',
      role: 'Director & Profesor Principal',
      bio: 'Especialista en Bachata Sensual con más de 10 años de trayectoria internacional. Su enfoque se centra en la conexión y la técnica precisa, buscando siempre que el alumno entienda el "por qué" de cada movimiento.',
      career: [
        'Certificación Internacional en Bachata Sensual.',
        'Top 3 en certámenes nacionales de Bachata.',
        'Ponente en congresos europeos y latinoamericanos.',
        'Más de 500 alumnos formados presencialmente.'
      ],
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop',
      socials: { instagram: '#', twitter: '#', facebook: '#' }
    },
    {
      name: 'Elena',
      role: 'Co-Directora & Coreógrafa',
      bio: 'Bailarina profesional y experta en estilo femenino. Elena aporta la elegancia y la musicalidad, ayudando a los alumnos a encontrar su propio estilo y fluidez en la pista.',
      career: [
        'Licenciada en Artes Escénicas.',
        'Coreógrafa de la compañía Flow Dance.',
        'Especialista en técnica de mujer y expresión corporal.',
        'Jueza en competiciones regionales.'
      ],
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1887&auto=format&fit=crop',
      socials: { instagram: '#', facebook: '#' }
    }
  ];

  return (
    <div className="py-10 pb-32 md:pb-20 max-w-7xl mx-auto px-4 md:px-0 space-y-24 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
          QUIENES <span className="text-primary">SOMOS</span>
        </h1>
        <p className="text-zinc-500 text-xl font-medium tracking-widest uppercase">El equipo detrás de Dancing Flow</p>
      </header>

      {teachers.map((teacher, idx) => (
        <section key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <p className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2">{teacher.role}</p>
                <h2 className="text-5xl font-black text-white italic tracking-tighter">{teacher.name}</h2>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-primary" fill="currentColor" />)}
              </div>
              <p className="text-2xl text-white font-medium leading-relaxed italic">
                "{teacher.bio}"
              </p>
            </div>

            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                 <Award size={14} /> Trayectoria & Logros
               </h3>
               <ul className="space-y-3">
                 {teacher.career.map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-zinc-400 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      <span className="text-lg">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex gap-6 pt-4">
              {teacher.socials.instagram && (
                <a href={teacher.socials.instagram} className="p-4 bg-surface-glass border border-white/5 rounded-2xl text-zinc-400 hover:text-primary hover:border-primary transition-all shadow-xl">
                  <Instagram size={24} />
                </a>
              )}
              {teacher.socials.twitter && (
                <a href={teacher.socials.twitter} className="p-4 bg-surface-glass border border-white/5 rounded-2xl text-zinc-400 hover:text-primary hover:border-primary transition-all shadow-xl">
                  <Twitter size={24} />
                </a>
              )}
              {teacher.socials.facebook && (
                <a href={teacher.socials.facebook} className="p-4 bg-surface-glass border border-white/5 rounded-2xl text-zinc-400 hover:text-primary hover:border-primary transition-all shadow-xl">
                  <Facebook size={24} />
                </a>
              )}
            </div>
          </div>
        </section>
      ))}

      <footer className="text-center py-20 border-t border-white/5">
         <Heart size={48} className="mx-auto text-primary/20 mb-8" />
         <h3 className="text-2xl font-black italic text-zinc-500 uppercase tracking-widest">Nuestra Pasión es tu Progreso</h3>
      </footer>
    </div>
  );
};

export default AboutUsView;
