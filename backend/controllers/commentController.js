import asyncHandler from 'express-async-handler';
import Video from '../models/videoModel.js';

// @desc    Get all comments for a video
// @route   GET /api/comments/:videoId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.videoId).select('comments');
  
  if (video) {
    res.json(video.comments);
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Update a comment
// @route   PUT /api/comments/:videoId/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const video = await Video.findById(req.params.videoId);
  
  if (video) {
    const comment = video.comments.id(req.params.commentId);
    
    if (comment) {
      // Check if user is the author of the comment
      if (comment.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this comment');
      }
      
      comment.text = text;
      await video.save();
      res.json(comment);
    } else {
      res.status(404);
      throw new Error('Comment not found');
    }
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:videoId/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  
  if (video) {
    const comment = video.comments.id(req.params.commentId);
    
    if (comment) {
      // Check if user is the author of the comment
      if (comment.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this comment');
      }
      
      video.comments.pull({ _id: req.params.commentId });
      await video.save();
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404);
      throw new Error('Comment not found');
    }
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Add comment to video
// @route   POST /api/videos/:id/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const comment = {
    userId: req.user._id,
    text,
    username: req.user.username,
    avatar: req.user.avatar || '',
  };
  video.comments.push(comment);
  await video.save();
  res.status(201).json({ message: 'Comment added' });
});

export { getComments, updateComment, deleteComment, createComment };