import React from "react";

import DFCard from "../../../components/ui/DFCard";

const SegmentationCard = ({
    title,
    count,
    children,
}) => {

    return (

        <DFCard>

            <div className="flex justify-between items-center mb-5">

                <h3 className="font-sora text-lg font-bold">

                    {title}

                </h3>

                <span className="df-badge">

                    {count}

                </span>

            </div>

            {children}

        </DFCard>

    );

};

export default SegmentationCard;