export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "employee" | "manager" | "admin";
}

export interface FeedbackItem {
  id: string;
  reviewerId: string;
  revieweeId: string;
  cycleId: string;
  type: "360_review" | "peer_feedback" | "recognition";
  rating?: number; // For 360 reviews, e.g., 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "submitted" | "anonymous" | "published";
  tags?: string[];
}

export interface ReviewCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "not_started" | "active" | "closed" | "archived";
  participants: string[]; // Array of user IDs
  feedbackItems: string[]; // Array of feedback item IDs
}

export interface RecognitionAward {
  id: string;
  giverId: string;
  receiverId: string;
  awardType: string; // e.g., "Spot Award", "Innovation Award"
  message: string;
  givenAt: string;
}

export interface FilterOptions {
  reviewerId?: string;
  revieweeId?: string;
  cycleId?: string;
  type?: "360_review" | "peer_feedback" | "recognition";
  status?: "draft" | "submitted" | "anonymous" | "published";
  startDate?: string;
  endDate?: string;
}

export interface SortOptions {
  field: "createdAt" | "updatedAt" | "rating" | "name";
  direction: "asc" | "desc";
}
