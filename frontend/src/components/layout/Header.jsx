import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Menu, Bell, Upload, User } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?keyword=${searchTerm}`);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-yt-dark py-3 px-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Left: Logo and menu */}
      <div className="flex items-center">
        <button 
          className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center">
          <svg className="w-8 h-8 text-yt-red" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
          </svg>
          <span className="ml-1 text-xl font-bold">YouTube</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-full focus:outline-none dark:bg-yt-black dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gray-100 dark:bg-yt-light-black border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Right: User */}
      <div className="flex items-center">
        <button className="sm:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
          <Search className="w-6 h-6" />
        </button>

        {user ? (
          <>
            <Link to="/upload-video" className="p-2 mx-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
              <Upload className="w-6 h-6" />
            </Link>
            <button className="p-2 mx-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
              <Bell className="w-6 h-6" />
            </button>
            <div className="relative">
              <button 
                className="w-8 h-8 ml-2 rounded-full bg-blue-500 flex items-center justify-center text-white"
                onClick={toggleUserMenu}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-yt-black shadow-lg rounded-md overflow-hidden z-50 scale-up-center">
                  <div className="p-3 border-b dark:border-gray-700">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <ul>
                    <li>
                      <Link to="/create-channel" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        Create Channel
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            to="/login" 
            className="flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <User className="w-5 h-5 mr-1" />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;