import mongoose from 'mongoose';

const channelSchema = mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      default: '',
    },
    channelBanner: {
      type: String,
      default: 'https://example.com/banners/default_banner.png',
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;