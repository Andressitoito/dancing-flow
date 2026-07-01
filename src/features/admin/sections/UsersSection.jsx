import React from "react";
import {
  DFCard,
  DFSearchInput,
  DFTable,
  DFEmptyState,
  DFBadge,
  DFIconButton,
  DFAvatar
} from "../../../components/ui";
import { Eye, Trash2, ShieldCheck, Shield } from "lucide-react";

const UsersSection = ({
  users,
  search,
  setSearch,
  onView,
  onDelete,
  onTogglePro,
}) => {
  const filtered = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Alumno",
      render: (user) => (
        <div className="flex items-center gap-3">
          <DFAvatar name={user.username} src={user.avatar} size="sm" />
          <div>
            <div className="font-bold text-white">{user.username}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{user.email || 'Sin email'}</div>
          </div>
        </div>
      )
    },
    {
      header: "Estado",
      render: (user) => (
        <DFBadge variant={user.isPro ? "primary" : "secondary"}>
          {user.isPro ? "PRO" : "STANDARD"}
        </DFBadge>
      )
    },
    {
      header: "Nivel",
      accessor: "level",
      render: (user) => (
        <span className="capitalize">{user.Questionnaire?.experienceLevel || 'Pendiente'}</span>
      )
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <DFIconButton
            icon={Eye}
            size="sm"
            variant="secondary"
            onClick={() => onView(user)}
            title="Ver Perfil"
          />
          <DFIconButton
            icon={user.isPro ? ShieldCheck : Shield}
            size="sm"
            variant="secondary"
            onClick={() => onTogglePro(user)}
            title={user.isPro ? "Quitar PRO" : "Hacer PRO"}
          />
          <DFIconButton
            icon={Trash2}
            size="sm"
            variant="danger"
            onClick={() => onDelete(user.id)}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <DFCard padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sora font-bold text-white uppercase italic tracking-tight">Alumnos Registrados</h3>
          <p className="df-label !text-[10px] !text-zinc-500 !tracking-widest">{filtered.length} usuarios encontrados</p>
        </div>
        <DFSearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar alumno..."
          className="w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <DFEmptyState
          title="No se encontraron alumnos"
          description={search ? `No hay resultados para "${search}"` : "Aún no hay alumnos registrados en la plataforma."}
        />
      ) : (
        <DFTable
          columns={columns}
          data={filtered}
        />
      )}
    </DFCard>
  );
};

export default UsersSection;
