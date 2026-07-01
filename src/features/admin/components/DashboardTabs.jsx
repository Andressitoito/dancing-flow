const DashboardTabs = ({ children }) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-black/30 p-2">
      {children}
    </div>
  );
};

export default DashboardTabs;