import { DFCard, DFBadge } from "../../../../components/ui";

const UserList = ({ title, users, color, onView }) => (
  <div>

    <div className="flex items-center justify-between mb-4">

      <span className="label-luxury">
        {title}
      </span>

      <DFBadge>
        {users.length}
      </DFBadge>

    </div>

    <div className="space-y-2">

      {users.slice(0, 6).map((user) => (

        <button
          key={user.id}
          onClick={() => onView(user)}
          className={`w-full text-left rounded-lg px-3 py-2 transition hover:bg-white/5 ${color}`}
        >
          {user.username}
        </button>

      ))}

      {users.length > 6 && (
        <div className="df-body-sm opacity-60 pt-2">
          +{users.length - 6} más
        </div>
      )}

    </div>

  </div>
);

const SegmentCard = ({
  label,
  users,
  onView,
}) => {

  const males = users.filter(
    (u) => u.gender === "male"
  );

  const females = users.filter(
    (u) => u.gender === "female"
  );

  return (

    <DFCard>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h3 className="df-heading-3">
            {label}
          </h3>

          <p className="df-body-sm mt-2">
            Segmentación
          </p>

        </div>

        <DFBadge>

          {users.length}

        </DFBadge>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <UserList
          title="Hombres"
          users={males}
          color="text-blue-300"
          onView={onView}
        />

        <UserList
          title="Mujeres"
          users={females}
          color="text-pink-300"
          onView={onView}
        />

      </div>

    </DFCard>

  );

};

export default SegmentCard;