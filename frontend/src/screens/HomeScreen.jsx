import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/video/VideoCard';
import CategoryFilter from '../components/home/CategoryFilter';
import { Grid } from 'lucide-react';

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword') || '';
        const category = params.get('category') || '';

        let url = '/api/videos';
        if (keyword || category) {
          url += '?';
          if (keyword) url += `keyword=${keyword}`;
          if (keyword && category) url += '&';
          if (category) url += `category=${category}`;
        }

        const { data } = await axios.get(url);
        setVideos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <CategoryFilter />
      
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <Grid className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No videos found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;