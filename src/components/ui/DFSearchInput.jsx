import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

const DFSearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = ""
}) => {
  return (
    <div className={clsx("relative group", className)}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all text-sm"
      />
    </div>
  );
};

export default DFSearchInput;
