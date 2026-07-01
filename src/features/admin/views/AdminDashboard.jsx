import React, { useEffect } from 'react';
import useStore from '../../../store/useStore';
import useAdminDashboard from '../hooks/useAdminDashboard';
import {
  Users,
  LayoutDashboard,
  GraduationCap,
  UsersRound,
} from 'lucide-react';
import {
  DFPage,
  DFPageHeader,
  DFTabs,
  DFContainer,
  DFPageActions,
} from '../../../components/ui';

import { StatsSection, UsersSection, SegmentationSection, ClassesSection } from '../sections';
import UserProfileModal from '../modals/UserProfileModal';

const AdminDashboard = () => {
  const { users, fetchInitialData, deleteUser, changeRole } = useStore();
  const {
    tab,
    setTab,
    search,
    setSearch,
    selectedUser,
    setSelectedUser
  } = useAdminDashboard();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const tabs = [
    { id: 'stats', label: 'Estadísticas', icon: LayoutDashboard },
    { id: 'users', label: 'Alumnos', icon: Users },
    { id: 'segmentation', label: 'Segmentación', icon: UsersRound },
    { id: 'classes', label: 'Clases', icon: GraduationCap },
  ];

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      await deleteUser(id);
    }
  };

  const handleTogglePro = async (user) => {
    // Note: Standardize role management if needed
  };

  const renderActiveSection = () => {
    const studentUsers = users.filter(u => u.role === 'alumno');

    switch (tab) {
      case 'stats':
        return <StatsSection users={studentUsers} />;
      case 'users':
        return (
          <UsersSection
            users={studentUsers}
            search={search}
            setSearch={setSearch}
            onView={setSelectedUser}
            onDelete={handleDeleteUser}
            onTogglePro={handleTogglePro}
          />
        );
      case 'segmentation':
        return <SegmentationSection users={studentUsers} onView={setSelectedUser} />;
      case 'classes':
        return <ClassesSection />;
      default:
        return <StatsSection users={studentUsers} />;
    }
  };

  return (
    <DFPage>
      <DFContainer>
        <DFPageHeader
          title="Panel de Control"
          subtitle="Administra tu academia y el progreso de tus alumnos"
        >
          <DFPageActions>
            <DFTabs
              tabs={tabs}
              activeTab={tab}
              onChange={setTab}
            />
          </DFPageActions>
        </DFPageHeader>

        <main className="mt-8">
          {renderActiveSection()}
        </main>
      </DFContainer>

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </DFPage>
  );
};

export default AdminDashboard;
