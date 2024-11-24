import React, { useState, useRef } from "react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, acceptedFormats }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) =>
        acceptedFormats.includes(file.type)
      );

      if (validFiles.length !== filesArray.length) {
        alert("File needs to be pdf, jpeg or png.");
      }

      // Accumulate new valid files with previously selected files
      const updatedFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(updatedFiles);
      onFilesSelected(updatedFiles);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles); 
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
      {selectedFiles.length > 0 && (
        <ul className="mt-2">
          {selectedFiles.map((file, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => handleFileRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
