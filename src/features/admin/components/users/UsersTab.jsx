import { Search } from "lucide-react";

import DashboardSection from "../DashboardSection";
import UserCard from "./UserCard";

const UsersTab = ({
  users,
  searchTerm,
  setSearchTerm,
  onView,
  onDelete,
  onTogglePro,
}) => {
  return (
    <DashboardSection
      title="Alumnos"
      subtitle="Administración de usuarios."
    >

      <div className="relative mb-8 max-w-lg">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
          size={18}
        />

        <input
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="pl-12"
          placeholder="Buscar alumno..."
        />

      </div>

      <div className="space-y-4">

        {users.map((user) => (

          <UserCard
            key={user.id}
            user={user}
            onView={onView}
            onDelete={onDelete}
            onTogglePro={onTogglePro}
          />

        ))}

      </div>

    </DashboardSection>
  );
};

export default UsersTab;