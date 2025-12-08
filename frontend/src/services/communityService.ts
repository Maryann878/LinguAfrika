import api from './api';

export const getAllChannels = async () => {
  try {
    const response = await api.get('/community/channels');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get channels');
  }
};

export const getChannelByName = async (name: string) => {
  try {
    const response = await api.get(`/community/channels/${name}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get channel');
  }
};

export const getChannelPosts = async (channelId: string, page: number = 1, limit: number = 20) => {
  try {
    const response = await api.get(`/community/channels/${channelId}/posts`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get posts');
  }
};

export const createPost = async (channelId: string, content: string) => {
  try {
    const response = await api.post(`/community/channels/${channelId}/posts`, {
      channelId,
      content
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create post');
  }
};

export const getPostReplies = async (postId: string) => {
  try {
    const response = await api.get(`/community/posts/${postId}/replies`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get replies');
  }
};

export const createReply = async (postId: string, content: string) => {
  try {
    const response = await api.post(`/community/posts/${postId}/replies`, {
      postId,
      content
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create reply');
  }
};

export const joinChannel = async (channelId: string) => {
  try {
    const response = await api.post(`/community/channels/${channelId}/join`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to join channel');
  }
};

export const leaveChannel = async (channelId: string) => {
  try {
    const response = await api.post(`/community/channels/${channelId}/leave`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to leave channel');
  }
};

export const checkChannelMembership = async (channelId: string) => {
  try {
    const response = await api.get(`/community/channels/${channelId}/membership`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to check membership');
  }
};


