import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Upload, AlertCircle, Video } from 'lucide-react';

const categories = [
  'Programming', 'Music', 'Gaming', 'Sports', 'News', 
  'Learning', 'Comedy', 'Vlogs', 'Podcasts', 'Cooking'
];

const CreateVideoScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [userChannels, setUserChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserChannels = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get('/api/channels', config);
        const userOwnedChannels = data.filter(channel => channel.owner._id === user._id);
        setUserChannels(userOwnedChannels);
        
        if (userOwnedChannels.length > 0) {
          setSelectedChannel(userOwnedChannels[0]._id);
        } else {
          setError('You need to create a channel before uploading videos');
        }
      } catch (error) {
        console.error('Error fetching user channels:', error);
        setError('Failed to load your channels. Please try again.');
      }
    };

    fetchUserChannels();
  }, [user, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setThumbnailPreview(event.target.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setVideoPreview(event.target.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post('/api/upload', formData, config);
      return data.filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!thumbnailFile || !videoFile) {
      setError('Please upload both a thumbnail and a video file');
      return;
    }
    
    if (!selectedChannel) {
      setError('Please select a channel');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload thumbnail and video files
      const thumbnailPath = await uploadFile(thumbnailFile);
      const videoPath = await uploadFile(videoFile);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post(
        '/api/videos',
        {
          title,
          description,
          category,
          thumbnailUrl: thumbnailPath,
          videoUrl: videoPath,
          channelId: selectedChannel,
        },
        config
      );
      
      toast.success('Video uploaded successfully!');
      navigate(`/video/${data._id}`);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to upload video. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (userChannels.length === 0 && !error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">You need a channel first</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You need to create a channel before you can upload videos
        </p>
        <Link 
          to="/create-channel"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Create Channel
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 rounded flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Video</label>
            <div 
              className={`border-2 border-dashed rounded-lg overflow-hidden ${
                videoPreview ? 'border-transparent' : 'border-gray-300 dark:border-gray-700'
              }`}
            >
              {videoPreview ? (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-40 object-cover bg-black"
                  ></video>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                  <Video className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Click to upload video<br />
                    <span className="text-xs">MP4, WebM, MOV up to 1GB</span>
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div 
              className={`border-2 border-dashed rounded-lg overflow-hidden ${
                thumbnailPreview ? 'border-transparent' : 'border-gray-300 dark:border-gray-700'
              }`}
            >
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Click to upload thumbnail<br />
                    <span className="text-xs">JPG, PNG (1280x720 recommended)</span>
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title that describes your video"
            required
            maxLength="100"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-yt-black dark:border-gray-700"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {title.length}/100
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video"
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-yt-black dark:border-gray-700 resize-none"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="channel" className="block text-sm font-medium mb-2">Channel</label>
            <select
              id="channel"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-yt-black dark:border-gray-700"
            >
              <option value="" disabled>Select a channel</option>
              {userChannels.map((channel) => (
                <option key={channel._id} value={channel._id}>
                  {channel.channelName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-yt-black dark:border-gray-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !title.trim() || !thumbnailFile || !videoFile || !selectedChannel}
        >
          {isLoading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default CreateVideoScreen;