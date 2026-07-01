import React from "react";

import {
    SearchBar,
    SectionCard,
    EmptyState,
} from "../../../components/dashboard";

import UserList from "../components/UserList";

const UsersSection = ({
    users,
    search,
    setSearch,
    onView,
    onDelete,
    onTogglePro,
}) => {

    const filtered = users.filter(user =>
        user.username
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <SectionCard
            title="Alumnos"
            subtitle={`${filtered.length} usuarios`}
        >

            <div className="mb-6">

                <SearchBar

                    value={search}

                    onChange={e =>
                        setSearch(e.target.value)
                    }

                    placeholder="Buscar alumno..."

                />

            </div>

            {filtered.length === 0 ? (

                <EmptyState
                    title="No hay resultados"
                    description="No existe ningún alumno con ese nombre."
                />

            ) : (

                <UserList

                    users={filtered}

                    onView={onView}

                    onDelete={onDelete}

                    onTogglePro={onTogglePro}

                />

            )}

        </SectionCard>

    );

};

export default UsersSection;