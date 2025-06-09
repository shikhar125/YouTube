import asyncHandler from 'express-async-handler';
import Video from '../models/videoModel.js';
import Channel from '../models/channelModel.js';

// @desc    Create a new video
// @route   POST /api/videos
// @access  Private
const createVideo = asyncHandler(async (req, res) => {
  const { title, thumbnailUrl, videoUrl, description, channelId, category } = req.body;

  // Check if the channel belongs to the user
  const channel = await Channel.findById(channelId);
  
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to upload to this channel');
  }

  const video = await Video.create({
    title,
    thumbnailUrl,
    videoUrl,
    description: description || '',
    channelId,
    uploader: req.user._id,
    category: category || 'General',
  });

  if (video) {
    // Add video to channel's videos array
    await Channel.findByIdAndUpdate(
      channelId,
      { $push: { videos: video._id } },
      { new: true }
    );

    res.status(201).json(video);
  } else {
    res.status(400);
    throw new Error('Invalid video data');
  }
});

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  
  const videos = await Video.find({ ...keyword, ...category })
    .populate('channelId', 'channelName')
    .sort({ createdAt: -1 });

  res.json(videos);
});

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id).populate('channelId', 'channelName');

  if (video) {
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  const video = await Video.findById(req.params.id);

  if (video) {
    // Check if user is the uploader of the video
    if (video.uploader.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this video');
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (video) {
    // Check if user is the uploader of the video
    if (video.uploader.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this video');
    }

    // Remove video from channel's videos array
    await Channel.findByIdAndUpdate(
      video.channelId,
      { $pull: { videos: video._id } },
      { new: true }
    );

    await video.deleteOne();
    res.json({ message: 'Video removed' });
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

  // Validate input
  if (!text || text.trim() === '') {
    res.status(400);
    throw new Error('Comment text is required');
  }

  // Validate video ID
  if (!req.params.id) {
    res.status(400);
    throw new Error('Video ID is required');
  }

  // Validate user
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const video = await Video.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  try {
    const comment = {
      userId: req.user._id,
      text: text.trim(),
      username: req.user.username,
      avatar: req.user.avatar || '',
    };

    video.comments.push(comment);
    await video.save();
    
    // Return the created comment
    const createdComment = video.comments[video.comments.length - 1];
    res.status(201).json(createdComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500);
    throw new Error('Failed to create comment');
  }
});

// @desc    Like a video
// @route   PUT /api/videos/:id/like
// @access  Private
const likeVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (video) {
    video.likes += 1;
    await video.save();
    res.json({ likes: video.likes });
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

export { 
  createVideo, 
  getVideos, 
  getVideoById, 
  updateVideo, 
  deleteVideo, 
  createComment, 
  likeVideo 
};