export type RequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Request {
  id: string | number;
  title: string;
  description: string;
  status: RequestStatus;
  priority: Priority;
  category: string;
  requester: string;
  creationDate: string;
  lastChangeDate: string;
}

export interface RequestCreateInput {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  requester: string;
}

export interface RequestUpdateInput {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: string;
  status?: RequestStatus;
}
