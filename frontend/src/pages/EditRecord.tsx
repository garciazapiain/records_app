import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecordFormEditData } from "../types/RecordFormEditData";
import Headline from "../components/Headline";
import SuccessPopup from "../components/SuccessPopup";
import RecordFormEdit from "../components/RecordFormEdit";

const EditRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<RecordFormEditData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleUpdateRecord = async (formData: RecordFormEditData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("sender_name", formData.sender_name);
      formDataToSend.append("sender_age", formData.sender_age.toString());
      formDataToSend.append("message", formData.message);

      if (formData.files) {
        formData.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
      }
      
      const response = await fetch(`http://localhost:4000/api/records/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update record");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update the record. Please try again.");
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the file: "${fileName}"?`);
    if (!userConfirmed) {
      return;
    } try {
      const response = await fetch(`http://localhost:4000/api/records/${id}/files`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Update the record's file_paths
      setRecord((prev) => {
        if (!prev) return prev;
        const updatedFilePaths = prev.file_paths?.filter((file) => file !== fileName) || [];
        console.log("Updated file_paths:", updatedFilePaths);
        return {
          ...prev,
          file_paths: updatedFilePaths,
        };
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate(`/records/detail/${id}`);
  };

  if (loading) return <p className="text-white">Loading record for editing...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-16 bg-gray-800">
      <Headline title="Edit Record" subtitle="Modify the details below." />
      {record && (
        <RecordFormEdit
          key={record.file_paths?.join(",")} // Force re-render
          initialValues={{
            sender_name: record.sender_name,
            sender_age: record.sender_age,
            message: record.message,
            file_paths: record.file_paths || [],
          }}
          onSubmit={handleUpdateRecord}
          onDeleteFile={handleDeleteFile}
        />
      )}
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
