import express from 'express';
import { 
  createChannel, 
  getChannels, 
  getChannelById, 
  updateChannel 
} from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getChannels)
  .post(protect, createChannel);

router.route('/:id')
  .get(getChannelById)
  .put(protect, updateChannel);

export default router;