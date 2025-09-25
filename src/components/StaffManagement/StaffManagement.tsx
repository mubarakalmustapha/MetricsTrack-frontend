import React, { useState } from 'react';
import Header from './Header';
import CreateStaffModal from './CreateStaffModal';
import StaffList from './StaffList';
import ConfirmationModal from './ConfirmationModal';
import ChangePasswordModal from './ChangePasswordModal';

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

type ActionType = 'reset' | 'deactivate' | 'activate' | null;

const StaffManagement: React.FC<StaffManagementProps> = ({ onBack }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [staffToChange, setStaffToChange] = useState<StaffMember | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<CreateStaffForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const [formData, setFormData] = useState<CreateStaffForm>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'staff',
    password: '',
    confirmPassword: ''
  });


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

  const handleStaffAction = (staffId: string, action: 'reset' | 'deactivate' | 'activate') => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return;

    if (action === 'reset') {
      setStaffToChange(staff);
      setShowChangePassword(true);
    } else {
      setSelectedStaff(staffId);
      setActionType(action);
    }
  };

  const confirmAction = () => {
    if (!selectedStaff || !actionType) return;

    switch (actionType) {
      case 'deactivate':
        setStaffList(prev =>
          prev.map(staff =>
            staff.id === selectedStaff
              ? { ...staff, status: 'inactive' }
              : staff
          )
        );
        break;

      case 'activate':
        setStaffList(prev =>
          prev.map(staff =>
            staff.id === selectedStaff
              ? { ...staff, status: 'active' }
              : staff
          )
        );
        break;
      default:
        break;
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
      <Header onBack={onBack} setShowCreateForm={setShowCreateForm} />
      <main className="max-w-7xl mx-auto px-6 py-8">
       <CreateStaffModal
          show={showCreateForm}
          setShow={setShowCreateForm}
          formData={formData}
          formErrors={formErrors}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          setShowPassword={setShowPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
       <StaffList
          filteredStaff={filteredStaff}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleStaffAction={handleStaffAction}
        />
      </main>
      <ConfirmationModal
        selectedStaff={selectedStaff}
        actionType={actionType}
        cancelAction={cancelAction}
        confirmAction={confirmAction}
      />
      <ChangePasswordModal
        staffName={staffToChange?.firstName || ''}
        show={showChangePassword}
        setShow={setShowChangePassword}
        onConfirm={(newPassword) => {
          console.log(`Password changed for ${staffToChange?.id}:`, newPassword);
          setStaffToChange(null);
        }}
      />
    </div>
  );
};

export default StaffManagement;