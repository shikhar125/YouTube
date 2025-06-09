import asyncHandler from 'express-async-handler';
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
const createChannel = asyncHandler(async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  // Check if user already has a channel with this name
  const existingChannel = await Channel.findOne({ 
    owner: req.user._id,
    channelName: channelName 
  });

  if (existingChannel) {
    res.status(400);
    throw new Error('You already have a channel with this name');
  }

  const channel = await Channel.create({
    channelName,
    owner: req.user._id,
    description: description || '',
    channelBanner: channelBanner || 'https://example.com/banners/default_banner.png',
  });

  if (channel) {
    // Add channel to user's channels array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { channels: channel._id } },
      { new: true }
    );

    res.status(201).json(channel);
  } else {
    res.status(400);
    throw new Error('Invalid channel data');
  }
});

// @desc    Get all channels
// @route   GET /api/channels
// @access  Public
const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find({})
    .populate('owner', 'username avatar')
    .sort({ subscribers: -1 });
  res.json(channels);
});

// @desc    Get channel by ID
// @route   GET /api/channels/:id
// @access  Public
const getChannelById = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id)
    .populate('owner', 'username avatar')
    .populate('videos');

  if (channel) {
    res.json(channel);
  } else {
    res.status(404);
    throw new Error('Channel not found');
  }
});

// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private
const updateChannel = asyncHandler(async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  const channel = await Channel.findById(req.params.id);

  if (channel) {
    // Check if user is the owner of the channel
    if (channel.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this channel');
    }

    channel.channelName = channelName || channel.channelName;
    channel.description = description || channel.description;
    channel.channelBanner = channelBanner || channel.channelBanner;

    const updatedChannel = await channel.save();
    res.json(updatedChannel);
  } else {
    res.status(404);
    throw new Error('Channel not found');
  }
});

export { createChannel, getChannels, getChannelById, updateChannel };