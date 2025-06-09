import express from 'express';
import { 
  createVideo, 
  getVideos, 
  getVideoById, 
  updateVideo, 
  deleteVideo, 
  createComment, 
  likeVideo 
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVideos)
  .post(protect, createVideo);

router.route('/:id')
  .get(getVideoById)
  .put(protect, updateVideo)
  .delete(protect, deleteVideo);

router.route('/:id/comments')
  .post(protect, createComment);

router.route('/:id/like')
  .put(protect, likeVideo);

export default router;