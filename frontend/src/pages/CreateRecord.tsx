import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecordFormData } from "../types/RecordFormData";
import RecordForm from "../components/RecordForm";
import Headline from "../components/Headline";
import SuccessPopup from "../components/SuccessPopup";

const CreateRecords: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleCreateRecord = async (formData: RecordFormData) => {
    // Basic frontend validation for age
    if (formData.sender_age < 0 || formData.sender_age > 120) {
      alert("Please enter a valid age between 0 and 120.");
      return;
    }

    try {
      const jsonBody = {
        sender_name: formData.sender_name,
        sender_age: formData.sender_age,
        message: formData.message,
      };

      const response = await fetch("http://localhost:4000/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create record");
      }

      setShowSuccess(true); // Show the success popup
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/records"); // Navigate to the records list after the popup disappears
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-16 bg-gray-800">
      <Headline title="Create New Record" subtitle="Fill out the form below to create a new record." />
      <div className="flex justify-center w-full max-w-3xl">
        <RecordForm
          onSubmit={handleCreateRecord}
          buttonText="Create Record"
        />
      </div>
      {showSuccess && (
        <SuccessPopup
          message="Record created successfully!"
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
};

export default CreateRecords;
