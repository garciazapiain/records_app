import React, { useState } from "react";
import { RecordFormData } from "../types/RecordFormData";

interface RecordFormProps {
  onSubmit: (formData: RecordFormData) => void;
  initialValues?: RecordFormData;
  buttonText: string;
}

const RecordForm: React.FC<RecordFormProps> = ({
  onSubmit,
  initialValues = { sender_name: "", sender_age: 0, message: "", file: null },
  buttonText,
}) => {
  const [formData, setFormData] = useState<RecordFormData>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sender_age" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="w-full max-w-md bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="sender_name" className="block font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          id="sender_name"
          name="sender_name"
          value={formData.sender_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="sender_age" className="block font-bold mb-2">
          Age (0-120)
        </label>
        <input
          type="number"
          id="sender_age"
          name="sender_age"
          value={formData.sender_age}
          onChange={handleChange}
          min="0" // Prevent negative values
          max="120" // Prevent unrealistic ages
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block font-bold mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block font-bold mb-2">
          Upload File (Optional)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default RecordForm;
