import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
    },
    flag: {
      type: String,
      default: '🇳🇬',
    },
    image: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    totalAssessments: {
      type: Number,
      default: 0,
    },
    estimatedHours: {
      type: Number,
      default: 0,
    },
    students: {
      type: Number,
      default: 0,
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

export const Course = mongoose.model('Course', courseSchema);


