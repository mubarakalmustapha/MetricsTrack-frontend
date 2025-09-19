import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Edit, 
  Trash2, 
  Key, 
  UserX, 
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Mail,
  Shield,
  Calendar
} from 'lucide-react';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'staff' | 'admin';
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
}

interface CreateStaffForm {
  firstName: string;
  lastName: string;
  email: string;
  role: 'staff' | 'admin';
  password: string;
  confirmPassword: string;
}

interface StaffManagementProps {
  onBack: () => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ onBack }) => {
  // const [activeTab, setActiveTab] = useState<'create' | 'manage'>('manage');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'reset' | 'deactivate' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateStaffForm>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'staff',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateStaffForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample staff data
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: '1',
      firstName: 'Mubarak',
      lastName: 'Johnson',
      email: 'mubarak@company.com',
      role: 'staff',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-03-20')
    },
    {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Al-Rashid',
      email: 'fatima@company.com',
      role: 'staff',
      status: 'active',
      createdAt: new Date('2024-02-01'),
      lastLogin: new Date('2024-03-19')
    },
    {
      id: '3',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed@company.com',
      role: 'staff',
      status: 'active',
      createdAt: new Date('2024-02-15'),
      lastLogin: new Date('2024-03-20')
    },
    {
      id: '4',
      firstName: 'Zainab',
      lastName: 'Mohamed',
      email: 'zainab@company.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-03-20')
    },
    {
      id: '5',
      firstName: 'Omar',
      lastName: 'Ali',
      email: 'omar@company.com',
      role: 'staff',
      status: 'inactive',
      createdAt: new Date('2024-03-01'),
      lastLogin: new Date('2024-03-10')
    }
  ]);

  const handleInputChange = (field: keyof CreateStaffForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateStaffForm> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    } else if (staffList.some(staff => staff.email === formData.email)) {
      errors.email = 'Email already exists';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      status: 'active',
      createdAt: new Date(),
      lastLogin: undefined
    };
    
    setStaffList(prev => [newStaff, ...prev]);

    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'staff',
      password: '',
      confirmPassword: ''
    });
    
    setIsSubmitting(false);
    setShowCreateForm(false);
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStaffAction = (staffId: string, action: 'reset' | 'deactivate') => {
    setSelectedStaff(staffId);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedStaff || !actionType) return;
    
    if (actionType === 'deactivate') {
      setStaffList(prev => 
        prev.map(staff => 
          staff.id === selectedStaff 
            ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' }
            : staff
        )
      );
    } else if (actionType === 'reset') {
      console.log('Password reset for staff:', selectedStaff);
    }
    
    setSelectedStaff(null);
    setActionType(null);
  };

  const cancelAction = () => {
    setSelectedStaff(null);
    setActionType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                  <p className="text-gray-600 text-sm">Create and manage staff accounts</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Staff</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Staff Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Create New Staff Account</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value as 'staff' | 'admin')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Staff Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Staff List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {/* List Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Staff Members</h2>
                <p className="text-gray-600 text-sm">Manage your team members</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                  />
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff Member</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Login</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {staff.firstName[0]}{staff.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-xs text-gray-600">{staff.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        staff.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {staff.role === 'admin' ? (
                          <><Shield className="w-3 h-3 mr-1" /> Admin</>
                        ) : (
                          'Staff'
                        )}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        staff.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {staff.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {staff.lastLogin 
                          ? staff.lastLogin.toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleStaffAction(staff.id, 'reset')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStaffAction(staff.id, 'deactivate')}
                          className={`p-2 rounded-lg transition-colors ${
                            staff.status === 'active'
                              ? 'text-red-600 hover:bg-red-100'
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={staff.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {staff.status === 'active' ? <UserX className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {selectedStaff && actionType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {actionType === 'reset' ? 'Reset Password' : 'Change Status'}
            </h3>
            <p className="text-gray-600 mb-6">
              {actionType === 'reset' 
                ? 'Are you sure you want to reset this staff member\'s password? They will receive an email with reset instructions.'
                : 'Are you sure you want to change this staff member\'s status?'
              }
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'reset' 
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'reset' ? 'Reset Password' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StaffManagement;