import DFSection from "./DFSection";

const DFPage = ({
  children,
}) => {

  return (

    <DFSection spacing="md">

      <div className="space-y-8">

        {children}

      </div>

    </DFSection>

  );

};

export default DFPage;