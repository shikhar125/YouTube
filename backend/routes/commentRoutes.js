import express from 'express';
import { 
  getComments, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:videoId')
  .get(getComments);

router.route('/:videoId/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router;