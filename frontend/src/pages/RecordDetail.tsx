import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Record } from "../types/Record";
import Headline from "../components/Headline";
import Button from "../components/Button";

const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  if (loading) return <p className="text-white">Loading record details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:4000/api/records/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      navigate('/records')

    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete the record. Please try again.");
    }
  };

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
          {record.file_paths && record.file_paths.length > 0 && (
            <div className="mt-4">
              <p className="font-bold">Files:</p>
              <ul>
                {record.file_paths.map((filePath, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <a
                      href={`http://localhost:4000/uploads/${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {filePath}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex mt-6 gap-4">
            <Button
              label="Edit Record"
              href={`/records/${id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
            <Button
              label="Delete Record"
              onClick={() => handleDelete(record.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordDetail;
