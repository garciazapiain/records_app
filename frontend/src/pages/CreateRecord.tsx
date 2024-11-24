import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecordFormCreateData } from "../types/RecordFormCreateData";
import RecordForm from "../components/RecordFormCreate";
import Headline from "../components/Headline";
import SuccessPopup from "../components/SuccessPopup";

const CreateRecords: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleCreateRecord = async (formData: RecordFormCreateData) => {
    if (formData.sender_age < 0 || formData.sender_age > 120) {
      alert("Please enter a valid age between 0 and 120.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("sender_name", formData.sender_name);
    formDataToSend.append("sender_age", formData.sender_age.toString());
    formDataToSend.append("message", formData.message);

    // Append files
    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((file) => formDataToSend.append("files", file));
    }

    try {
      const response = await fetch("http://localhost:4000/api/records", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create record");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating record:", error);
      alert("Failed to create record. Please try again.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/records");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-16 bg-gray-800">
      <Headline title="Create New Record" subtitle="Fill out the form below to create a new record." />
      <div className="flex justify-center w-full max-w-3xl">
        <RecordForm onSubmit={handleCreateRecord} buttonText="Create Record" />
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
