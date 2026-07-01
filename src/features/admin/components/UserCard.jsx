import React from "react";

import {
    Eye,
    Trash2,
} from "lucide-react";

const UserCard = ({
    user,
    onView,
    onDelete,
    onTogglePro,
}) => {

    return (

        <div className="df-list-item">

            <div className="flex items-center gap-5">

                <div className="df-avatar">

                    {user.username[0].toUpperCase()}

                </div>

                <div>

                    <div className="flex items-center gap-3">

                        <h3 className="font-sora text-lg font-bold">

                            {user.username}

                        </h3>

                        {user.isPro && (

                            <span className="df-badge">

                                PRO

                            </span>

                        )}

                    </div>

                    <p className="text-sm text-zinc-500">

                        {user.level || "Sin nivel"} • {user.role}

                    </p>

                </div>

            </div>

            <div className="flex gap-2">

                {user.role === "alumno" && (

                    <button

                        onClick={() => onTogglePro(user)}

                        className="df-btn-secondary"

                    >

                        {user.isPro
                            ? "PRO"
                            : "Activar PRO"}

                    </button>

                )}

                <button

                    onClick={() => onView(user)}

                    className="df-icon-button"

                >

                    <Eye size={18} />

                </button>

                <button

                    onClick={() => onDelete(user.id)}

                    className="df-icon-button danger"

                >

                    <Trash2 size={18} />

                </button>

            </div>

        </div>

    );

};

export default UserCard;