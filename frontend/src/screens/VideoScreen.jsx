import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/video/VideoPlayer';
import CommentSection from '../components/video/CommentSection';
import { ThumbsUp, ThumbsDown, Share, Save, Flag } from 'lucide-react';
import { formatNumber } from '../utils/formatUtils';

const VideoScreen = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(`/api/videos/${id}`);
        setVideo(data);
        setLoading(false);
        
        // Fetch related videos
        const { data: relatedData } = await axios.get(`/api/videos?category=${data.category}`);
        setRelatedVideos(relatedData.filter(v => v._id !== id).slice(0, 8));
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to load video. Please try again.');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLikeVideo = async () => {
    if (!user) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`/api/videos/${id}/like`, {}, config);
      setVideo({ ...video, likes: data.likes });
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error || 'Video not found'}</p>
        <Link 
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="lg:w-2/3">
          <VideoPlayer videoUrl={video.videoUrl} title={video.title} />
          
          <h1 className="text-xl md:text-2xl font-bold mt-4">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between mt-3 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center space-x-2">
              <Link to={`/channel/${video.channelId._id}`}>
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  {video.channelId.channelName.charAt(0).toUpperCase()}
                </div>
              </Link>
              <div>
                <Link to={`/channel/${video.channelId._id}`} className="font-medium hover:text-blue-500">
                  {video.channelId.channelName}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatNumber(video.channelId.subscribers)} subscribers
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <button 
                onClick={handleLikeVideo}
                className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full"
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{formatNumber(video.likes)}</span>
              </button>
              
              <button className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full">
                <ThumbsDown className="w-5 h-5" />
                <span>{formatNumber(video.dislikes)}</span>
              </button>
              
              <button className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full">
                <Share className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full">
                <Save className="w-5 h-5" />
                <span>Save</span>
              </button>
              
              <button className="hidden sm:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full">
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">
                {formatNumber(video.views)} views • {new Date(video.createdAt).toLocaleDateString()}
              </div>
              {user && user._id === video.uploader.toString() && (
                <Link
                  to={`/edit-video/${video._id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit Video
                </Link>
              )}
            </div>
            <p className="whitespace-pre-line">{video.description}</p>
          </div>
          
          <CommentSection videoId={id} />
        </div>
        
        <div className="lg:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
          <div className="space-y-4">
            {relatedVideos.map((relatedVideo) => (
              <Link key={relatedVideo._id} to={`/video/${relatedVideo._id}`} className="flex group">
                <div className="w-40 min-w-40 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={relatedVideo.thumbnailUrl}
                    alt={relatedVideo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{relatedVideo.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {relatedVideo.channelId.channelName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {formatNumber(relatedVideo.views)} views • {new Date(relatedVideo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
            
            {relatedVideos.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                No related videos found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScreen;