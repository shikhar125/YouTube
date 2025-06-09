import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize, SkipBack, SkipForward, AlertCircle } from 'lucide-react';

const VideoPlayer = ({ videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', () => setIsPlaying(true));
      video.addEventListener('pause', () => setIsPlaying(false));
      video.addEventListener('error', handleVideoError);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', () => setIsPlaying(true));
        video.removeEventListener('pause', () => setIsPlaying(false));
        video.removeEventListener('error', handleVideoError);
      };
    }
  }, []);

  const handleVideoError = (e) => {
    console.error('Video error:', e);
    setError('Failed to load video. Please check if the video URL is correct and accessible.');
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleFullScreen = () => {
    const videoContainer = document.getElementById('video-container');
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  if (error) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-video flex items-center justify-center">
        <div className="text-center text-white p-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
          <p className="text-lg font-medium">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Video URL: {videoUrl}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="video-container" className="relative w-full overflow-hidden rounded-lg bg-black aspect-video">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        title={title}
        onError={handleVideoError}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-full mb-2">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full cursor-pointer"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="text-white hover:text-gray-300 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button onClick={handleSkipBackward} className="text-white hover:text-gray-300 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button onClick={handleSkipForward} className="text-white hover:text-gray-300 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button onClick={handleMuteToggle} className="text-white hover:text-gray-300 transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5" /> : volume < 0.5 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 cursor-pointer"
              />
            </div>
            
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div>
            <button onClick={handleFullScreen} className="text-white hover:text-gray-300 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;