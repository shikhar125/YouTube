import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Compass, Clock, ThumbsUp, History, PlaySquare, Flame, Music, Gamepad2, Trophy, Newspaper, Lightbulb } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  
  return (
    <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 md:w-64 bg-white dark:bg-yt-dark overflow-y-auto border-r border-gray-200 dark:border-gray-800 z-40">
      <div className="p-4">
        <div className="mb-4 border-b pb-4 dark:border-gray-700">
          <Link to="/" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Home className="w-6 h-6 mr-4" />
            <span>Home</span>
          </Link>
          <Link to="/?category=Trending" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Compass className="w-6 h-6 mr-4" />
            <span>Explore</span>
          </Link>
          <Link to="/?category=Shorts" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Flame className="w-6 h-6 mr-4" />
            <span>Shorts</span>
          </Link>
        </div>

        {user && (
          <div className="mb-4 border-b pb-4 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 px-4">You</h3>
            <Link to="/your-channel" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="w-6 h-6 mr-4" />
              <span>Your Channel</span>
            </Link>
            <Link to="/history" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <History className="w-6 h-6 mr-4" />
              <span>History</span>
            </Link>
            <Link to="/your-videos" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <PlaySquare className="w-6 h-6 mr-4" />
              <span>Your Videos</span>
            </Link>
            <Link to="/watch-later" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Clock className="w-6 h-6 mr-4" />
              <span>Watch Later</span>
            </Link>
            <Link to="/liked-videos" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <ThumbsUp className="w-6 h-6 mr-4" />
              <span>Liked Videos</span>
            </Link>
          </div>
        )}

        <div className="mb-4 border-b pb-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 px-4">Explore</h3>
          <Link to="/?category=Music" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Music className="w-6 h-6 mr-4" />
            <span>Music</span>
          </Link>
          <Link to="/?category=Gaming" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Gamepad2 className="w-6 h-6 mr-4" />
            <span>Gaming</span>
          </Link>
          <Link to="/?category=Sports" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Trophy className="w-6 h-6 mr-4" />
            <span>Sports</span>
          </Link>
          <Link to="/?category=News" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Newspaper className="w-6 h-6 mr-4" />
            <span>News</span>
          </Link>
          <Link to="/?category=Learning" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Lightbulb className="w-6 h-6 mr-4" />
            <span>Learning</span>
          </Link>
        </div>

        <div className="text-xs text-gray-500 px-4">
          <p className="mb-2">&copy; 2025 YouTube Clone</p>
          <p>Created for educational purposes</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

function User(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}