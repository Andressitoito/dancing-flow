import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import useAdmin from '../../hooks/useAdmin';
import {
  Users,
  LayoutDashboard,
  GraduationCap,
  UsersRound,
} from 'lucide-react';
import {
  DFPage,
  DFPageHeader,
  DFContainer,
  DFButton
} from '../../components/ui/index';

import StatsSection from '../../components/StatsSection';
import UsersSection from '../../components/UsersSection';
import SegmentationSection from '../../components/SegmentationSection';
import AdminClassesView from './AdminClassesView';
import UserProfileModal from '../../components/UserProfileModal';

const AdminControlView = () => {
  const { users, fetchInitialData, deleteUser } = useStore();
  const {
    tab,
    setTab,
    search,
    setSearch,
    selectedUser,
    setSelectedUser
  } = useAdmin();

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

  const { updateUser } = useStore();

  const handleTogglePro = async (user) => {
    await updateUser(user.id, { isPro: !user.isPro });
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
        return <AdminClassesView />;
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
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map(t => (
               <DFButton
                  key={t.id}
                  variant={tab === t.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTab(t.id)}
                  leftIcon={t.icon}
                  className="!rounded-xl df-label !text-[10px] whitespace-nowrap"
               >
                  {t.label}
               </DFButton>
            ))}
          </div>
        </DFPageHeader>

        <main className="mt-6">
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

export default AdminControlView;
