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
                    <DFCard key={pref.id} padding="none" className="flex flex-col">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h3 className="df-label !text-[10px] !tracking-widest text-primary font-bold">
                                {pref.label}
                            </h3>
                            <DFBadge variant="primary" size="sm">
                                {list.length}
                            </DFBadge>
                        </div>

                        <div className="flex-1 p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {list.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="df-label !text-[9px] opacity-30">Sin alumnos</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {list.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => onView(user)}
                                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group text-left cursor-pointer"
                                        >
                                            <DFAvatar name={user.username} size="xs" />
                                            <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
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
