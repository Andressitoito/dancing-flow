import { DFCard } from "../../../components/ui";

const DataTable = ({ children }) => {
  return (
    <DFCard className="overflow-hidden">

      <div className="overflow-x-auto">

        {children}

      </div>

    </DFCard>
  );
};

export default DataTable;