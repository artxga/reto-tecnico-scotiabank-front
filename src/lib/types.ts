export const REQUEST_STATUSES = ["pending", "in_review", "approved", "rejected", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CATEGORIES = [
  "hardware",
  "access",
  "software",
  "infrastructure",
  "human_resources",
  "others",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Request {
  id: string | number;
  title: string;
  description: string;
  status: RequestStatus;
  priority: Priority;
  category: Category;
  requester: string;
  creationDate: string;
  lastChangeDate: string;
}

export interface RequestCreateInput {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  requester: string;
}

export interface RequestUpdateInput {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  status?: RequestStatus;
}
