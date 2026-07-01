import React from 'react';
import clsx from 'clsx';

const DFTabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={clsx("df-tabs", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "df-tab-button df-tab",
              isActive && "df-tab-active"
            )}
          >
            {Icon && <Icon size={18} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DFTabs;
