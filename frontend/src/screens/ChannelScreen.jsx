import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Edit, Video } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';

const ChannelScreen = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const { data } = await axios.get(`/api/channels/${id}`);
        setChannel(data);
        setVideos(data.videos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching channel:', error);
        setError('Failed to load channel. Please try again.');
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error || 'Channel not found'}</p>
        <Link 
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === channel.owner._id;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative h-40 md:h-56 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden mb-6">
        {channel.channelBanner && (
          <img
            src={channel.channelBanner}
            alt={`${channel.channelName} banner`}
            className="w-full h-full object-cover"
          />
        )}
        
        {isOwner && (
          <Link
            to={`/edit-channel/${channel._id}`}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
          >
            <Edit className="w-5 h-5 text-gray-800" />
          </Link>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold">
            {channel.channelName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{channel.channelName}</h1>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
              <span>{channel.subscribers} subscribers</span>
              <span>•</span>
              <span>{videos.length} videos</span>
            </div>
            {channel.description && (
              <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm line-clamp-2 md:max-w-md">
                {channel.description}
              </p>
            )}
          </div>
        </div>
        
        {!isOwner && (
          <button className="mt-4 md:mt-0 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Subscribe
          </button>
        )}
        
        {isOwner && (
          <Link
            to="/upload-video"
            className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center"
          >
            <Video className="w-5 h-5 mr-2" />
            Upload Video
          </Link>
        )}
      </div>
      
      <div className="border-b dark:border-gray-700 mb-6">
        <button
          className={`py-3 px-6 text-sm font-medium border-b-2 ${
            activeTab === 'videos'
              ? 'border-black dark:border-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
        <button
          className={`py-3 px-6 text-sm font-medium border-b-2 ${
            activeTab === 'about'
              ? 'border-black dark:border-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>
      
      {activeTab === 'videos' ? (
        <>
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No videos yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                This channel hasn't uploaded any videos.
              </p>
              {isOwner && (
                <Link
                  to="/upload-video"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full inline-flex items-center"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Upload First Video
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="mb-6 whitespace-pre-line">
            {channel.description || 'This channel has no description.'}
          </p>
          
          <div className="text-gray-500 dark:text-gray-400">
            <p>Channel created on {new Date(channel.createdAt).toLocaleDateString()}</p>
            <p className="mt-2">{channel.subscribers} subscribers</p>
            <p className="mt-2">{videos.length} videos</p>
            <p className="mt-2">{channel.views || 0} total views</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelScreen;