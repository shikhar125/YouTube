import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/userModel.js';
import Channel from './models/channelModel.js';
import Video from './models/videoModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();

    // Create sample user
    const user = await User.create({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: 'password123',
      avatar: 'https://example.com/avatar/johndoe.png',
    });

    // Create sample channel
    const channel = await Channel.create({
      channelName: 'Code with John',
      owner: user._id,
      description: 'Coding tutorials and tech reviews by John Doe.',
      channelBanner: 'https://example.com/banners/john_banner.png',
      subscribers: 5200,
    });

    // Update user with channel
    user.channels.push(channel._id);
    await user.save();

    // Create sample videos
    const videos = [
      {
        title: 'Learn React in 30 Minutes',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'A quick tutorial to get started with React.',
        channelId: channel._id,
        uploader: user._id,
        category: 'Programming',
        views: 15200,
        likes: 1023,
        dislikes: 45,
        comments: [
          {
            userId: user._id,
            text: 'Great video! Very helpful.',
            username: user.username,
            avatar: user.avatar,
             timestamp: new Date('2024-09-21T08:30:00Z'),
          },
        ],
      },
      {
        title: 'MongoDB Crash Course',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        description: 'Learn MongoDB basics in this crash course.',
        channelId: channel._id,
        uploader: user._id,
        category: 'Database',
        views: 8700,
        likes: 725,
        dislikes: 12,
        uploadDate: new Date('2024-09-22'),
        comments: [],
      },
    ];

    const createdVideos = await Video.insertMany(videos);

    // Add videos to channel
    for (const video of createdVideos) {
      channel.videos.push(video._id);
    }
    await channel.save();

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}