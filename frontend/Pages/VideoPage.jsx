import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CommentSection from '../src/components/video/CommentSection';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/videos/${id}`)
      .then(res => {
        setVideo(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div>
      <h2>{video.title}</h2>
      <video src={video.videoUrl} controls poster={video.thumbnailUrl} width="640" />
      <p>{video.description}</p>
      <p><strong>Channel:</strong> {video.channelId?.channelName || 'Unknown'}</p>
      <button>👍 {video.likes}</button>
      <button>👎 {video.dislikes}</button>
      <CommentSection videoId={video._id} />
    </div>
  );
};

export default VideoPage;