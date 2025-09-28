export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in hours
  lessons: Lesson[];
  prerequisites: string[];
  imageUrl: string;
  isPublished: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown content
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completionDate?: string; // ISO date string
}

export interface Certification {
  id: string;
  userId: string;
  courseId: string;
  issueDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  certificateUrl: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  isPublic: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
}

export interface FilterOptions {
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  search?: string;
  sortBy?: 'title' | 'difficulty' | 'duration';
  sortOrder?: 'asc' | 'desc';
}
