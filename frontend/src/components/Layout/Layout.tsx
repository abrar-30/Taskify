import React, { ReactNode } from 'react';
import Header from './Header';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, ListChecks, Folder, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-around items-center h-16">
      <Link to="/dashboard" className={`flex flex-col items-center text-xs ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700'}`}>
        <CheckSquare className="h-6 w-6 mb-1" />
        Dashboard
      </Link>
      <Link to="/tasks" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/tasks') ? 'text-blue-600' : 'text-gray-700'}`}>
        <ListChecks className="h-6 w-6 mb-1" />
        Tasks
      </Link>
      <Link to="/projects" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/projects') ? 'text-blue-600' : 'text-gray-700'}`}>
        <Folder className="h-6 w-6 mb-1" />
        Projects
      </Link>
      
      <button onClick={handleLogout} className="flex flex-col items-center text-xs text-gray-700 focus:outline-none">
        <LogOut className="h-6 w-6 mb-1" />
        Sign Out
      </button>
    </nav>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <div className="hidden md:block">
        <Header />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default Layout;