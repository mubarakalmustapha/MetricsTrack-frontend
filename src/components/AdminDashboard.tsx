import React, { useEffect, useRef, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Search, 
  BarChart3, 
  LogOut, 
  Bot
} from 'lucide-react';

interface StaffMember {
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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const messagesEndRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const [staffData] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Mubarak',
      email: 'mubarak@company.com',
      avatar: 'M',
      status: 'online',
      workStartTime: '9:05 AM',
      hoursToday: '3h 20m',
      hoursWeek: '15h 40m',
      hoursMonth: '68h 15m',
      department: 'Development'
    },
    {
      id: '2',
      name: 'Fatima',
      email: 'fatima@company.com',
      avatar: 'F',
      status: 'offline',
      hoursToday: '6h 00m',
      hoursWeek: '28h 10m',
      hoursMonth: '112h 30m',
      lastSeen: '5:30 PM',
      department: 'Design'
    },
    {
      id: '3',
      name: 'Ahmed',
      email: 'ahmed@company.com',
      avatar: 'A',
      status: 'online',
      workStartTime: '8:30 AM',
      hoursToday: '4h 15m',
      hoursWeek: '22h 30m',
      hoursMonth: '89h 45m',
      department: 'Development'
    },
    {
      id: '4',
      name: 'Zainab',
      email: 'zainab@company.com',
      avatar: 'Z',
      status: 'offline',
      hoursToday: '7h 45m',
      hoursWeek: '35h 20m',
      hoursMonth: '140h 10m',
      lastSeen: '6:15 PM',
      department: 'Marketing'
    },
    {
      id: '5',
      name: 'Omar',
      email: 'omar@company.com',
      avatar: 'O',
      status: 'online',
      workStartTime: '9:15 AM',
      hoursToday: '2h 50m',
      hoursWeek: '18h 25m',
      hoursMonth: '75h 30m',
      department: 'Sales'
    }
  ]);

  const filteredStaff = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHours = (staff: StaffMember): string => {
    switch (filterPeriod) {
      case 'today': return staff.hoursToday;
      case 'week': return staff.hoursWeek;
      case 'month': return staff.hoursMonth;
      default: return staff.hoursToday;
    }
  };

  const handleAiSubmit = () => {
    if (!aiInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: aiInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    function parseTime(time: string): number {
      if (!time) return 0;
      const match = time.match(/(\d+)h\s*(\d+)?m?/);
      const hours = match ? parseInt(match[1]) : 0;
      const minutes = match && match[2] ? parseInt(match[2]) : 0;
      return hours * 60 + minutes;
    }

    function formatTime(totalMinutes: number): string {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}h ${m}m`;
    }


    setTimeout(() => {
      let aiResponse = "";
      const input = aiInput.toLowerCase();

      if (input.includes("hours") && input.includes("week")) {
        const name = staffData.find(staff =>
          input.includes(staff.name.toLowerCase())
        );
        if (name) {
          aiResponse = `${name.name} has worked **${name.hoursWeek}** this week. Currently they are **${name.status}** ${
            name.status === "online" ? `(started at ${name.workStartTime})` : `(last seen ${name.lastSeen})`
          }.`;
        } else {
          aiResponse = "Please specify a valid staff name.";
        }

      } else if (input.includes("most hours") || input.includes("worked the most")) {
        const top = [...staffData].sort((a, b) =>
          parseTime(b.hoursWeek) - parseTime(a.hoursWeek)
        )[0];
        aiResponse = `This week, **${top.name}** worked the most with **${top.hoursWeek}**.`;

      } else if (input.includes("online") || input.includes("working now")) {
        const onlineStaff = staffData.filter(s => s.status === "online");
        if (onlineStaff.length > 0) {
          aiResponse = `Currently **${onlineStaff.length} staff** are online:\n` +
            onlineStaff.map(s => `• **${s.name}** - started at ${s.workStartTime} (${s.hoursToday} today)`).join("\n");
        } else {
          aiResponse = "No staff are online right now.";
        }

      } else if (input.includes("department") || input.includes("team")) {
        const deptSummary: Record<string, number> = {};
        staffData.forEach(s => {
          deptSummary[s.department] =
            (deptSummary[s.department] || 0) + parseTime(getHours(s));
        });
        aiResponse = "Department breakdown:\n" + 
          Object.entries(deptSummary)
            .map(([dept, minutes]) => `• **${dept}**: ${formatTime(minutes)}`)
            .join("\n");

      } else {
        aiResponse = "I can help you analyze staff productivity, work hours, and attendance. Try asking:\n\n• Who worked the most this week?\n• How many hours did [staff] work today?\n• Who is currently online?\n• Show me productivity by department";
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setIsAiTyping(false);
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);


    setAiInput('');
  };

  const handleLogout = () => {
    if (showLogoutConfirm) {
      onLogout();
    } else {
      setShowLogoutConfirm(true);
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  // Sample suggestions for AI chat
  const sampleQuestions = [
    "How many hours did Mubarak work this week?",
    "Who worked the most hours yesterday?",
    "Which staff took the longest break this month?",
    "Show me productivity by department",
    "Who is currently online?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Welcome back, {user.name}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">3</p>
                <p className="text-xs text-gray-600">Online</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-xs text-gray-600">Total Staff</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">119h</p>
                <p className="text-xs text-gray-600">Week Total</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                showLogoutConfirm 
                  ? 'bg-red-600 text-white transform scale-105' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span>{showLogoutConfirm ? 'Confirm Logout' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Staff Overview</h2>
                      <p className="text-gray-600 text-sm">Real-time monitoring and analytics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">

                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      {['today', 'week', 'month'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setFilterPeriod(period as any)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            filterPeriod === period
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Staff Member
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Hours {filterPeriod === 'today' ? 'Today' : filterPeriod === 'week' ? 'This Week' : 'This Month'}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Department
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-blue-50/50 transition-colors">
                       
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {staff.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{staff.name}</p>
                              <p className="text-xs text-gray-600">{staff.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                staff.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                              }`}></div>
                              <span className={`text-sm font-medium ${
                                staff.status === 'online' ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {staff.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                              </span>
                            </div>
                            {staff.workStartTime && (
                              <p className="text-xs text-gray-500">Since {staff.workStartTime}</p>
                            )}
                            {staff.lastSeen && staff.status === 'offline' && (
                              <p className="text-xs text-gray-500">Last seen {staff.lastSeen}</p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-gray-800">{getHours(staff)}</span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {staff.department}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 h-fit">
              
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
                    <p className="text-gray-600 text-sm">Ask about staff productivity</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="font-medium mb-4">Ask me anything about your team!</p>
                    <div className="space-y-2 text-xs">
                      {sampleQuestions.slice(0, 3).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setAiInput(question)}
                          className="block w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          💡 {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                       <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm ${
                          message.isUser
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}>
                          {message.text.includes('**') ? (
                            <div dangerouslySetInnerHTML={{
                              __html: message.text
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br>')
                            }} />
                          ) : (
                            message.text
                          )}
                          <div className={`text-xs mt-1 ${
                            message.isUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div ref={messagesEndRef} />
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiSubmit()}
                    placeholder="Ask AI about staff productivity..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleAiSubmit}
                    disabled={!aiInput.trim() || isAiTyping}
                    className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;