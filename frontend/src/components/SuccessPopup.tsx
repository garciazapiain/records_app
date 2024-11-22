import React, { useEffect } from "react";

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Trigger the `onClose` callback after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h3 className="text-xl font-bold mb-4 text-black">{message}</h3>
      </div>
    </div>
  );
};

export default SuccessPopup;
