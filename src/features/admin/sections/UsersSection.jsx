import React from "react";
import {
  DFCard,
  DFInput,
  DFTable,
  DFEmptyState,
  DFBadge,
  DFIconButton,
  DFAvatar
} from "../../../components/ui";
import { Eye, Trash2, ShieldCheck, Shield, Search } from "lucide-react";

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

  return (
    <DFCard noPadding className="overflow-hidden">
      <div className="p-6 border-b border-df-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="df-title text-df-primary uppercase italic mb-1">Directorio de Alumnos</h3>
          <p className="df-label text-df-text-muted">{filtered.length} usuarios encontrados</p>
        </div>
        <DFInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar alumno..."
          leftIcon={Search}
          className="w-full sm:w-80"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12">
          <DFEmptyState
            title="Sin resultados"
            description={search ? `No hay coincidencias para "${search}"` : "La academia aún no tiene alumnos registrados."}
          />
        </div>
      ) : (
        <DFTable
          headers={["Alumno", "Estado", "Nivel", "Acciones"]}
        >
          {filtered.map((user) => (
            <tr key={user.id} className="hover:bg-df-primary/5">
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <DFAvatar name={user.username} src={user.avatar} size="sm" />
                  <div>
                    <div className="font-bold text-df-text">{user.username}</div>
                    <div className="df-caption">{user.email || 'Sin email'}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <DFBadge variant={user.isPro ? "primary" : "secondary"}>
                  {user.isPro ? "PRO" : "STANDARD"}
                </DFBadge>
              </td>
              <td className="py-4 px-6">
                <span className="df-body-sm capitalize">{user.Questionnaire?.experienceLevel || 'Pendiente'}</span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <DFIconButton
                    icon={Eye}
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(user)}
                    title="Ver Perfil"
                  />
                  <DFIconButton
                    icon={user.isPro ? ShieldCheck : Shield}
                    size="sm"
                    variant="ghost"
                    onClick={() => onTogglePro(user)}
                    title={user.isPro ? "Quitar PRO" : "Hacer PRO"}
                  />
                  <DFIconButton
                    icon={Trash2}
                    size="sm"
                    variant="ghost"
                    className="hover:text-df-danger"
                    onClick={() => onDelete(user.id)}
                    title="Eliminar"
                  />
                </div>
              </td>
            </tr>
          ))}
        </DFTable>
      )}
    </DFCard>
  );
};

export default UsersSection;
