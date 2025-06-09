import { Link } from 'react-router-dom';
import { formatDistance } from '../../utils/formatUtils';

const VideoCard = ({ video }) => {
  return (
    <div className="group">
      <Link to={`/video/${video._id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
            {formatDistance(video.views)}
          </div>
        </div>
        <div className="flex mt-3 space-x-3">
          <div className="min-w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {/* Channel avatar would go here */}
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
              {video.channelId.channelName?.charAt(0)?.toUpperCase() || "C"}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base line-clamp-2">
              {video.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {video.channelId.channelName}
            </p>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              {formatDistance(video.views)} views • {new Date(video.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;