import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
    },
    description: {
      type: String,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: (v) => v.length >= 2,
            message: 'At least 2 options are required',
          },
        },
        correctAnswer: {
          type: Number,
          required: true,
        },
        explanation: String,
      },
    ],
    timeLimit: Number,
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ userId: 1, quizId: 1 });
quizAttemptSchema.index({ userId: 1, completedAt: -1 });

export const Quiz = mongoose.model('Quiz', quizSchema);
export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);


