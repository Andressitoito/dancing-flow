import React from "react";
import { DFCard, DFBadge, DFAvatar, DFInput, DFButton } from "./ui/index";
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
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DFCard
          header={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
              <div>
                <h3 className="df-title uppercase italic">Alumnos</h3>
                <p className="df-label !text-[10px] !text-df-text-muted">{filtered.length} usuarios</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-df-text-disabled" size={16} />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar alumno..."
                    className="input !pl-10 !h-10 !text-sm"
                />
              </div>
            </div>
          }
        >
            {filtered.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="df-label opacity-40 uppercase tracking-widest">No hay resultados</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="df-table">
                        <thead>
                            <tr>
                                <th className="df-table-header">Alumno</th>
                                <th className="df-table-header hidden md:table-cell">Estado</th>
                                <th className="df-table-header hidden lg:table-cell">Nivel</th>
                                <th className="df-table-header !text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id} className="df-table-row group">
                                    <td className="df-table-cell">
                                        <div className="flex items-center gap-3">
                                            <DFAvatar name={user.username} size="sm" />
                                            <div>
                                                <p className="df-subtitle !text-sm font-bold">{user.username}</p>
                                                <p className="df-caption">{user.email || 'Sin email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="df-table-cell hidden md:table-cell">
                                        <DFBadge variant={user.isPro ? "primary" : "secondary"}>
                                            {user.isPro ? 'PRO' : 'Standard'}
                                        </DFBadge>
                                    </td>
                                    <td className="df-table-cell hidden lg:table-cell">
                                        <span className="df-caption uppercase font-bold tracking-wider">{user.level || 'N/A'}</span>
                                    </td>
                                    <td className="df-table-cell text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onTogglePro(user)}
                                                className={`p-2 rounded-lg transition-colors ${user.isPro ? 'text-df-primary hover:bg-df-primary/10' : 'text-df-text-disabled hover:text-df-text'}`}
                                                title={user.isPro ? "Quitar PRO" : "Hacer PRO"}
                                            >
                                                {user.isPro ? <ShieldCheck size={18} /> : <Shield size={18} />}
                                            </button>
                                            <button
                                                onClick={() => onView(user)}
                                                className="p-2 text-df-text-soft hover:text-df-primary hover:bg-df-primary/10 rounded-lg transition-colors"
                                                title="Ver Detalles"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user.id)}
                                                className="p-2 text-df-text-disabled hover:text-df-danger hover:bg-df-danger/10 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DFCard>
    );
};

export default UsersSection;
