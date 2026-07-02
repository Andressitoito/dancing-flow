import React from 'react';
import { Instagram, Twitter, Facebook, Award, Star, Heart } from 'lucide-react';
import { DFCard, DFContainer } from '../../components/ui/index';

const AboutUsView = () => {
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
      socials: { instagram: '#', twitter: '#', facebook: '#' }
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
      socials: { instagram: '#', facebook: '#' }
    }
  ];

  return (
    <div className="py-12 pb-32 md:pb-24 max-w-7xl mx-auto px-4 md:px-8 space-y-32">
      <header className="text-center space-y-6">
        <span className="df-label">Nuestra Historia</span>
        <h1 className="font-sora text-4xl md:text-8xl font-extrabold text-white italic uppercase tracking-tighter leading-none">
          QUIENES <span className="text-primary">SOMOS</span>
        </h1>
        <div className="h-1 w-24 bg-primary mx-auto" />
      </header>

      {teachers.map((teacher, idx) => (
        <section key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
            <DFCard padding="none" className="relative aspect-[4/5] overflow-hidden border-none" hover={false}>
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8">
                <p className="df-label !text-primary !text-[10px] mb-2">{teacher.role}</p>
                <h2 className="font-sora text-4xl md:text-5xl font-bold text-white italic tracking-tighter leading-none">{teacher.name}</h2>
              </div>
            </DFCard>
          </div>

          <div className="w-full md:w-1/2 space-y-12">
            <div className="space-y-6">
              <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-primary" fill="currentColor" />)}
              </div>
              <p className="font-sora text-2xl md:text-4xl text-white font-light leading-tight italic opacity-95">
                "{teacher.bio}"
              </p>
            </div>

            <div className="space-y-6">
               <h3 className="df-label flex items-center gap-4">
                 <Award size={18} /> TRAYECTORIA & LOGROS
               </h3>
               <ul className="space-y-4">
                 {teacher.career.map((item, i) => (
                   <li key={i} className="flex items-start gap-4 text-zinc-400 group">
                      <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      <span className="font-sora text-lg md:text-xl font-medium group-hover:text-white transition-colors">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex gap-6 pt-4">
              {teacher.socials.instagram && (
                <a href={teacher.socials.instagram} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-primary/20 text-zinc-400 hover:text-primary transition-all">
                  <Instagram size={24} />
                </a>
              )}
              {teacher.socials.twitter && (
                <a href={teacher.socials.twitter} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-primary/20 text-zinc-400 hover:text-primary transition-all">
                  <Twitter size={24} />
                </a>
              )}
              {teacher.socials.facebook && (
                <a href={teacher.socials.facebook} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-primary/20 text-zinc-400 hover:text-primary transition-all">
                  <Facebook size={24} />
                </a>
              )}
            </div>
          </div>
        </section>
      ))}

      <footer className="text-center py-24 border-t border-primary/10">
         <Heart size={48} className="mx-auto text-primary/10 mb-8" />
         <h3 className="df-label !text-zinc-600">Nuestra Pasión es tu Progreso</h3>
      </footer>
    </div>
  );
};

export default AboutUsView;
