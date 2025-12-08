import { Course } from '../models/Course.js';
import { Progress } from '../models/Progress.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getAllCourses = asyncHandler(async (req, res) => {
  const { language, level, search } = req.query;
  
  let query = { isActive: true };

  // Filter by language
  if (language) {
    query.language = { $regex: new RegExp(language, 'i') };
  }

  // Filter by level
  if (level) {
    query.level = level;
  }

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
      { language: { $regex: new RegExp(search, 'i') } },
    ];
  }

  const courses = await Course.find(query).sort({ name: 1 });

  res.json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export const getLanguages = asyncHandler(async (req, res) => {
  // Get distinct languages from courses
  const languages = await Course.distinct('language', { isActive: true });
  
  // Get course count for each language
  const languagesWithCount = await Promise.all(
    languages.map(async (language) => {
      const count = await Course.countDocuments({ 
        language, 
        isActive: true 
      });
      return { language, count };
    })
  );

  res.json({
    success: true,
    count: languages.length,
    data: languagesWithCount.sort((a, b) => a.language.localeCompare(b.language)),
  });
});

export const getCoursesByLanguage = asyncHandler(async (req, res) => {
  const { language } = req.params;
  const { level } = req.query;

  let query = { 
    language: { $regex: new RegExp(language, 'i') },
    isActive: true 
  };

  if (level) {
    query.level = level;
  }

  const courses = await Course.find(query).sort({ name: 1 });

  res.json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export const getCoursesByLevel = asyncHandler(async (req, res) => {
  const { level } = req.params;
  const { language } = req.query;

  let query = { 
    level,
    isActive: true 
  };

  if (language) {
    query.language = { $regex: new RegExp(language, 'i') };
  }

  const courses = await Course.find(query).sort({ name: 1 });

  res.json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: course,
  });
});

export const getCourseByName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const course = await Course.findOne({ 
    name: { $regex: new RegExp(name, 'i') },
    isActive: true 
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: course,
  });
});

export const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  const progress = await Progress.findOne({
    userId,
    courseId,
  }).populate('courseId', 'name language level');

  if (!progress) {
    // Return default progress if none exists
    return res.json({
      success: true,
      data: {
        status: 'not-started',
        progress: 0,
        currentLesson: 1,
        totalLessons: 0,
        completedLessons: [],
      },
    });
  }

  res.json({
    success: true,
    data: progress,
  });
});

export const getAllUserProgress = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const progressList = await Progress.find({ userId })
    .populate('courseId', 'name language level image totalLessons totalAssessments estimatedHours')
    .sort({ lastAccessed: -1 })
    .limit(10);

  res.json({
    success: true,
    count: progressList.length,
    data: progressList,
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { courseId, lessonId, status, progress, currentLesson } = req.body;

  let userProgress = await Progress.findOne({ userId, courseId });

  if (!userProgress) {
    userProgress = await Progress.create({
      userId,
      courseId,
      status: status || 'in-progress',
      progress: progress || 0,
      currentLesson: currentLesson || 1,
    });
  } else {
    userProgress.status = status || userProgress.status;
    userProgress.progress = progress !== undefined ? progress : userProgress.progress;
    userProgress.currentLesson = currentLesson || userProgress.currentLesson;
    userProgress.lastAccessed = new Date();

    if (lessonId && !userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId);
    }
  }

  await userProgress.save();

  res.json({
    success: true,
    message: 'Progress updated',
    data: userProgress,
  });
});

