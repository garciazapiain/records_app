import React, { useState } from "react";
import { RecordFormEditData } from "../types/RecordFormEditData";
import FileUpload from "./FileUpload";

interface RecordFormEditProps {
    initialValues: RecordFormEditData;
    onSubmit: (formData: RecordFormEditData) => void;
    onDeleteFile: (fileName: string) => void;
}

const RecordFormEdit: React.FC<RecordFormEditProps> = ({
    initialValues,
    onSubmit,
    onDeleteFile,
}) => {
    const [formData, setFormData] = useState<RecordFormEditData>({
        ...initialValues,
        files: initialValues.files || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "sender_age" ? parseInt(value, 10) || 0 : value,
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
                    min="0"
                    max="120"
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
                <label className="block font-bold mb-2">Existing Files</label>
                <ul>
                    {formData.file_paths?.map((filePath, index) => (
                        <li key={index} className="flex items-center justify-between mb-2">
                            <a
                                href={`http://localhost:4000/uploads/${filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {filePath}
                            </a>
                            <button
                                type="button"
                                onClick={() => onDeleteFile(filePath)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <label className="block font-bold mb-2">Upload New Files (Optional, Multiple Allowed)</label>
                <FileUpload
                    onFilesSelected={(files) => setFormData({ ...formData, files })}
                    acceptedFormats={["image/png", "image/jpeg", "application/pdf"]} // Specify accepted formats
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
                Save Changes
            </button>
        </form>
    );
};

export default RecordFormEdit;
