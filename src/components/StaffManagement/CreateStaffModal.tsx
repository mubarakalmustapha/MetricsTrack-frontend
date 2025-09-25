import React from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: "staff" | "admin";
  password: string;
  confirmPassword: string;
}

interface StaffFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface CreateStaffModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  formData: StaffFormData;
  formErrors: StaffFormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  handleInputChange: (field: keyof StaffFormData, value: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  show,
  setShow,
  formData,
  formErrors,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  handleInputChange,
  handleSubmit,
  isSubmitting,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create New Staff Account</h2>
          <button
            onClick={() => setShow(false)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {[
            { label: "First Name", field: "firstName", type: "text" },
            { label: "Last Name", field: "lastName", type: "text" },
            { label: "Email", field: "email", type: "email" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
              <input
                type={type}
                value={formData[field as keyof StaffFormData]}
                onChange={(e) => handleInputChange(field as keyof StaffFormData, e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors[field as keyof StaffFormErrors] ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              {formErrors[field as keyof StaffFormErrors] && (
                <p className="text-red-500 text-sm mt-1">{formErrors[field as keyof StaffFormErrors]}</p>
              )}
            </div>
          ))}

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value as "staff" | "admin")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password & Confirm Password */}
          {[
            { label: "Password", field: "password", show: showPassword, toggle: setShowPassword },
            { label: "Confirm Password", field: "confirmPassword", show: showConfirmPassword, toggle: setShowConfirmPassword },
          ].map(({ label, field, show, toggle }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={formData[field as keyof StaffFormData]}
                  onChange={(e) => handleInputChange(field as keyof StaffFormData, e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors[field as keyof StaffFormErrors] ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() => toggle(!show)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formErrors[field as keyof StaffFormErrors] && (
                <p className="text-red-500 text-sm mt-1">{formErrors[field as keyof StaffFormErrors]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={() => setShow(false)}
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
              "Create Staff Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStaffModal;
