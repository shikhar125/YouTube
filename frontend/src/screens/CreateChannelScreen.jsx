import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Upload, AlertCircle } from 'lucide-react';

const CreateChannelScreen = () => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setChannelBanner(event.target.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const uploadBannerImage = async () => {
    if (!file) return null;
    
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
      throw new Error('Failed to upload banner image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      let bannerPath = null;
      
      if (file) {
        bannerPath = await uploadBannerImage();
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post(
        '/api/channels',
        {
          channelName,
          description,
          channelBanner: bannerPath,
        },
        config
      );
      
      toast.success('Channel created successfully!');
      navigate(`/channel/${data._id}`);
    } catch (error) {
      console.error('Error creating channel:', error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to create channel. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create a Channel</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 rounded flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="channelName" className="block text-sm font-medium mb-2">Channel Name</label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter your channel name"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-yt-black dark:border-gray-700"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your channel"
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-yt-black dark:border-gray-700 resize-none"
          ></textarea>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Channel Banner</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
            {channelBanner ? (
              <div className="mb-4">
                <img
                  src={channelBanner}
                  alt="Banner Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setChannelBanner('');
                  }}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="py-8">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Drag and drop an image or click to browse
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 2048 x 1152 pixels
                </p>
              </div>
            )}
            <input
              type="file"
              id="banner"
              accept="image/*"
              onChange={handleFileChange}
              className={`opacity-0 absolute inset-0 w-full h-full cursor-pointer ${channelBanner ? 'hidden' : ''}`}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !channelName.trim()}
        >
          {isLoading ? 'Creating Channel...' : 'Create Channel'}
        </button>
      </form>
    </div>
  );
};

export default CreateChannelScreen;