import React, { useState } from 'react';
import type { StaffUser, User, ChatMessage, FilterPeriod } from '../../types/index';
import Header from './Header';
import StaffTable from './StaffTable';
import AIChatPanel from './AIChatPanel';
import { AIService } from '../../services/aiService';
import popSound from "../../assets/sounds/pop.mp3";
import notificationSound from "../../assets/sounds/notification.mp3";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [staffData] = useState<StaffUser[]>([
    {
      id: 1,
      firstName: "Mubarak",
      lastName: "Almustapha",
      email: "mubarak@company.com",
      role: "staff",
      avatar: "M",
      workStartTime: new Date("2025-09-27T09:05:00"),
      hoursToday: "3h 20m",
      hoursWeek: "15h 40m",
      hoursMonth: "68h 15m",
      presence: "active",
      status: "online",
      latestWorkLog: { loginTime: "9:05 AM", logoutTime: null },
      lastSeen: "Now",
      department: "Development",
    },
    {
      id: 2,
      firstName: "Fatima",
      lastName: "Yusuf",
      email: "fatima@company.com",
      role: "staff",
      avatar: "F",
      workStartTime: new Date("2025-09-27T08:30:00"),
      hoursToday: "6h 00m",
      hoursWeek: "28h 10m",
      hoursMonth: "112h 30m",
      presence: "inactive",
      status: "offline",
      latestWorkLog: { loginTime: "9:00 AM", logoutTime: "5:30 PM" },
      lastSeen: "5:30 PM",
      department: "Design",
    },
    {
      id: 3,
      firstName: "Ahmed",
      lastName: "Kareem",
      email: "ahmed@company.com",
      role: "staff",
      avatar: "A",
      workStartTime: new Date("2025-09-27T08:30:00"),
      hoursToday: "4h 15m",
      hoursWeek: "22h 30m",
      hoursMonth: "89h 45m",
      presence: "active",
      status: "online",
      latestWorkLog: { loginTime: "8:30 AM", logoutTime: null },
      lastSeen: "Now",
      department: "Development",
    },
    {
      id: 4,
      firstName: "Zainab",
      lastName: "Ali",
      email: "zainab@company.com",
      role: "staff",
      avatar: "Z",
      workStartTime: new Date("2025-09-27T09:00:00"),
      hoursToday: "7h 45m",
      hoursWeek: "35h 20m",
      hoursMonth: "140h 10m",
      presence: "inactive",
      status: "offline",
      latestWorkLog: { loginTime: "9:00 AM", logoutTime: "6:15 PM" },
      lastSeen: "6:15 PM",
      department: "Marketing",
    },
    {
      id: 5,
      firstName: "Omar",
      lastName: "Suleiman",
      email: "omar@company.com",
      role: "staff",
      avatar: "O",
      workStartTime: new Date("2025-09-27T09:15:00"),
      hoursToday: "2h 50m",
      hoursWeek: "18h 25m",
      hoursMonth: "75h 30m",
      presence: "active",
      status: "online",
      latestWorkLog: { loginTime: "9:15 AM", logoutTime: null },
      lastSeen: "Now",
      department: "Sales",
    }
  ]);

  const onlineCount = staffData.filter(s => s.status === 'online').length;
  const totalStaff = staffData.length;
  const weekTotalHours = staffData.reduce((total, staff) => {
    return total + AIService.parseTime(staff.hoursWeek);
  }, 0);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    popAudio.play();

    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    setTimeout(() => {
      const aiResponse = AIService.processQuery(input, staffData);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setIsAiTyping(false);
      setMessages(prev => [...prev, aiMessage]);

      notificationAudio.play();
    }, 1500);

    setInput('');
  };

  const handleLogout = () => {
    if (showLogoutConfirm) {
      onLogout();
    } else {
      setShowLogoutConfirm(true);
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  const sampleQuestions = [
    "How many hours did Mubarak work this week?",
    "Who worked the most hours yesterday?",
    "Which staff took the longest break this month?",
    "Show me productivity by department",
    "Who is currently online?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        user={user}
        onlineCount={onlineCount}
        totalStaff={totalStaff}
        weekTotalHours={AIService.formatTime(weekTotalHours)}
        showLogoutConfirm={showLogoutConfirm}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StaffTable
              staff={staffData}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterPeriod={filterPeriod}
              onFilterChange={setFilterPeriod}
            />
          </div>

          <div className="lg:col-span-1">
            <AIChatPanel
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              isAiTyping={isAiTyping}
              sampleQuestions={sampleQuestions}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
