import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { Channel, Post, Reply } from '../models/Community.js';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { ChatMessage } from '../models/Chat.js';
import { Quiz, QuizAttempt } from '../models/Quiz.js';
import { Notification } from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Seed courses
export const seedCourses = async () => {
  const courses = [
    {
      name: 'Yoruba',
      description: 'Learn the language of the Yoruba people of West Africa',
      language: 'Yoruba',
      flag: '🇳🇬',
      image: '/yoruba.png',
      level: 'Beginner',
      totalLessons: 45,
      totalAssessments: 39,
      estimatedHours: 72,
      students: 1250,
    },
    {
      name: 'Hausa',
      description: 'Master one of Africa\'s major languages',
      language: 'Hausa',
      flag: '🇳🇬',
      image: '/hausa.png',
      level: 'Beginner',
      totalLessons: 42,
      totalAssessments: 39,
      estimatedHours: 72,
      students: 980,
    },
    {
      name: 'Igbo',
      description: 'Explore the rich Igbo culture and language',
      language: 'Igbo',
      flag: '🇳🇬',
      image: '/igbo.png',
      level: 'Intermediate',
      totalLessons: 38,
      totalAssessments: 39,
      estimatedHours: 72,
      students: 750,
    },
    {
      name: 'Efik',
      description: 'Discover the Efik language and culture',
      language: 'Efik',
      flag: '🇳🇬',
      image: '/efik.png',
      level: 'Beginner',
      totalLessons: 28,
      totalAssessments: 39,
      estimatedHours: 72,
      students: 320,
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    let course = await Course.findOne({ name: courseData.name });
    if (!course) {
      course = await Course.create(courseData);
      console.log(`✅ Seeded course: ${courseData.name}`);
    } else {
      console.log(`⚠️  Course already exists: ${courseData.name}`);
    }
    createdCourses.push(course);
  }
  return createdCourses;
};

// Seed lessons for courses
export const seedLessons = async (courses) => {
  const lessons = [];
  
  for (const course of courses) {
    const courseLessons = [
      {
        courseId: course._id,
        level: 'Beginner',
        title: `Introduction to ${course.name}`,
        description: `Get started with ${course.name} basics`,
        content: `Welcome to ${course.name}! In this lesson, you'll learn the fundamentals.`,
        duration: 15,
        order: 1,
        exercises: [
          {
            type: 'vocabulary',
            question: 'What is "hello" in ' + course.name + '?',
            options: ['Option A', 'Option B', 'Option C'],
            answer: 'Option A',
            explanation: 'This is the basic greeting.',
          },
        ],
      },
      {
        courseId: course._id,
        level: 'Beginner',
        title: `${course.name} Greetings`,
        description: `Learn common greetings in ${course.name}`,
        content: `Master the art of greeting in ${course.name}.`,
        duration: 20,
        order: 2,
        exercises: [],
      },
      {
        courseId: course._id,
        level: 'Beginner',
        title: `${course.name} Numbers`,
        description: `Count from 1 to 10 in ${course.name}`,
        content: `Learn numbers in ${course.name}.`,
        duration: 18,
        order: 3,
        exercises: [],
      },
    ];

    for (const lessonData of courseLessons) {
      let lesson = await Lesson.findOne({
        courseId: course._id,
        title: lessonData.title,
      });
      if (!lesson) {
        lesson = await Lesson.create(lessonData);
        console.log(`✅ Seeded lesson: ${lessonData.title}`);
      } else {
        console.log(`⚠️  Lesson already exists: ${lessonData.title}`);
      }
      lessons.push(lesson);
    }
  }
  return lessons;
};

// Seed channels
export const seedChannels = async () => {
  const channels = [
    {
      name: 'Yoruba Learners',
      description: 'Discuss Yoruba language and culture',
      members: [],
      posts: 342,
    },
    {
      name: 'Hausa Speakers',
      description: 'Connect with Hausa language learners',
      members: [],
      posts: 256,
    },
    {
      name: 'Igbo Community',
      description: 'Share your Igbo learning journey',
      members: [],
      posts: 189,
    },
    {
      name: 'General Discussion',
      description: 'General language learning discussions',
      members: [],
      posts: 567,
    },
  ];

  const createdChannels = [];
  for (const channelData of channels) {
    let channel = await Channel.findOne({ name: channelData.name });
    if (!channel) {
      channel = await Channel.create(channelData);
      console.log(`✅ Seeded channel: ${channelData.name}`);
    } else {
      console.log(`⚠️  Channel already exists: ${channelData.name}`);
    }
    createdChannels.push(channel);
  }
  return createdChannels;
};

// Add some fake members to channels to simulate different member counts
export const seedChannelMembers = async (channels, demoUser) => {
  // Add demo user to first 2 channels only (Yoruba Learners and Hausa Speakers)
  // Leave Igbo Community and General Discussion unjoined for user to join
  
  // Add demo user to Yoruba Learners (channel 0)
  if (channels[0] && !channels[0].members.some(m => m.toString() === demoUser._id.toString())) {
    channels[0].members.push(demoUser._id);
    // Add some fake member IDs to simulate more members (1250 total)
    const fakeMemberCount = 1249; // 1249 fake + 1 demo user = 1250
    for (let i = 0; i < fakeMemberCount; i++) {
      // Create a fake ObjectId
      const fakeId = new mongoose.Types.ObjectId();
      channels[0].members.push(fakeId);
    }
    await channels[0].save();
  }

  // Add demo user to Hausa Speakers (channel 1)
  if (channels[1] && !channels[1].members.some(m => m.toString() === demoUser._id.toString())) {
    channels[1].members.push(demoUser._id);
    // Add fake members (856 total)
    const fakeMemberCount = 855;
    for (let i = 0; i < fakeMemberCount; i++) {
      const fakeId = new mongoose.Types.ObjectId();
      channels[1].members.push(fakeId);
    }
    await channels[1].save();
  }

  // Don't add demo user to Igbo Community (channel 2) - leave it for user to join
  // Add fake members only (423 total, no demo user)
  if (channels[2]) {
    // Clear existing members first to avoid duplicates
    channels[2].members = [];
    const fakeMemberCount = 423;
    for (let i = 0; i < fakeMemberCount; i++) {
      const fakeId = new mongoose.Types.ObjectId();
      channels[2].members.push(fakeId);
    }
    await channels[2].save();
  }

  // Don't add demo user to General Discussion (channel 3) - leave it for user to join
  // Add fake members only (678 total, no demo user)
  if (channels[3]) {
    // Clear existing members first to avoid duplicates
    channels[3].members = [];
    const fakeMemberCount = 678;
    for (let i = 0; i < fakeMemberCount; i++) {
      const fakeId = new mongoose.Types.ObjectId();
      channels[3].members.push(fakeId);
    }
    await channels[3].save();
  }

  console.log('✅ Seeded channel members with varied counts');
};

// Create demo user
export const createDemoUser = async () => {
  const demoEmail = 'demo@linguafrika.com';
  let demoUser = await User.findOne({ email: demoEmail });

  if (demoUser) {
    console.log('⚠️  Demo user already exists. Deleting and recreating...');
    await User.findByIdAndDelete(demoUser._id);
  }

  // Don't hash password here - let the User model's pre-save hook handle it
  demoUser = await User.create({
    username: 'demo_user',
    email: demoEmail,
    mobile: '+2348012345678',
    password: 'Demo123!',
    firstName: 'Maya',
    lastName: 'Maryann',
    bio: 'Passionate about learning African languages! 🇳🇬',
    gender: 'Female',
    ageRange: '25-34',
    country: 'Nigeria',
    location: 'Lagos, Nigeria',
    goals: ['Connect with culture', 'Travel', 'Family communication'],
    profileComplete: true,
    isVerified: true,
  });

  console.log(`✅ Created demo user: ${demoEmail} (Password: Demo123!)`);
  return demoUser;
};

// Seed demo user progress
export const seedDemoProgress = async (demoUser, courses, lessons) => {
  const progressData = [
    {
      userId: demoUser._id,
      courseId: courses[0]._id, // Yoruba
      lessonId: lessons[0]?._id,
      level: 'Beginner',
      status: 'in-progress',
      progress: 45,
      currentLesson: 2,
      totalLessons: 45,
      timeSpent: 3600, // 1 hour
      lastAccessed: new Date(),
    },
    {
      userId: demoUser._id,
      courseId: courses[1]._id, // Hausa
      lessonId: lessons[3]?._id,
      level: 'Beginner',
      status: 'in-progress',
      progress: 30,
      currentLesson: 1,
      totalLessons: 42,
      timeSpent: 1800, // 30 minutes
      lastAccessed: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      userId: demoUser._id,
      courseId: courses[2]._id, // Igbo
      lessonId: lessons[6]?._id,
      level: 'Intermediate',
      status: 'completed',
      progress: 100,
      currentLesson: 38,
      totalLessons: 38,
      completedLessons: lessons[6]?._id ? [lessons[6]._id, lessons[7]?._id, lessons[8]?._id].filter(Boolean) : [],
      score: 85,
      timeSpent: 7200, // 2 hours
      lastAccessed: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];

  for (const progress of progressData) {
    await Progress.findOneAndUpdate(
      { userId: progress.userId, courseId: progress.courseId },
      progress,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Seeded demo user progress');
};

// Seed community posts
export const seedCommunityPosts = async (demoUser, channels) => {
  // Clear existing posts by demo user first
  const existingPosts = await Post.find({ userId: demoUser._id });
  for (const post of existingPosts) {
    await Reply.deleteMany({ postId: post._id });
    await Channel.findByIdAndUpdate(post.channelId, {
      $inc: { posts: -1 },
    });
  }
  await Post.deleteMany({ userId: demoUser._id });

  const posts = [
    {
      channelId: channels[0]._id, // Yoruba Learners
      userId: demoUser._id,
      content: 'E kaaro! (Good morning!) Bawo ni? (How are you?) Mo n ka Yoruba loni. (I am learning Yoruba today.) This is my first day and I\'m so excited!',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[0]._id, // Yoruba Learners
      userId: demoUser._id,
      content: 'Just completed my first Yoruba lesson! Bawo ni? (How are you?) is now part of my vocabulary. E se pupo! (Thank you very much!) So excited to continue learning! 🎉',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[0]._id, // Yoruba Learners
      userId: demoUser._id,
      content: 'E kaaro! (Good morning!) Can someone help me with the difference between "E se" and "O se"? When should I use each one? Mo n fe ka o! (I want to learn!)',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[0]._id, // Yoruba Learners
      userId: demoUser._id,
      content: 'Mo n ka Yoruba! (I am learning Yoruba!) This language is so beautiful. E ku ise fun gbogbo awon oluko! (Thank you to all the teachers!) The greetings are so warm and welcoming.',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[0]._id, // Yoruba Learners
      userId: demoUser._id,
      content: 'E kaaro! (Good morning!) I learned "E kaaro" for morning, "E kaasan" for afternoon, and "E ku irole" for evening. Yoruba has such beautiful time-based greetings!',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[1]._id, // Hausa Speakers
      userId: demoUser._id,
      content: 'Ina kwana! Lafiya lau. Na gode sosai! (Good morning! I am fine. Thank you very much!) Just started learning Hausa and I love how musical it sounds!',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[1]._id, // Hausa Speakers
      userId: demoUser._id,
      content: 'Ina kwana! (Good morning!) I just learned how to greet in Hausa. Can someone teach me more common phrases? Na gode! (Thank you!)',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[1]._id, // Hausa Speakers
      userId: demoUser._id,
      content: 'Na gode! (Thank you!) This community is so helpful. I\'m making great progress with Hausa pronunciation. Sannu da zuwa! (Welcome!)',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[1]._id, // Hausa Speakers
      userId: demoUser._id,
      content: 'Sannu! (Hello!) I learned that "Sannu" is a general greeting, while "Ina kwana?" means "How did you sleep?" - perfect for morning conversations!',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[2]._id, // Igbo Community
      userId: demoUser._id,
      content: 'Kedu! Kedu ka ị mere? A na m amụ Igbo. (Hello! How are you? I am learning Igbo.) The tones are challenging but fascinating!',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[2]._id, // Igbo Community
      userId: demoUser._id,
      content: 'Does anyone have tips for mastering Igbo pronunciation? I\'m finding some sounds challenging but I\'m determined! Kedu! (Hello!) 💪',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[2]._id, // Igbo Community
      userId: demoUser._id,
      content: 'Kedu! (Hello!) I\'m new to learning Igbo. Can someone explain the difference between "kedu" and "kedu ka ị mere"? Daalụ! (Thank you!)',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[2]._id, // Igbo Community
      userId: demoUser._id,
      content: 'Daalụ! (Thank you!) I just completed my first Igbo lesson. The tones are tricky but I\'m getting the hang of it! Ndewo! (Hello!)',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[3]._id, // General Discussion
      userId: demoUser._id,
      content: 'What\'s your favorite thing about learning African languages? For me, it\'s connecting with my heritage and understanding the culture better! 🌍',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[3]._id, // General Discussion
      userId: demoUser._id,
      content: 'I love how each language has its own unique expressions! Yoruba: "E ku ise" (Well done!), Hausa: "Sannu" (Hello!), Igbo: "Ndewo" (Hello!). So beautiful! 💚',
      likes: [],
      isPinned: false,
    },
    {
      channelId: channels[3]._id, // General Discussion
      userId: demoUser._id,
      content: 'Learning multiple African languages is amazing! Each one teaches me something new about the rich cultures. E se! (Yoruba - Thank you!) Na gode! (Hausa - Thank you!) Daalụ! (Igbo - Thank you!)',
      likes: [],
      isPinned: false,
    },
  ];

  const createdPosts = [];
  let postIndex = 0;
  
  for (const postData of posts) {
    const post = await Post.create(postData);
    createdPosts.push(post);
    
    // Update channel post count
    await Channel.findByIdAndUpdate(postData.channelId, {
      $inc: { posts: 1 },
    });
    
    // Add likes to posts (varying numbers for realism)
    // Using demoUser._id multiple times to simulate multiple users
    const likeCounts = [8, 12, 15, 6, 10, 7, 9, 14, 18, 11, 5, 13, 16, 4, 8, 9]; // Different like counts for each post
    const likes = Array(likeCounts[postIndex] || 5).fill(demoUser._id);
    await Post.findByIdAndUpdate(post._id, {
      $set: { likes: likes },
    });
    
    // Add contextual replies based on the channel with language-rich content
    let replies = [];
    if (postData.channelId.toString() === channels[0]._id.toString()) {
      // Yoruba Learners replies - mix of language and English
      replies = [
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'E kaaro! (Good morning!) O dara! (That\'s good!) Keep practicing! E kaaro is used in the morning, while Bawo ni? can be used anytime.',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 5 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'E se! (Thank you!) "E se" is formal and "O se" is informal. Use "E se" with elders or in formal settings. Mo n gbadun e! (I appreciate you!)',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 4 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Bawo ni? (How are you?) Mo n gbadun e! (I appreciate you!) Great question! The context matters a lot in Yoruba.',
          likes: [demoUser._id, demoUser._id, demoUser._id], // 3 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'E kaaro! (Good morning!) I totally agree. Learning Yoruba has been amazing. E ku ise! (Well done!)',
          likes: [demoUser._id, demoUser._id], // 2 likes
        },
      ];
    } else if (postData.channelId.toString() === channels[1]._id.toString()) {
      // Hausa Speakers replies - mix of language and English
      replies = [
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Sannu! (Hello!) Great progress! "Ina kwana" means "How did you sleep?" and is a common morning greeting. Lafiya lau! (I\'m fine!)',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 6 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Ina kwana! (Good morning!) Lafiya lau! (I\'m fine!) Keep practicing, you\'re doing great!',
          likes: [demoUser._id, demoUser._id, demoUser._id], // 3 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Na gode! (Thank you!) Here are some more phrases: "Yaya kake?" (How are you?), "Ka na da" (Good night). Sannu da zuwa! (Welcome!)',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 4 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Sannu! (Hello!) I love learning Hausa. The greetings are so warm. Ina kwana! (Good morning!)',
          likes: [demoUser._id, demoUser._id], // 2 likes
        },
      ];
    } else if (postData.channelId.toString() === channels[2]._id.toString()) {
      // Igbo Community replies - mix of language and English
      replies = [
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Kedu! (Hello!) Kedu ka ị mere? (How are you?) "Kedu" is a simple hello, while "Kedu ka ị mere?" means "How are you?"',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 7 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Kedu! (Hello!) Ọ dị mma! (It\'s fine!) The tones are important in Igbo. Keep listening to native speakers!',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 4 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Daalụ! (Thank you!) Practice makes perfect. You\'re doing great! Ndewo! (Hello!)',
          likes: [demoUser._id, demoUser._id, demoUser._id], // 3 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Kedu ka ị mere? (How are you?) I\'m also learning Igbo. The community here is so supportive!',
          likes: [demoUser._id, demoUser._id], // 2 likes
        },
      ];
    } else {
      // General Discussion replies - mix of all languages
      replies = [
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'E kaaro! (Good morning - Yoruba!) Beautiful! I love how greetings vary by time of day in Yoruba. E kaaro (morning), E kaasan (afternoon), E ku irole (evening)!',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 4 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Ina kwana! (Good morning - Hausa!) Same here! Learning Hausa has helped me connect with my family history. Na gode! (Thank you!)',
          likes: [demoUser._id, demoUser._id, demoUser._id, demoUser._id, demoUser._id], // 5 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'Kedu! (Hello - Igbo!) The cultural context makes learning so much more meaningful. Each phrase tells a story! Daalụ! (Thank you!)',
          likes: [demoUser._id, demoUser._id, demoUser._id], // 3 likes
        },
        {
          postId: post._id,
          userId: demoUser._id,
          content: 'I love how we can mix languages here! E se! (Yoruba - Thank you!) Na gode! (Hausa - Thank you!) Daalụ! (Igbo - Thank you!)',
          likes: [demoUser._id, demoUser._id], // 2 likes
        },
      ];
    }
    
    // Create replies with likes
    for (const replyData of replies) {
      const reply = await Reply.create(replyData);
      await Post.findByIdAndUpdate(post._id, {
        $push: { replies: reply._id },
      });
    }
    
    postIndex++;
  }
  console.log('✅ Seeded community posts with likes and replies');
  return createdPosts;
};

// Seed AI chat history
export const seedChatHistory = async (demoUser) => {
  const chatMessages = [
    {
      userId: demoUser._id,
      message: 'Hello! Can you help me learn Yoruba?',
      response: 'Of course! I\'d be happy to help you learn Yoruba. What would you like to start with? We can begin with basic greetings, numbers, or common phrases.',
      language: 'Yoruba',
      messageType: 'user',
    },
    {
      userId: demoUser._id,
      message: 'What are some common greetings?',
      response: 'Great question! Here are some common Yoruba greetings:\n\n- "Bawo ni?" - How are you?\n- "E kaaro" - Good morning\n- "E kaasan" - Good afternoon\n- "E ku irole" - Good evening\n- "O daaro" - Good night\n\nTry practicing these!',
      language: 'Yoruba',
      messageType: 'user',
    },
    {
      userId: demoUser._id,
      message: 'How do I say thank you?',
      response: 'In Yoruba, "thank you" is "E se" (formal) or "O se" (informal). You can also say "E se pupo" which means "thank you very much"!',
      language: 'Yoruba',
      messageType: 'user',
    },
  ];

  for (const messageData of chatMessages) {
    await ChatMessage.create(messageData);
  }
  console.log('✅ Seeded AI chat history');
};

// Seed quizzes and attempts
export const seedQuizzes = async (demoUser, courses, lessons) => {
  if (!lessons || lessons.length === 0) {
    console.log('⚠️  No lessons available, skipping quiz seeding');
    return;
  }

  const quiz = await Quiz.create({
    courseId: courses[0]._id, // Yoruba
    lessonId: lessons[0]._id,
    title: 'Yoruba Basics Quiz',
    description: 'Test your knowledge of basic Yoruba greetings and phrases',
    questions: [
      {
        question: 'What is "hello" in Yoruba?',
        options: ['Bawo', 'E kaaro', 'O daaro', 'E ku ise'],
        correctAnswer: 0,
        explanation: '"Bawo" is a common greeting meaning "hello" or "how are you?"',
      },
      {
        question: 'How do you say "thank you" in Yoruba?',
        options: ['E se', 'O daaro', 'E kaaro', 'Bawo'],
        correctAnswer: 0,
        explanation: '"E se" means thank you in Yoruba.',
      },
      {
        question: 'What does "E kaaro" mean?',
        options: ['Good night', 'Good morning', 'Good afternoon', 'Goodbye'],
        correctAnswer: 1,
        explanation: '"E kaaro" is the Yoruba greeting for good morning.',
      },
    ],
    passingScore: 70,
    isActive: true,
  });

  // Create a quiz attempt
  await QuizAttempt.create({
    quizId: quiz._id,
    userId: demoUser._id,
    answers: [
      { questionIndex: 0, selectedAnswer: 0, isCorrect: true },
      { questionIndex: 1, selectedAnswer: 0, isCorrect: true },
      { questionIndex: 2, selectedAnswer: 1, isCorrect: true },
    ],
    score: 100,
    timeTaken: 120, // 2 minutes
    passed: true,
    completedAt: new Date(),
  });

  console.log('✅ Seeded quizzes and quiz attempts');
};

// Seed notifications
export const seedNotifications = async (demoUser, courses) => {
  const notifications = [
    {
      userId: demoUser._id,
      title: 'Welcome to LinguAfrika!',
      message: 'We\'re excited to have you start your language learning journey with us.',
      type: 'success',
      isRead: true,
      link: '/dashboard',
    },
    {
      userId: demoUser._id,
      title: 'New Lesson Available',
      message: 'A new Yoruba lesson has been added to your course!',
      type: 'course',
      isRead: false,
      link: `/courses/${courses[0]._id}`,
    },
    {
      userId: demoUser._id,
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You\'ve completed your first lesson.',
      type: 'achievement',
      isRead: false,
      link: '/learning-progress',
    },
    {
      userId: demoUser._id,
      title: 'Community Update',
      message: 'Someone replied to your post in Yoruba Learners.',
      type: 'community',
      isRead: false,
      link: '/community',
    },
  ];

  for (const notificationData of notifications) {
    await Notification.create(notificationData);
  }
  console.log('✅ Seeded notifications');
};

// Main seed function
export const seedDemoData = async () => {
  try {
    console.log('🌱 Starting demo data seeding...\n');

    // Seed courses
    const courses = await seedCourses();
    
    // Seed lessons
    const lessons = await seedLessons(courses);
    
    // Seed channels
    const channels = await seedChannels();
    
    // Create demo user
    const demoUser = await createDemoUser();
    
    // Add demo user to some channels and seed fake members for varied counts
    await seedChannelMembers(channels, demoUser);

    // Seed demo user data
    await seedDemoProgress(demoUser, courses, lessons);
    await seedCommunityPosts(demoUser, channels);
    await seedChatHistory(demoUser);
    await seedQuizzes(demoUser, courses, lessons);
    await seedNotifications(demoUser, courses);

    console.log('\n✅ Demo data seeding completed successfully!');
    console.log('\n📝 Demo Account Credentials:');
    console.log('   Email: demo@linguafrika.com');
    console.log('   Password: Demo123!');
    console.log('\n🚀 You can now log in with these credentials to see the demo!');
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
};

// Clear demo data
export const clearDemoData = async () => {
  try {
    console.log('🧹 Clearing demo data...\n');

    const demoUser = await User.findOne({ email: 'demo@linguafrika.com' });
    
    if (demoUser) {
      // Delete all demo user related data
      await Progress.deleteMany({ userId: demoUser._id });
      await ChatMessage.deleteMany({ userId: demoUser._id });
      await QuizAttempt.deleteMany({ userId: demoUser._id });
      await Notification.deleteMany({ userId: demoUser._id });
      
      // Delete posts and replies by demo user
      const posts = await Post.find({ userId: demoUser._id });
      for (const post of posts) {
        await Reply.deleteMany({ postId: post._id });
        await Channel.findByIdAndUpdate(post.channelId, {
          $inc: { posts: -1 },
        });
      }
      await Post.deleteMany({ userId: demoUser._id });
      
      // Delete demo user
      await User.findByIdAndDelete(demoUser._id);
      
      console.log('✅ Demo user and all related data cleared');
    } else {
      console.log('⚠️  No demo user found');
    }
  } catch (error) {
    console.error('❌ Error clearing demo data:', error);
    throw error;
  }
};


