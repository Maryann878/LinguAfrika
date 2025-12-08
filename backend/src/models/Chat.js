import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
    language: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ['user', 'ai'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ userId: 1, createdAt: -1 });

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);


