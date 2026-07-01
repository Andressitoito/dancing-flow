import React from "react";

import UserCard from "./UserCard";

const UserList = ({
    users,
    onView,
    onDelete,
    onTogglePro,
}) => {

    return (

        <div className="space-y-3">

            {users.map(user => (

                <UserCard

                    key={user.id}

                    user={user}

                    onView={onView}

                    onDelete={onDelete}

                    onTogglePro={onTogglePro}

                />

            ))}

        </div>

    );

};

export default UserList;