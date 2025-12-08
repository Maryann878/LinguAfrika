import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 15,
    },
    order: {
      type: Number,
      required: true,
    },
    exercises: [
      {
        type: {
          type: String,
          enum: ['vocabulary', 'translation', 'matching', 'fill-in-the-blank', 'multiple-choice'],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        options: [String],
        answer: {
          type: String,
          required: true,
        },
        explanation: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ courseId: 1, level: 1, order: 1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);


