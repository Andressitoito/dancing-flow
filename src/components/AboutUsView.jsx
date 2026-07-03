import React from 'react';
import { ShieldCheck, Target, Heart, Sparkles } from 'lucide-react';

const AboutUsView = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative py-32 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[#051424] opacity-90"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        </div>

        <div className="relative z-10 max-container">
          <span className="font-sora text-[10px] text-primary border-l-2 border-primary pl-3 mb-6 block uppercase tracking-[0.4em] font-bold">NUESTRO ADN</span>
          <h1 className="font-sora text-5xl md:text-7xl italic font-black text-on-surface leading-tight uppercase tracking-tighter mb-8 max-w-4xl">
            La excelencia no es un acto, sino un <span className="text-primary neon-glow">hábito</span>.
          </h1>
          <p className="font-inter text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Dancing Flow Academy nació con una misión clara: elevar el estándar del baile social a través de la disciplina técnica y la conexión emocional.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 md:px-16 bg-background">
        <div className="max-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: 'Disciplina', desc: 'El compromiso con el entrenamiento es la base de todo progreso real.' },
            { icon: Target, title: 'Precisión', desc: 'Buscamos la perfección en cada movimiento, desde lo básico a lo avanzado.' },
            { icon: Heart, title: 'Pasión', desc: 'El baile es alma; sin emoción, la técnica es solo gimnasia.' },
            { icon: Sparkles, title: 'Innovación', desc: 'Constantemente evolucionamos nuestras metodologías para el bailarín moderno.' }
          ].map((val, i) => (
            <div key={i} className="glass-card p-10 rounded-xl hover:border-primary/40 transition-all duration-500 group">
              <val.icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
              <h3 className="font-sora text-xl text-on-surface mb-4 uppercase tracking-widest font-bold italic">{val.title}</h3>
              <p className="font-inter text-on-surface-variant leading-relaxed text-sm">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6 md:px-16 bg-[#030c16]">
        <div className="max-container flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative">
             <div className="aspect-square rounded-2xl overflow-hidden border border-primary/20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0bwlYy9khgvPzUA0nKRcuTuAWlKZco-_NBCp3hqKb8znB7XM47pG4nNHPhuLXh8q24Tk0J1DtL9eKFO_jd-YA5Et4QnwDZOUhLUHg49FYbj2eT5i44CW2CxsieL0SuQTzBqLb1ftLQc_3whZrjr3szRhxnLS4Mj1oBVLpQIc3yVjO8r6n0t11Cui3OqjGBwsXaOKcjppmaUy9x1cBahIFxb2uEdadoYEBYURDpZMKq7Kvx-4X57Z_JhVn5uknwdDjSOqcPtAQF3sF"
                  alt="Metodología"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
             </div>
             <div className="absolute -bottom-10 -right-10 glass-card p-8 rounded-xl hidden md:block max-w-[250px]">
                <p className="font-sora text-primary text-4xl font-black italic mb-2">100%</p>
                <p className="font-sora text-[10px] text-on-surface uppercase tracking-widest font-bold leading-tight">Enfoque en el desarrollo del artista</p>
             </div>
          </div>

          <div className="lg:w-1/2">
            <span className="font-sora text-[10px] text-primary mb-6 block uppercase tracking-[0.4em] font-bold">FILOSOFÍA</span>
            <h2 className="font-sora text-4xl md:text-5xl text-on-surface mb-8 italic uppercase font-black leading-tight">Más que una academia, una <span className="text-primary">mentalidad</span>.</h2>
            <p className="font-inter text-lg text-on-surface-variant mb-8 leading-relaxed">
              En Dancing Flow, no formamos solo "bailadores". Formamos artistas técnicos que comprenden la biomecánica del movimiento y la psicología de la conexión.
            </p>
            <p className="font-inter text-lg text-on-surface-variant mb-12 leading-relaxed">
              Nuestra metodología "Mastery & Mentorship" garantiza un seguimiento personalizado donde cada alumno es un proyecto de excelencia.
            </p>
            <button className="bg-primary text-black font-sora font-bold px-10 py-4 rounded uppercase tracking-widest hover:scale-105 active:scale-95 transition-all active-glow">
              Únete al Movimiento
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsView;
