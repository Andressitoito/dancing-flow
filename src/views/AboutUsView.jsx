import React from 'react';
import { Instagram, Twitter, Facebook, Award, Star, Heart } from 'lucide-react';
import { DFContainer, DFCard } from '../components/ui';

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
    <DFContainer className="py-20 space-y-40">
      <header className="text-center space-y-6">
        <span className="df-label text-df-primary">Nuestra Trayectoria</span>
        <h1 className="df-display-xl text-df-text uppercase tracking-tighter">
          QUIENES <span className="text-df-primary shadow-2xl">SOMOS</span>
        </h1>
        <div className="h-1.5 w-24 bg-df-primary mx-auto rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
      </header>

      {teachers.map((teacher, idx) => (
        <section key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-32 items-center`}>
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-6 bg-df-primary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
            <DFCard noPadding className="relative aspect-[4/5] overflow-hidden bg-df-surface-1 border-df-border-subtle shadow-2xl">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover transition-all duration-1000 scale-[1.05] group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-df-surface-1 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-12 left-12">
                <p className="df-label text-df-primary mb-3">{teacher.role}</p>
                <h2 className="df-display text-df-text uppercase tracking-tight">{teacher.name}</h2>
              </div>
            </DFCard>
          </div>

          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-8">
              <div className="flex gap-2 text-df-primary">
                 {[...Array(5)].map((_, i) => <Star key={i} size={22} fill="currentColor" />)}
              </div>
              <p className="df-display text-3xl text-df-text font-light leading-snug italic opacity-95">
                "{teacher.bio}"
              </p>
            </div>

            <div className="space-y-8">
               <h3 className="df-label flex items-center gap-4 text-df-primary tracking-widest">
                 <Award size={20} /> TRAYECTORIA & LOGROS
               </h3>
               <ul className="space-y-5">
                 {teacher.career.map((item, i) => (
                   <li key={i} className="flex items-start gap-5 text-df-text-soft group">
                      <div className="mt-2.5 w-2 h-2 rounded-full border border-df-primary/40 group-hover:bg-df-primary group-hover:shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all" />
                      <span className="df-body-lg group-hover:text-df-text transition-colors">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex gap-6 pt-4">
              {teacher.socials.instagram && (
                <a href={teacher.socials.instagram} className="w-14 h-14 flex items-center justify-center bg-df-surface-2 border border-df-border-subtle text-df-text-muted hover:text-df-primary hover:border-df-primary/40 transition-all rounded-2xl shadow-lg">
                  <Instagram size={24} />
                </a>
              )}
              {teacher.socials.twitter && (
                <a href={teacher.socials.twitter} className="w-14 h-14 flex items-center justify-center bg-df-surface-2 border border-df-border-subtle text-df-text-muted hover:text-df-primary hover:border-df-primary/40 transition-all rounded-2xl shadow-lg">
                  <Twitter size={24} />
                </a>
              )}
              {teacher.socials.facebook && (
                <a href={teacher.socials.facebook} className="w-14 h-14 flex items-center justify-center bg-df-surface-2 border border-df-border-subtle text-df-text-muted hover:text-df-primary hover:border-df-primary/40 transition-all rounded-2xl shadow-lg">
                  <Facebook size={24} />
                </a>
              )}
            </div>
          </div>
        </section>
      ))}

      <footer className="text-center py-32 border-t border-df-border-subtle">
         <Heart size={48} className="mx-auto text-df-primary/10 mb-10" />
         <h3 className="df-label text-df-text-disabled tracking-[0.4em]">Nuestra Pasión es tu Progreso</h3>
      </footer>
    </DFContainer>
  );
};

export default AboutUsView;
