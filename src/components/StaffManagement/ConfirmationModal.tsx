import React from "react";

interface ConfirmationModalProps {
  selectedStaff: string | null;
  actionType: "reset" | "deactivate" | "activate" | null;
  cancelAction: () => void;
  confirmAction: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  selectedStaff,
  actionType,
  cancelAction,
  confirmAction,
}) => {
  if (!selectedStaff || !actionType) return null;

  const title = actionType === "reset" ? "Reset Password" : "Change Status";
  const message =
    actionType === "reset"
      ? "Are you sure you want to reset this staff member's password? They will receive an email with reset instructions."
      : "Are you sure you want to change this staff member's status?";

  const buttonClass =
    actionType === "reset"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-red-600 hover:bg-red-700";

  const buttonText = actionType === "reset" ? "Reset Password" : "Confirm";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={cancelAction}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmAction}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonClass}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
