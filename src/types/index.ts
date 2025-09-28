export type FilterPeriod = 'today' | 'week' | 'month';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "staff";
  companyId?: number | null;
  avatar?: string;
}

export interface StaffUser extends User {
  workStartTime: Date;
  hoursToday: string;
  hoursWeek: string;
  hoursMonth: string;
  presence: "active" | "inactive";
  status: "online" | "offline";
  latestWorkLog: {
    loginTime: string;
    logoutTime: string | null;
  };
  lastSeen: string;
  department: string;
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
  companyId?: number;
  companyName?: string;
}
