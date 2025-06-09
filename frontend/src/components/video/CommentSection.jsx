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

      await axios.post(`/api/videos/${videoId}/comments`, { text: commentText }, config);
      
      // Refresh comments
      const { data } = await axios.get(`/api/comments/${videoId}`);
      setComments(data);
      
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
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
          Authorization: `Bearer ${user.token}`,
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
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/comments/${videoId}/${commentId}`, config);
      
      // Update local state
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">{comments.length} Comments</h3>
      
      {user && (
        <form onSubmit={handleAddComment} className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border-b border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none bg-transparent"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`px-4 py-2 rounded-full ${
                  commentText.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
                }`}
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
              {comment.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{comment.username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              
              {editingComment === comment._id ? (
                <div className="mt-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-yt-black"
                    autoFocus
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-1">{comment.text}</p>
                  {user && user._id === comment.userId && (
                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;