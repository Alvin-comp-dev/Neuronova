import express from 'express';
import {
  getDiscussions,
  searchDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  addReply,
  likeDiscussion,
  bookmarkDiscussion,
  acceptAnswer,
  getCommunityStats,
} from '../controllers/community';
import { auth } from '../middleware/auth';

const router = express.Router();

// Discussion routes
router.get('/discussions', getDiscussions);
router.get('/discussions/search', searchDiscussions);
router.get('/discussions/:id', getDiscussion);
router.post('/discussions', auth, createDiscussion);
router.put('/discussions/:id', auth, updateDiscussion);

// Reply routes
router.post('/discussions/:id/reply', auth, addReply);

// Interaction routes
router.post('/discussions/:id/like', auth, likeDiscussion);
router.post('/discussions/:id/bookmark', auth, bookmarkDiscussion);
router.post('/discussions/:id/accept/:replyId', auth, acceptAnswer);

// Stats
router.get('/stats', getCommunityStats);

export default router; 