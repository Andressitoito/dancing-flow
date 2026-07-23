import { useState } from "react";

const useAdminDashboard = () => {

    const [tab, setTab] = useState("stats");

    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    return {

        tab,

        setTab,

        search,

        setSearch,

        selectedUser,

        setSelectedUser,

    };

};

export default useAdminDashboard;