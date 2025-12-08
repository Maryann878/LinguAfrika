import { Quiz, QuizAttempt } from '../models/Quiz.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id).populate('courseId', 'name language').populate('lessonId', 'title');

  if (!quiz) {
    throw new AppError('Quiz not found', 404);
  }

  if (!quiz.isActive) {
    throw new AppError('Quiz is not available', 404);
  }

  // Don't send correct answers to client
  const quizData = quiz.toObject();
  quizData.questions = quizData.questions.map((q) => ({
    question: q.question,
    options: q.options,
    // Don't include correctAnswer or explanation
  }));

  res.json({
    success: true,
    data: quizData,
  });
});

export const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const quizzes = await Quiz.find({ 
    courseId, 
    isActive: true 
  })
    .populate('courseId', 'name language')
    .populate('lessonId', 'title')
    .select('-questions.correctAnswer -questions.explanation')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

export const getQuizzesByLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  const quizzes = await Quiz.find({ 
    lessonId, 
    isActive: true 
  })
    .populate('courseId', 'name language')
    .populate('lessonId', 'title')
    .select('-questions.correctAnswer -questions.explanation')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { quizId, answers, timeTaken } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new AppError('Quiz not found', 404);
  }

  if (!quiz.isActive) {
    throw new AppError('Quiz is not available', 400);
  }

  // Validate answers
  if (!answers || !Array.isArray(answers) || answers.length !== quiz.questions.length) {
    throw new AppError('Invalid answers format', 400);
  }

  // Calculate score
  let correctAnswers = 0;
  const detailedAnswers = answers.map((answer, index) => {
    const question = quiz.questions[index];
    if (!question) {
      throw new AppError(`Question at index ${index} not found`, 400);
    }
    const isCorrect = question.correctAnswer === answer.selectedAnswer;
    if (isCorrect) correctAnswers++;
    
    return {
      questionIndex: index,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
    };
  });

  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  // Save attempt
  const attempt = await QuizAttempt.create({
    quizId,
    userId,
    answers: detailedAnswers,
    score,
    timeTaken: timeTaken || 0,
    passed,
  });

  res.json({
    success: true,
    message: passed ? 'Quiz passed!' : 'Quiz completed',
    data: {
      attempt,
      score,
      passed,
      correctAnswers,
      totalQuestions: quiz.questions.length,
    },
  });
});

export const getQuizResults = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { attemptId } = req.params;

  const attempt = await QuizAttempt.findOne({ 
    _id: attemptId, 
    userId 
  }).populate('quizId');

  if (!attempt) {
    throw new AppError('Quiz attempt not found', 404);
  }

  const quiz = attempt.quizId;
  
  // Include correct answers and explanations for review
  const questionsWithAnswers = quiz.questions.map((question, index) => {
    const userAnswer = attempt.answers.find(a => a.questionIndex === index);
    return {
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswer?.selectedAnswer,
      isCorrect: userAnswer?.isCorrect || false,
      explanation: question.explanation,
    };
  });

  res.json({
    success: true,
    data: {
      attempt: {
        _id: attempt._id,
        score: attempt.score,
        passed: attempt.passed,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt,
      },
      quiz: {
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
      },
      questions: questionsWithAnswers,
    },
  });
});

export const getQuizAttempts = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { quizId } = req.params;

  const attempts = await QuizAttempt.find({ userId, quizId })
    .sort({ completedAt: -1 })
    .populate('quizId', 'title passingScore')
    .select('-answers'); // Don't send detailed answers in list

  res.json({
    success: true,
    count: attempts.length,
    data: attempts,
  });
});

export const getAllUserQuizAttempts = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { limit = 50 } = req.query;

  const attempts = await QuizAttempt.find({ userId })
    .sort({ completedAt: -1 })
    .limit(parseInt(limit))
    .populate('quizId', 'title courseId')
    .populate('quizId.courseId', 'name language')
    .select('-answers'); // Don't send detailed answers in list

  res.json({
    success: true,
    count: attempts.length,
    data: attempts,
  });
});

export const getUserQuizStats = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const attempts = await QuizAttempt.find({ userId });

  const stats = {
    totalAttempts: attempts.length,
    passedAttempts: attempts.filter(a => a.passed).length,
    failedAttempts: attempts.filter(a => !a.passed).length,
    averageScore: attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0,
    bestScore: attempts.length > 0 
      ? Math.max(...attempts.map(a => a.score))
      : 0,
    totalQuizzes: new Set(attempts.map(a => a.quizId.toString())).size,
  };

  res.json({
    success: true,
    data: stats,
  });
});

