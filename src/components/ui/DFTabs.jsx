import React from 'react';
import clsx from 'clsx';

const DFTabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={clsx("flex items-center gap-2 p-1 bg-black/40 border border-white/5 rounded-xl", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-primary text-black shadow-lg"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            {Icon && <Icon size={18} />}
            <span className="df-label !tracking-widest !text-[10px] sm:!text-[12px] uppercase font-bold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DFTabs;
