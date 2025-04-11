import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../Redux/store';
import { logout } from '../Redux/Auth/LoginSlice';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggler } from './theme-toggler';
import { 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Existing time/date functions
    const getTimeOfDay = () => {
        const hour = currentTime.getHours();
        return hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    };

    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Existing auth functions
    const logoutHandler = () => {
        dispatch(logout());
        navigate('/auth/login');
    };

    // Dropdown handlers with mutual exclusion
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsDashboardOpen(false);
    };

    const toggleDashboard = () => {
        setIsDashboardOpen(!isDashboardOpen);
        setIsDropdownOpen(false);
    };

    // Click outside handler (maintained)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isOutsideDropdown = dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node);
            const isOutsideDashboard = dashboardRef.current && 
                !dashboardRef.current.contains(event.target as Node);

            if (isOutsideDropdown && isOutsideDashboard) {
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
                    {/* Logo Section (unchanged) */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            AL-IRSHAAD
                            <span className="font-normal text-gray-500 dark:text-gray-400 ml-1.5">SECONDARY</span>
                        </h1>
                    </Link>

                    {/* Time/Date Display (unchanged) */}
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

                    {/* Navigation Controls (updated) */}
                    <div className="flex items-center gap-3">
                        {/* Dashboard Dropdown (unchanged) */}
                        {loginState.data.message && (
                            <div className="relative">
                                <button
                                    onClick={toggleDashboard}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                                    aria-label="Dashboard menu"
                                >
                                    {/* Dashboard icon SVG (unchanged) */}
                                </button>
                                {/* Dashboard dropdown content (unchanged) */}
                            </div>
                        )}

                        <ThemeToggler />

                        {/* User Dropdown with Password Change */}
                        {loginState.data.message ? (
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 group relative"
                                >
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                                        <span className="font-medium text-lg tracking-tight">
                                            {loginState.data.user.fullname[0]}
                                        </span>
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700"
                                    >
                                        <div className="p-2 space-y-1">
                                            {/* User Info (unchanged) */}
                                            <div className="px-4 py-3 border-b dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    Good {getTimeOfDay()},
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {loginState.data.user.email}
                                                </p>
                                            </div>

                                            {/* Profile Link (unchanged) */}
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                            >
                                                <UserCircleIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                                <span className="text-sm font-medium">Profile</span>
                                            </Link>

                                            {/* New Password Change Link */}
                                            <Link
                                                to="dashboard/ChangePassword"
                                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                            >
                                                <LockClosedIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                                                <span className="text-sm font-medium">Change Password</span>
                                            </Link>

                                            {/* Existing Register Link (unchanged) */}
                                            <Link
                                                to="/register"
                                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                            >
                                                <PlusCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                <span className="text-sm font-medium">Register</span>
                                            </Link>

                                            {/* Logout Button (unchanged) */}
                                            <button
                                                onClick={logoutHandler}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/auth/login"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                <DocumentTextIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
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
