const QuickActions = ({ children }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
};

export default QuickActions;