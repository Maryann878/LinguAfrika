import { Router } from 'express';
import {
  getAllChannels,
  getChannelByName,
  getChannelPosts,
  createPost,
  getPostReplies,
  createReply,
  joinChannel,
  leaveChannel,
  checkChannelMembership,
} from '../controllers/communityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/channels', authenticate, getAllChannels);
router.get('/channels/:name', authenticate, getChannelByName);
router.get('/channels/:channelId/posts', authenticate, getChannelPosts);
router.post('/channels/:channelId/posts', authenticate, createPost);
router.get('/posts/:postId/replies', authenticate, getPostReplies);
router.post('/posts/:postId/replies', authenticate, createReply);
router.post('/channels/:channelId/join', authenticate, joinChannel);
router.post('/channels/:channelId/leave', authenticate, leaveChannel);
router.get('/channels/:channelId/membership', authenticate, checkChannelMembership);

export default router;


