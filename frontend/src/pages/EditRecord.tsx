import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecordFormData } from "../types/RecordFormData";
import RecordForm from "../components/RecordForm";
import Headline from "../components/Headline";
import SuccessPopup from "../components/SuccessPopup";

const EditRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<RecordFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch the record to edit
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/records/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch record");
        }
        const data = await response.json();
        setRecord(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  // Handle updating the record
  const handleUpdateRecord = async (formData: RecordFormData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update record");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate(`/records/detail/${id}`); // Navigate back to the record detail page
  };

  if (loading) return <p className="text-white">Loading record for editing...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-16 bg-gray-800">
      <Headline title="Edit Record" subtitle="Modify the details below." />
      <div className="flex justify-center w-full max-w-3xl">
        {record && (
          <RecordForm
            onSubmit={handleUpdateRecord}
            initialValues={record}
            buttonText="Save Changes"
          />
        )}
      </div>
      {showSuccess && (
        <SuccessPopup
          message="Record updated successfully!"
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
};

export default EditRecord;
