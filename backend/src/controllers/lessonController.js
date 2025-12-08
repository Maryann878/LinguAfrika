import { Lesson } from '../models/Lesson.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getLessonsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { level } = req.query;

  const query = { courseId, isActive: true };
  if (level) {
    query.level = level;
  }

  const lessons = await Lesson.find(query).sort({ order: 1 });

  res.json({
    success: true,
    count: lessons.length,
    data: lessons,
  });
});

export const getLessonById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lesson = await Lesson.findById(id).populate('courseId', 'name language');

  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }

  res.json({
    success: true,
    data: lesson,
  });
});

export const getLevelsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const levels = await Lesson.distinct('level', { courseId, isActive: true });

  res.json({
    success: true,
    data: levels,
  });
});


