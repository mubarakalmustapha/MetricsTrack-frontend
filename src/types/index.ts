export type FilterPeriod = 'today' | 'week' | 'month';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline';
  workStartTime?: string;
  hoursToday: string;
  hoursWeek: string;
  hoursMonth: string;
  lastSeen?: string;
  department: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
