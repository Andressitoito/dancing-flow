import React from "react";
import { QUESTIONNAIRE_OPTIONS } from "../../../services/constants";
import { DFCard, DFBadge, DFAvatar } from "../../../components/ui";

const SegmentationSection = ({
    users,
    onView,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
                const list = users.filter(
                    u => u.Questionnaire?.recordingPreference === pref.id
                );

                return (
                    <DFCard key={pref.id} noPadding className="flex flex-col h-full">
                        <div className="p-4 border-b border-df-border-subtle flex items-center justify-between bg-df-primary/5">
                            <h3 className="df-label text-df-primary">
                                {pref.label}
                            </h3>
                            <DFBadge variant="primary" size="sm">
                                {list.length}
                            </DFBadge>
                        </div>

                        <div className="flex-1 p-3 max-h-[340px] overflow-y-auto custom-scrollbar">
                            {list.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="df-caption italic opacity-50">Sin alumnos segmentados</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {list.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => onView(user)}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-df-primary/10 transition-all group text-left cursor-pointer"
                                        >
                                            <DFAvatar name={user.username} size="xs" />
                                            <span className="df-body-sm text-df-text-soft group-hover:text-df-primary transition-colors">
                                                {user.username}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DFCard>
                );
            })}
        </div>
    );
};

export default SegmentationSection;
