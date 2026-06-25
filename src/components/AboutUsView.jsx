import React from 'react';
import { Instagram, Twitter, Facebook, Award, Star, Heart } from 'lucide-react';

const AboutUsView = () => {
  const teachers = [
    {
      name: 'Andrés',
      role: 'Director Principal',
      bio: 'Especialista en Bachata Sensual con más de 10 años de trayectoria internacional. Enfoque técnico y artístico.',
      career: [
        'Certificación Internacional en Bachata.',
        'Top 3 en certámenes nacionales.',
        'Más de 500 alumnos formados.'
      ],
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop'
    },
    {
      name: 'Elena',
      role: 'Coreógrafa',
      bio: 'Bailarina profesional y experta en estilo femenino. Aporta elegancia y musicalidad.',
      career: [
        'Licenciada en Artes Escénicas.',
        'Coreógrafa de Flow Dance.',
        'Especialista en técnica de mujer.'
      ],
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1887&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-extrabold text-white italic uppercase tracking-tighter">Nosotros</h1>
        <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest">El equipo de Dancing Flow</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher, idx) => (
          <section key={idx} className="card space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={teacher.image} className="w-full h-full object-cover" alt={teacher.name} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white italic">{teacher.name}</h2>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest">{teacher.role}</p>
               </div>
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed italic border-l-2 border-primary/20 pl-4">
              "{teacher.bio}"
            </p>

            <div className="space-y-3">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <Award size={14} /> Trayectoria
               </h3>
               <ul className="grid grid-cols-1 gap-2">
                 {teacher.career.map((item, i) => (
                   <li key={i} className="text-zinc-400 text-xs flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      {item}
                   </li>
                 ))}
               </ul>
            </div>
          </section>
        ))}
      </div>

      <footer className="text-center py-10 opacity-30">
         <h3 className="text-sm font-black italic text-zinc-600 uppercase tracking-[0.4em]">Evolution Through Mentorship</h3>
      </footer>
    </div>
  );
};

export default AboutUsView;
