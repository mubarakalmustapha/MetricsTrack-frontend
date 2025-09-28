import React, { useState } from "react";
import Header from "./Header";
import CreateStaffModal from "./CreateStaffModal";
import StaffList from "./StaffList";
import ConfirmationModal from "./ConfirmationModal";
import ChangePasswordModal from "./ChangePasswordModal";
import type { User, StaffUser } from "../../types/index";

interface CreateStaffForm {
  firstName: string;
  lastName: string;
  email: string;
  role: "staff" | "admin";
  password: string;
  confirmPassword: string;
}

interface StaffManagementProps {
  onBack: () => void;
}

type ActionType = "reset" | "deactivate" | "activate" | null;

const StaffManagement: React.FC<StaffManagementProps> = ({ onBack }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [staffToChange, setStaffToChange] = useState<User | StaffUser | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<CreateStaffForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [staffList, setStaffList] = useState<(User | StaffUser)[]>([
    {
      id: 1,
      firstName: "Mubarak",
      lastName: "Johnson",
      email: "mubarak@company.com",
      role: "staff",
      companyId: 101,
      avatar: "M",
      workStartTime: new Date("2024-09-27T09:05:00"),
      hoursToday: "3h 20m",
      hoursWeek: "15h 40m",
      hoursMonth: "68h 15m",
      presence: "active",
      status: "online",
      latestWorkLog: { loginTime: "9:05 AM", logoutTime: null },
      lastSeen: "—",
      department: "Development",
    },
    {
      id: 2,
      firstName: "Fatima",
      lastName: "Al-Rashid",
      email: "fatima@company.com",
      role: "staff",
      companyId: 101,
      avatar: "F",
      workStartTime: new Date("2024-09-27T08:55:00"),
      hoursToday: "6h 00m",
      hoursWeek: "28h 10m",
      hoursMonth: "112h 30m",
      presence: "inactive",
      status: "offline",
      latestWorkLog: { loginTime: "8:55 AM", logoutTime: "5:30 PM" },
      lastSeen: "5:30 PM",
      department: "Design",
    },
    {
      id: 3,
      firstName: "Zainab",
      lastName: "Mohamed",
      email: "zainab@company.com",
      role: "admin",
      companyId: 101,
      avatar: "Z",
    },
  ]);

  const [formData, setFormData] = useState<CreateStaffForm>({
    firstName: "",
    lastName: "",
    email: "",
    role: "staff",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: keyof CreateStaffForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateStaffForm> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    } else if (staffList.some((staff) => staff.email === formData.email)) {
      errors.email = "Email already exists";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let newStaff: User | StaffUser;

    if (formData.role === "staff") {
      newStaff = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: "staff",
        companyId: 101,
        avatar: formData.firstName[0].toUpperCase(),
        workStartTime: new Date(),
        hoursToday: "0h 00m",
        hoursWeek: "0h 00m",
        hoursMonth: "0h 00m",
        presence: "inactive",
        status: "offline",
        latestWorkLog: { loginTime: new Date().toLocaleTimeString(), logoutTime: null },
        lastSeen: "—",
        department: "Unassigned",
      };
    } else {
      newStaff = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: "admin",
        companyId: 101,
        avatar: formData.firstName[0].toUpperCase(),
      };
    }

    setStaffList((prev) => [newStaff, ...prev]);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "staff",
      password: "",
      confirmPassword: "",
    });

    setIsSubmitting(false);
    setShowCreateForm(false);
  };

  const isStaffUser = (user: User | StaffUser): user is StaffUser => {
    return (user as StaffUser).workStartTime !== undefined;
  }

  const filteredStaff: StaffUser[] = staffList
    .filter(isStaffUser) 
    .filter((staff) => {
      const matchesSearch =
        staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || staff.presence === statusFilter;

      return matchesSearch && matchesStatus;
    });

  const handleStaffAction = (staffId: number, action: "reset" | "deactivate" | "activate") => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return;

    if (action === "reset") {
      setStaffToChange(staff);
      setShowChangePassword(true);
    } else {
      setSelectedStaff(staffId);
      setActionType(action);
    }
  };

  const confirmAction = () => {
    if (!selectedStaff || !actionType) return;

    setStaffList((prev) =>
      prev.map((staff) => {
        if (staff.id === selectedStaff && staff.role === "staff") {
          const staffUser = staff as StaffUser;
          if (actionType === "deactivate") {
            return { ...staffUser, presence: "inactive", status: "offline" };
          }
          if (actionType === "activate") {
            return { ...staffUser, presence: "active", status: "online" };
          }
        }
        return staff;
      })
    );

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
        staffName={staffToChange?.firstName || ""}
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
