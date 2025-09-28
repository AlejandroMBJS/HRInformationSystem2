import { User, FeedbackItem, ReviewCycle, RecognitionAward } from './types/feedbackTypes';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'employee',
  },
  {
    id: 'user-2',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    role: 'manager',
  },
  {
    id: 'user-3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    role: 'employee',
  },
  {
    id: 'user-4',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    role: 'admin',
  },
];

export const mockReviewCycles: ReviewCycle[] = [
  {
    id: 'cycle-1',
    name: 'Q3 2024 Performance Review',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-09-30T23:59:59Z',
    status: 'active',
    participants: ['user-1', 'user-2', 'user-3'],
    feedbackItems: [], // Will be populated by feedback items
  },
  {
    id: 'cycle-2',
    name: 'Q2 2024 Performance Review',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-06-30T23:59:59Z',
    status: 'closed',
    participants: ['user-1', 'user-2', 'user-3', 'user-4'],
    feedbackItems: [],
  },
];

export const mockFeedbackItems: FeedbackItem[] = [
  {
    id: 'feedback-1',
    reviewerId: 'user-2',
    revieweeId: 'user-1',
    cycleId: 'cycle-1',
    type: '360_review',
    rating: 4,
    comment: 'Alice consistently delivers high-quality work and is a great team player. Needs to improve on proactive communication.',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-15T10:00:00Z',
    status: 'submitted',
    tags: ['performance', 'teamwork'],
  },
  {
    id: 'feedback-2',
    reviewerId: 'user-3',
    revieweeId: 'user-1',
    cycleId: 'cycle-1',
    type: 'peer_feedback',
    rating: 5,
    comment: 'Alice helped me a lot with the recent project. Her problem-solving skills are excellent.',
    createdAt: '2024-08-20T11:30:00Z',
    updatedAt: '2024-08-20T11:30:00Z',
    status: 'submitted',
    tags: ['collaboration', 'support'],
  },
  {
    id: 'feedback-3',
    reviewerId: 'user-1',
    revieweeId: 'user-2',
    cycleId: 'cycle-1',
    type: '360_review',
    rating: 5,
    comment: 'Bob is an exceptional manager, always providing clear guidance and support.',
    createdAt: '2024-08-18T09:00:00Z',
    updatedAt: '2024-08-18T09:00:00Z',
    status: 'submitted',
    tags: ['leadership', 'mentorship'],
  },
  {
    id: 'feedback-4',
    reviewerId: 'user-4',
    revieweeId: 'user-3',
    cycleId: 'cycle-2',
    type: '360_review',
    rating: 3,
    comment: 'Charlie is good at his tasks but sometimes struggles with deadlines. Needs to improve time management.',
    createdAt: '2024-05-25T14:00:00Z',
    updatedAt: '2024-05-25T14:00:00Z',
    status: 'submitted',
    tags: ['performance', 'time_management'],
  },
  {
    id: 'feedback-5',
    reviewerId: 'user-1',
    revieweeId: 'user-3',
    cycleId: 'cycle-1',
    type: 'peer_feedback',
    comment: 'Charlie provided valuable insights during our last brainstorming session.',
    createdAt: '2024-08-22T16:00:00Z',
    updatedAt: '2024-08-22T16:00:00Z',
    status: 'draft',
    tags: ['creativity'],
  },
];

export const mockRecognitionAwards: RecognitionAward[] = [
  {
    id: 'award-1',
    giverId: 'user-2',
    receiverId: 'user-1',
    awardType: 'Spot Award',
    message: 'For outstanding contribution to Project X!',
    givenAt: '2024-08-01T10:00:00Z',
  },
  {
    id: 'award-2',
    giverId: 'user-4',
    receiverId: 'user-2',
    awardType: 'Innovation Award',
    message: 'For pioneering the new feedback system architecture.',
    givenAt: '2024-07-10T15:00:00Z',
  },
];

// Populate feedbackItems in review cycles
mockReviewCycles[0].feedbackItems.push('feedback-1', 'feedback-2', 'feedback-3', 'feedback-5');
mockReviewCycles[1].feedbackItems.push('feedback-4');
