import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Filter,
  RefreshCw,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

interface StaffProductivityData {
  name: string;
  hoursWorked: number;
  activeTime: number;
  breakTime: number;
  efficiency: number;
  department: string;
}

interface TimeDistributionData {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  date: string;
  totalHours: number;
  averageHours: number;
}

interface ReportsPageProps {
  onBack: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onBack }) => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Sample data
  const staffProductivityData: StaffProductivityData[] = [
    { name: 'Mubarak', hoursWorked: 38.5, activeTime: 32.2, breakTime: 6.3, efficiency: 84, department: 'Development' },
    { name: 'Fatima', hoursWorked: 42.0, activeTime: 37.8, breakTime: 4.2, efficiency: 90, department: 'Design' },
    { name: 'Ahmed', hoursWorked: 35.2, activeTime: 29.8, breakTime: 5.4, efficiency: 85, department: 'Development' },
    { name: 'Zainab', hoursWorked: 40.8, activeTime: 36.1, breakTime: 4.7, efficiency: 88, department: 'Marketing' },
    { name: 'Omar', hoursWorked: 33.6, activeTime: 28.9, breakTime: 4.7, efficiency: 86, department: 'Sales' }
  ];

  const timeDistributionData: TimeDistributionData[] = [
    { name: 'Active Work', value: 164.8, color: '#3B82F6' },
    { name: 'Meetings', value: 28.5, color: '#8B5CF6' },
    { name: 'Breaks', value: 25.3, color: '#F59E0B' },
    { name: 'Training', value: 12.4, color: '#10B981' },
    { name: 'Admin Tasks', value: 9.8, color: '#EF4444' }
  ];

  const trendData: TrendData[] = [
    { date: '03/14', totalHours: 185.2, averageHours: 37.0 },
    { date: '03/15', totalHours: 198.5, averageHours: 39.7 },
    { date: '03/16', totalHours: 176.8, averageHours: 35.4 },
    { date: '03/17', totalHours: 203.1, averageHours: 40.6 },
    { date: '03/18', totalHours: 189.7, averageHours: 37.9 },
    { date: '03/19', totalHours: 195.3, averageHours: 39.1 },
    { date: '03/20', totalHours: 210.4, averageHours: 42.1 }
  ];

  const departments = ['all', 'Development', 'Design', 'Marketing', 'Sales'];

  const filteredData = selectedDepartment === 'all' 
    ? staffProductivityData 
    : staffProductivityData.filter(staff => staff.department === selectedDepartment);

  const totalHours = filteredData.reduce((sum, staff) => sum + staff.hoursWorked, 0);
  const averageHours = totalHours / filteredData.length;
  const totalActiveTime = filteredData.reduce((sum, staff) => sum + staff.activeTime, 0);
  // const totalBreakTime = filteredData.reduce((sum, staff) => sum + staff.breakTime, 0);
  const averageEfficiency = filteredData.reduce((sum, staff) => sum + staff.efficiency, 0) / filteredData.length;

  const handleExport = async () => {
    setIsExporting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (exportFormat === 'csv') {
      const csvContent = [
        'Staff Name,Hours Worked,Active Time,Break Time,Efficiency %,Department',
        ...filteredData.map(staff => 
          `${staff.name},${staff.hoursWorked},${staff.activeTime},${staff.breakTime},${staff.efficiency},${staff.department}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productivity-report-${dateRange}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.log('PDF export would be implemented here');
      alert('PDF export functionality would be integrated with a PDF library like jsPDF');
    }
    
    setIsExporting(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.name.includes('Hours') || entry.name.includes('Time') ? 'h' : 
               entry.name.includes('Efficiency') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                ←
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Productivity Reports</h1>
                  <p className="text-gray-600 text-sm">Analytics and insights for your team</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">All Departments</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'quarter')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'csv')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
                
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.3%</span>
              <span className="text-gray-600 ml-1">from last {dateRange}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Hours</p>
                <p className="text-2xl font-bold text-indigo-600">{averageHours.toFixed(1)}h</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8.7%</span>
              <span className="text-gray-600 ml-1">from last {dateRange}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Efficiency</p>
                <p className="text-2xl font-bold text-green-600">{averageEfficiency.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+5.2%</span>
              <span className="text-gray-600 ml-1">from last {dateRange}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Time</p>
                <p className="text-2xl font-bold text-purple-600">{(totalActiveTime/totalHours*100).toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-500">-2.1%</span>
              <span className="text-gray-600 ml-1">from last {dateRange}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Weekly Hours by Staff</h2>
              <p className="text-gray-600 text-sm">Individual productivity breakdown</p>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="hoursWorked" 
                  name="Total Hours"
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="activeTime" 
                  name="Active Time"
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Time Distribution</h2>
              <p className="text-gray-600 text-sm">How time is spent across activities</p>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {timeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}h`, 'Hours']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Productivity Trend</h2>
            <p className="text-gray-600 text-sm">Daily productivity over the selected period</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalHours" 
                name="Total Hours"
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="averageHours" 
                name="Average Hours"
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Detailed Staff Report</h2>
            <p className="text-gray-600 text-sm">Complete breakdown of individual performance</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff Member</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Hours</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Active Time</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Break Time</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((staff) => (
                  <tr key={staff.name} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {staff.name[0]}
                        </div>
                        <span className="font-medium text-gray-800">{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {staff.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      {staff.hoursWorked}h
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-medium">
                      {staff.activeTime}h
                    </td>
                    <td className="px-6 py-4 text-right text-orange-600 font-medium">
                      {staff.breakTime}h
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${staff.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{staff.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
export default ReportsPage;