import { Eye, Trash2 } from "lucide-react";
import { DFCard, DFButton, DFBadge } from "../../../../components/ui";

const UserCard = ({
  user,
  onView,
  onDelete,
  onTogglePro,
}) => {
  return (
    <DFCard className="flex items-center justify-between">

      <div className="flex items-center gap-5">

        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div>

          <div className="flex items-center gap-3">

            <h3 className="df-heading-3">
              {user.username}
            </h3>

            {user.isPro && (
              <DFBadge>
                PRO
              </DFBadge>
            )}

          </div>

          <p className="df-body-sm mt-1">
            {user.level || "Sin nivel"} · {user.role}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        {user.role === "alumno" && (
          <DFButton
            variant={user.isPro ? "primary" : "secondary"}
            size="sm"
            onClick={() => onTogglePro(user)}
          >
            {user.isPro ? "PRO" : "Activar PRO"}
          </DFButton>
        )}

        <DFButton
          variant="ghost"
          size="sm"
          onClick={() => onView(user)}
        >
          <Eye size={18} />
        </DFButton>

        <DFButton
          variant="danger"
          size="sm"
          onClick={() => onDelete(user.id)}
        >
          <Trash2 size={18} />
        </DFButton>

      </div>

    </DFCard>
  );
};

export default UserCard;