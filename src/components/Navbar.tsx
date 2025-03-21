
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isStaff } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Update scrolled state on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Determine which nav items to show based on user role
  const navItems = isStaff 
    ? [
        { name: 'Dashboard', path: '/admin-dashboard' },
        { name: 'Queue Management', path: '/admin-dashboard?tab=queue' },
        { name: 'Bed Management', path: '/bed-management' },
        { name: 'Inventory', path: '/inventory' },
      ]
    : [
        { name: 'Dashboard', path: '/patient-dashboard' },
        { name: 'Appointments', path: '/patient-dashboard?tab=appointments' },
        { name: 'Queue Status', path: '/patient-dashboard?tab=queue' },
        { name: 'Support', path: '/patient-dashboard?tab=support' },
      ];

  const isActive = (path: string) => {
    const basePath = path.split('?')[0];
    const currentBasePath = location.pathname.split('?')[0];
    return basePath === currentBasePath || 
      (path.includes('?') && location.pathname + location.search === path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isStaff ? '/admin-dashboard' : '/patient-dashboard'} className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-hospital-500 flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="ml-2 text-xl font-bold text-hospital-800">HealthQueue</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-hospital-600 bg-hospital-50'
                      : 'text-gray-600 hover:text-hospital-500 hover:bg-hospital-50/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center ml-3 space-x-1">
              <button className="p-2 relative rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="relative group">
                <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-hospital-100 flex items-center justify-center overflow-hidden border border-hospital-200">
                    <User size={16} className="text-hospital-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                <div className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1 divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <button 
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md animate-slideUp">
          <div className="space-y-1 pt-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 text-base font-medium ${
                  isActive(item.path)
                    ? 'text-hospital-600 bg-hospital-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-hospital-100 flex items-center justify-center">
                  <User size={20} className="text-hospital-500" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
              <button className="ml-auto p-1 rounded-full relative text-gray-500 hover:bg-gray-100">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
