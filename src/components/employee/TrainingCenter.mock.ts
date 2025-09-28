import { Course, Lesson, UserProgress, Certification, LearningPath, User } from '../types/trainingCenter';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    role: 'employee',
  },
  {
    id: 'user-2',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'manager',
  },
  {
    id: 'user-3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'admin',
  },
];

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-101',
    title: 'Introduction to React',
    content: 'This lesson covers the basics of React, including components, props, and state.',
    videoUrl: 'https://example.com/video/react-intro',
    duration: 30,
    order: 1,
  },
  {
    id: 'lesson-102',
    title: 'Understanding React Hooks',
    content: 'Dive deep into useState, useEffect, and other essential React Hooks.',
    videoUrl: 'https://example.com/video/react-hooks',
    duration: 45,
    order: 2,
  },
  {
    id: 'lesson-103',
    title: 'Styling with Tailwind CSS',
    content: 'Learn how to effectively style your React applications using Tailwind CSS.',
    videoUrl: 'https://example.com/video/tailwind-css',
    duration: 60,
    order: 3,
  },
  {
    id: 'lesson-201',
    title: 'Advanced TypeScript Features',
    content: 'Explore advanced TypeScript concepts like generics, utility types, and decorators.',
    videoUrl: 'https://example.com/video/typescript-advanced',
    duration: 50,
    order: 1,
  },
  {
    id: 'lesson-202',
    title: 'Type-Safe React Components',
    content: 'Apply TypeScript to build robust and type-safe React components.',
    videoUrl: 'https://example.com/video/typescript-react',
    duration: 40,
    order: 2,
  },
  {
    id: 'lesson-301',
    title: 'Introduction to Node.js',
    content: 'Get started with server-side JavaScript using Node.js and Express.',
    videoUrl: 'https://example.com/video/nodejs-intro',
    duration: 75,
    order: 1,
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'React Development Fundamentals',
    description: 'A beginner-friendly course to get started with React and modern web development.',
    category: 'Frontend Development',
    difficulty: 'Beginner',
    duration: 3, // 3 hours
    lessons: [mockLessons[0], mockLessons[1], mockLessons[2]],
    prerequisites: [],
    imageUrl: 'https://example.com/images/react-fundamentals.png',
    isPublished: true,
  },
  {
    id: 'course-2',
    title: 'Mastering TypeScript for Web Developers',
    description: 'An in-depth course covering TypeScript from basics to advanced patterns.',
    category: 'Programming Languages',
    difficulty: 'Intermediate',
    duration: 2.5, // 2.5 hours
    lessons: [mockLessons[3], mockLessons[4]],
    prerequisites: ['course-1'],
    imageUrl: 'https://example.com/images/typescript-mastery.png',
    isPublished: true,
  },
  {
    id: 'course-3',
    title: 'Backend Development with Node.js',
    description: 'Learn to build scalable backend APIs using Node.js, Express, and databases.',
    category: 'Backend Development',
    difficulty: 'Advanced',
    duration: 4, // 4 hours
    lessons: [mockLessons[5]],
    prerequisites: ['course-2'],
    imageUrl: 'https://example.com/images/nodejs-backend.png',
    isPublished: false,
  },
  {
    id: 'course-4',
    title: 'Introduction to Cloud Computing',
    description: 'Understand the fundamentals of cloud platforms like AWS, Azure, and GCP.',
    category: 'Cloud & DevOps',
    difficulty: 'Beginner',
    duration: 2,
    lessons: [],
    prerequisites: [],
    imageUrl: 'https://example.com/images/cloud-intro.png',
    isPublished: true,
  },
];

export const mockUserProgress: UserProgress[] = [
  {
    userId: 'user-1',
    courseId: 'course-1',
    lessonId: 'lesson-101',
    completed: true,
    completionDate: '2025-09-01T10:00:00Z',
  },
  {
    userId: 'user-1',
    courseId: 'course-1',
    lessonId: 'lesson-102',
    completed: false,
  },
  {
    userId: 'user-2',
    courseId: 'course-1',
    lessonId: 'lesson-101',
    completed: true,
    completionDate: '2025-09-05T14:30:00Z',
  },
  {
    userId: 'user-2',
    courseId: 'course-2',
    lessonId: 'lesson-201',
    completed: true,
    completionDate: '2025-09-10T09:00:00Z',
  },
];

export const mockCertifications: Certification[] = [
  {
    id: 'cert-1',
    userId: 'user-1',
    courseId: 'course-1',
    issueDate: '2025-09-15T11:00:00Z',
    certificateUrl: 'https://example.com/certificates/cert-1.pdf',
  },
  {
    id: 'cert-2',
    userId: 'user-2',
    courseId: 'course-2',
    issueDate: '2025-09-20T16:00:00Z',
    expiryDate: '2026-09-20T16:00:00Z',
    certificateUrl: 'https://example.com/certificates/cert-2.pdf',
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'lp-1',
    title: 'Frontend Developer Career Path',
    description: 'A structured path to become a professional frontend developer.',
    courses: [mockCourses[0], mockCourses[1]],
    isPublic: true,
  },
  {
    id: 'lp-2',
    title: 'Fullstack JavaScript Developer',
    description: 'Master both frontend and backend development with JavaScript.',
    courses: [mockCourses[0], mockCourses[1], mockCourses[2]],
    isPublic: false,
  },
];
