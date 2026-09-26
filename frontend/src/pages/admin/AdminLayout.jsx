import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/Logo.jsx';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/admin/products', label: 'Products', icon: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: 'M4 4h16v16H4z M4 8l8 5 8-5' },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-white/10">
        <Logo dark />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-signal text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-white/40">Signed in as</p>
        <p className="text-sm text-white truncate">{admin?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full text-sm font-medium text-white/70 border border-white/15 py-2 hover:bg-white/5 hover:text-white transition-colors"
        >
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-mist flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-ink flex items-center justify-between px-4 h-14">
        <Logo dark />
        <button onClick={() => setMobileOpen(true)} className="text-white p-2" aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-ink flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-ink/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
