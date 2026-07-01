import React from "react";

import { QUESTIONNAIRE_OPTIONS } from "../../../services/constants";

import SegmentationCard from "../components/SegmentationCard";

const SegmentationSection = ({
    users,
    onView,
}) => {

    return (

        <div className="grid lg:grid-cols-2 gap-6">

            {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {

                const list = users.filter(

                    u =>
                        u.Questionnaire?.recordingPreference ===
                        pref.id

                );

                return (

                    <SegmentationCard

                        key={pref.id}

                        title={pref.label}

                        count={list.length}

                    >

                        <div className="space-y-2">

                            {list.map(user => (

                                <button

                                    key={user.id}

                                    onClick={() =>
                                        onView(user)
                                    }

                                    className="
                                        block
                                        w-full
                                        text-left
                                        py-2
                                        hover:text-primary
                                        transition
                                    "

                                >

                                    {user.username}

                                </button>

                            ))}

                        </div>

                    </SegmentationCard>

                );

            })}

        </div>

    );

};

export default SegmentationSection;