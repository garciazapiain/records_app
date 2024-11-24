export interface RecordFormEditData {
    sender_name: string;
    sender_age: number;
    message: string;
    file_paths?: string[]; // Existing files (URLs)
    files?: File[]; // New files
  }
  