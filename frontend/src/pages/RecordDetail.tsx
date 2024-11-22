import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Record } from "../types/Record";
import Headline from "../components/Headline";
import Button from "../components/Button";
import SuccessPopup from "../components/SuccessPopup";

const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch the record details
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

  // Handle deleting the record
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/records/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error deleting record:", error);
      setError("Failed to delete the record.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/records"); // Redirect to the records list
  };

  if (loading) return <p className="text-white">Loading record details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-16 bg-gray-800">
      <Headline title="Record Details" subtitle="View the details below." />

      {record && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <p>
            <span className="font-bold">Name:</span> {record.sender_name}
          </p>
          <p>
            <span className="font-bold">Age:</span> {record.sender_age}
          </p>
          <p>
            <span className="font-bold">Message:</span> {record.message}
          </p>
          {record.file_path && (
            <p>
              <span className="font-bold">File:</span>{" "}
              <a
                href={record.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download File
              </a>
            </p>
          )}

          <div className="flex mt-6 gap-4">
            <Button
              label="Edit Record"
              href={`/records/${id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
            <Button
              label="Delete Record"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <SuccessPopup
          message="Record deleted successfully"
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
};

export default RecordDetail;
