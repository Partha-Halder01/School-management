import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, Users, Bell, MessageSquare, ImageIcon, PenTool, Database, Settings, UserCircle, User, GraduationCap, LogOut, Quote, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = Number(user?.role_id) || 1;
  const basePath = role === 1 ? '/admin' : role === 2 ? '/editor' : '/accountant';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;
  const panelTitle = role === 1 ? 'Admin Panel' : role === 2 ? 'Editor Panel' : 'Account Panel';
  const [isMobileQuickNavOpen, setIsMobileQuickNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileQuickNavOpen(false);
  }, [location.pathname]);

  const mobileQuickLinks = [
    ...(role === 1 ? [{ label: 'Dashboard', to: '/admin' }] : []),
    ...((role === 1 || role === 2) ? [
      { label: 'Enquiries', to: `${basePath}/enquiries` },
      { label: 'Notices', to: `${basePath}/notices` },
      { label: 'Messages', to: `${basePath}/contact-messages` },
      { label: 'Gallery', to: `${basePath}/gallery` },
      { label: 'Testimonials', to: `${basePath}/testimonials` },
      { label: 'Settings', to: `${basePath}/settings` },
    ] : []),
    ...((role === 1 || role === 3) ? [
      { label: 'Students', to: `${basePath}/students` },
      { label: 'Fees', to: `${basePath}/fees` },
    ] : []),
    ...(role === 1 ? [{ label: 'Staff', to: '/admin/staff' }] : []),
    ...(role !== 1 ? [{ label: 'Profile', to: `${basePath}/profile` }] : []),
  ];

  const linkBaseClass = (path) => `flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl min-w-[76px] flex-auto md:flex-none justify-center md:justify-start group shrink-0 relative transition-all duration-200 ${isActive(path)
      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  const iconClass = (path) => `mb-1 md:mb-0 shrink-0 ${isActive(path) ? 'text-white' : 'text-gray-500 group-hover:text-white'}`;
  const textClass = (path) => `text-[10.5px] md:text-[14px] font-medium md:truncate ${isActive(path) ? 'text-white' : 'text-gray-500 group-hover:text-white'}`;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans overflow-hidden">

      {/* Sidebar / Bottom Nav */}
      <aside className="bg-gray-900 w-full md:w-[260px] flex flex-row md:flex-col justify-between shrink-0 order-2 md:order-1 z-50 shadow-xl">

        {/* Logo (Desktop Only) */}
        <div className="hidden md:flex p-5 items-center border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <GraduationCap size={22} className="text-white" />
            </span>
            <span className="text-xl font-bebas font-bold text-white tracking-wider">
              JAMIA <span className="text-primary-400 font-caveat text-2xl ml-0.5 tracking-normal">AL FURQAN</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 w-full flex flex-row md:flex-col justify-start md:px-3 md:py-5 gap-1 md:gap-1.5 overflow-x-auto md:overflow-y-auto px-2 py-2 items-center md:items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

          {/* Section Label */}
          <span className="hidden md:block text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] px-4 mb-2">Main</span>

          {role === 1 && (
            <Link to="/admin" className={linkBaseClass('/admin')}>
              <Home size={20} className={iconClass('/admin')} />
              <span className={textClass('/admin')}>Dashboard</span>
            </Link>
          )}

          {(role === 1 || role === 2) && (
            <>
              <Link to={`${basePath}/enquiries`} className={linkBaseClass(`${basePath}/enquiries`)}>
                <User size={20} className={iconClass(`${basePath}/enquiries`)} />
                <span className={textClass(`${basePath}/enquiries`)}>Enquiries</span>
              </Link>
              <Link to={`${basePath}/notices`} className={linkBaseClass(`${basePath}/notices`)}>
                <Bell size={20} className={iconClass(`${basePath}/notices`)} />
                <span className={textClass(`${basePath}/notices`)}>Notices</span>
              </Link>
              <Link to={`${basePath}/contact-messages`} className={linkBaseClass(`${basePath}/contact-messages`)}>
                <MessageSquare size={20} className={iconClass(`${basePath}/contact-messages`)} />
                <span className={textClass(`${basePath}/contact-messages`)}>Messages</span>
              </Link>
              <Link to={`${basePath}/gallery`} className={linkBaseClass(`${basePath}/gallery`)}>
                <ImageIcon size={20} className={iconClass(`${basePath}/gallery`)} />
                <span className={textClass(`${basePath}/gallery`)}>Gallery</span>
              </Link>
              <Link to={`${basePath}/testimonials`} className={linkBaseClass(`${basePath}/testimonials`)}>
                <Quote size={20} className={iconClass(`${basePath}/testimonials`)} />
                <span className={textClass(`${basePath}/testimonials`)}>Testimonials</span>
              </Link>
            </>
          )}

          {/* Section Label */}
          {(role === 1 || role === 3) && (
            <span className="hidden md:block text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] px-4 mt-4 mb-2">Management</span>
          )}

          {(role === 1 || role === 3) && (
            <>
              <Link to={`${basePath}/students`} className={linkBaseClass(`${basePath}/students`)}>
                <PenTool size={20} className={iconClass(`${basePath}/students`)} />
                <span className={textClass(`${basePath}/students`)}>Students</span>
              </Link>
              <Link to={`${basePath}/fees`} className={linkBaseClass(`${basePath}/fees`)}>
                <Database size={20} className={iconClass(`${basePath}/fees`)} />
                <span className={textClass(`${basePath}/fees`)}>Fees</span>
              </Link>
            </>
          )}

          {role === 1 && (
            <>
              <Link to="/admin/staff" className={linkBaseClass('/admin/staff')}>
                <Users size={20} className={iconClass('/admin/staff')} />
                <span className={textClass('/admin/staff')}>Staff</span>
              </Link>
            </>
          )}

          {(role === 1 || role === 2) && (
            <>
              <span className="hidden md:block text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] px-4 mt-4 mb-2">System</span>
              <Link to={`${basePath}/settings`} className={linkBaseClass(`${basePath}/settings`)}>
                <Settings size={20} className={iconClass(`${basePath}/settings`)} />
                <span className={textClass(`${basePath}/settings`)}>Settings</span>
              </Link>
            </>
          )}

          {/* Spacer */}
          <div className="hidden md:block flex-1 pointer-events-none mt-auto h-full"></div>

          {/* Divider */}
          <div className="hidden md:block w-auto mx-3 h-px bg-gray-800 my-2 shrink-0"></div>

          {/* Profile (staff only, not admin) */}
          {role !== 1 && (
            <Link to={`${basePath}/profile`} className={linkBaseClass(`${basePath}/profile`)}>
              <UserCircle size={20} className={iconClass(`${basePath}/profile`)} />
              <span className={textClass(`${basePath}/profile`)}>Profile</span>
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative order-1 md:order-2">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{panelTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative md:hidden">
              <button
                onClick={() => setIsMobileQuickNavOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all"
              >
                {isMobileQuickNavOpen ? <X size={16} /> : <Menu size={16} />}
                <span>Navigate</span>
              </button>
              {isMobileQuickNavOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1.5">
                  {mobileQuickLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;

