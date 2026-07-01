const StatsGrid = ({ children }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
};

export default StatsGrid;