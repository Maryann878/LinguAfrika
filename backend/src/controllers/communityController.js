import { Channel, Post, Reply } from '../models/Community.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getAllChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find({ isActive: true })
    .populate('members', 'username profileImage')
    .sort({ name: 1 });

  res.json({
    success: true,
    count: channels.length,
    data: channels,
  });
});

export const getChannelByName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const channel = await Channel.findOne({
    name: { $regex: new RegExp(name, 'i') },
    isActive: true,
  }).populate('members', 'username profileImage');

  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  res.json({
    success: true,
    data: channel,
  });
});

export const getChannelPosts = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ channelId })
    .populate('userId', 'username profileImage')
    .populate('likes', 'username')
    .populate({
      path: 'replies',
      populate: {
        path: 'userId',
        select: 'username profileImage'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments({ channelId });

  res.json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts,
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const { channelId, content } = req.body;
  const userId = req.userId;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  const post = await Post.create({
    channelId,
    userId,
    content,
  });

  // Update channel post count
  channel.posts += 1;
  await channel.save();

  await post.populate('userId', 'username profileImage');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post,
  });
});

export const getPostReplies = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const replies = await Reply.find({ postId })
    .populate('userId', 'username profileImage')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    count: replies.length,
    data: replies,
  });
});

export const createReply = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.userId;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const reply = await Reply.create({
    postId,
    userId,
    content,
  });

  // Add reply to post
  post.replies.push(reply._id);
  await post.save();

  await reply.populate('userId', 'username profileImage');

  res.status(201).json({
    success: true,
    message: 'Reply created successfully',
    data: reply,
  });
});

export const joinChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.userId;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  // Check if user is already a member
  if (channel.members.includes(userId)) {
    return res.json({
      success: true,
      message: 'Already a member of this channel',
      data: channel,
    });
  }

  // Add user to members
  channel.members.push(userId);
  await channel.save();

  await channel.populate('members', 'username profileImage');

  res.json({
    success: true,
    message: 'Successfully joined channel',
    data: channel,
  });
});

export const leaveChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.userId;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  // Remove user from members
  channel.members = channel.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );
  await channel.save();

  await channel.populate('members', 'username profileImage');

  res.json({
    success: true,
    message: 'Successfully left channel',
    data: channel,
  });
});

export const checkChannelMembership = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.userId;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  const isMember = channel.members.some(
    (memberId) => memberId.toString() === userId.toString()
  );

  res.json({
    success: true,
    isMember,
  });
});


