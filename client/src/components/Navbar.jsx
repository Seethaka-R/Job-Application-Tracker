import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineBriefcase,
  HiOutlineSquares2X2,
  HiOutlinePlusCircle,
  HiOutlineDocumentText,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
} from 'react-icons/hi2';

const getNavLinks = (role) => {
  if (role === 'hr') {
    return [
      { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
      { to: '/post-job', label: 'Post Job', icon: HiOutlinePlusCircle },
    ];
  }
  return [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
    { to: '/all-jobs', label: 'My Applications', icon: HiOutlineDocumentText },
    { to: '/add-job', label: 'Add Application', icon: HiOutlinePlusCircle },
    { to: '/browse-jobs', label: 'Browse Jobs', icon: HiOutlineBriefcase },
    { to: '/profile', label: 'Profile', icon: HiOutlineUser },
  ];
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const activeLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-violet-600/20 text-violet-400 shadow-lg shadow-violet-500/10'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow duration-300">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">
              JobTrackr
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {getNavLinks(user?.role).map((link) => (
                <NavLink key={link.to} to={link.to} className={activeLinkClass}>
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <HiOutlineUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="gradient-btn px-5 py-2 rounded-xl text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            {mobileOpen ? (
              <HiOutlineXMark className="w-6 h-6" />
            ) : (
              <HiOutlineBars3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-t border-slate-700/50">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <HiOutlineUser className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>

                {getNavLinks(user?.role).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={activeLinkClass}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </NavLink>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
                >
                  <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block gradient-btn px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
