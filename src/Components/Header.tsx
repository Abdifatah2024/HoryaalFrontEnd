import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../Redux/store';
import { logout } from '../Redux/Auth/LoginSlice';
import { useState } from 'react';
import { Button } from '@mui/material';
import { ThemeToggler } from './theme-toggler';


const Header = () => {
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const dispatch = useDispatch<AppDispatch>();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // If users are stored as an array in loginState, this will work.
    const users = loginState.data.users || []; 

    return (
        <header className='text-black shadow-md'>
            <div className='container mx-auto flex justify-between items-center p-4'>
                {/* Logo and School Name */}
                <Link to='/' className='flex items-center space-x-2'>
                    <h1 className="text-2xl font-bold">AL-IRSHAAD SECONDARY SCHOOL</h1>
                </Link>

                {/* User Profile and Navigation */}
                <div className='flex items-center space-x-4'>
                    {loginState.data.message ? (
                        <div className='flex items-center space-x-3'>
                            
                            <p className='font-bold mx-2'>{loginState.data.user.fullname}</p>
                            <Button 
                                variant="contained" 
                                color="error" 
                                size="large" 
                                className='ml-2'
                                onClick={logoutHandler}
                            >
                                Logout
                            </Button>
                            <Link className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all gap-2 mx-2' to='/register'>
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all' to='/auth/login'>
                                Login
                            </Link>
                            
                        </div>
                    )}
                    <ThemeToggler />
                </div>
            </div>
        </header>
    );
};

export default Header;
