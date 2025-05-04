import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../Redux/store';
import { logout } from '../Redux/Auth/LoginSlice';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggler } from './theme-toggler';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';

const DropdownItem = ({ to, icon: Icon, label, onClick }: { to?: string, icon: React.ElementType, label: string, onClick?: () => void }) => (
  <li>
    {to ? (
      <Link
        to={to}
        className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
      </Link>
    ) : (
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" />
      </button>
    )}
  </li>
);

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loginState = useSelector((state: RootState) => state.loginSlice);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    return hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsDashboardOpen(false);
  };

  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        dashboardRef.current && !dashboardRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
        setIsDashboardOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              AL-IRSHAAD
              <span className="font-normal text-gray-500 dark:text-gray-400 ml-1.5">SECONDARY</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-200">
                {formatTime(currentTime)}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(currentTime)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {loginState.data.message && (
              <div className="relative" ref={dashboardRef}>
                <button
                  onClick={toggleDashboard}
                  aria-expanded={isDashboardOpen}
                  aria-haspopup="true"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                >
                  <HomeIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                  {isDashboardOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden animate-scale-in">
                      <div className="p-1">
                        <ul className="space-y-1">
                          <DropdownItem to="/dashboard" icon={ChartBarIcon} label="Dashboard" />
                          <DropdownItem to="/dashboard/settings" icon={Cog6ToothIcon} label="Settings" />
                        </ul>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            )}

            <ThemeToggler />

            {loginState.data.message ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 group"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                    <span className="font-medium text-lg tracking-tight">
                      {loginState.data.user.fullname[0]}
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-400 dark:text-gray-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden animate-scale-in">
                    <div className="p-1">
                      <div className="px-4 py-3 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          Good {getTimeOfDay()},
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {loginState.data.user.email}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {loginState.data.user.Role}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-1 py-1">
                        <DropdownItem to="/dashboard/userPhoto" icon={UserCircleIcon} label="Profile" />
                        <DropdownItem to="/dashboard/ChangePassword" icon={LockClosedIcon} label="Change Password" />
                        <DropdownItem icon={ArrowRightOnRectangleIcon} label="Logout" onClick={logoutHandler} />
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;