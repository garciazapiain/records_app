import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Headline from "../components/Headline";
import Button from "../components/Button";
import { Record } from "../types/Record"; // Importing centralized interface

const RecordsList: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/records");

        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }

        const data = await response.json();
        setRecords(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

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

      // Update the state to remove the deleted record
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete the record. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-16 bg-gray-800 text-gray-800">
      <Headline title="Records List" subtitle="View all records below." />

      {loading && <p className="text-white">Loading records...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && records.length === 0 && (
        <p className="text-white">No records found.</p>
      )}

      {!loading && records.length > 0 && (
        <table className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="px-4 py-2">{record.sender_name}</td>
                <td className="px-4 py-2">{record.sender_age}</td>
                <td className="px-4 py-2">{record.message}</td>
                <td className="px-4 py-2 flex gap-4">
                  <Link
                    to={`/records/detail/${record.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-8">
        <Button
          label="Create New Record"
          href="/records/new"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>
    </div>
  );
};

export default RecordsList;
