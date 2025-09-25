export type FilterPeriod = 'today' | 'week' | 'month';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
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
  role: "admin" | "staff";
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface CreateStaffForm {
  firstName: string;
  lastName: string;
  email: string;
  role: 'staff' | 'admin';
  password: string;
  confirmPassword: string;
}
