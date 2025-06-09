import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatTimeAgo } from '../../utils/formatUtils';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/comments/${videoId}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log('Adding comment to video:', videoId);
      console.log('Comment text:', commentText);
      console.log('Auth token:', user.token);

      const { data: newComment } = await axios.post(
        `/api/videos/${videoId}/comments`,
        { text: commentText },
        config
      );
      
      console.log('Comment added successfully:', newComment);
      
      setComments([...comments, newComment]);
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('Please sign in to comment');
      } else if (error.response?.status === 404) {
        toast.error('Video not found');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add comment');
      }
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      await axios.put(`/api/comments/${videoId}/${commentId}`, { text: editText }, config);
      
      // Refresh comments
      const { data } = await axios.get(`/api/comments/${videoId}`);
      setComments(data);
      
      setEditingComment(null);
      toast.success('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      await axios.delete(`/api/comments/${videoId}/${commentId}`, config);
      
      // Update local state
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="border-b pb-4">
            <div className="flex items-start gap-4">
              <img
                src={comment.avatar || '/default-avatar.png'}
                alt={comment.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.username}</span>
                  <span className="text-gray-500 text-sm">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                
                {editingComment === comment._id ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleUpdateComment(comment._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-gray-700">{comment.text}</p>
                )}

                {user && (user._id === comment.userId || user.isAdmin) && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection; 