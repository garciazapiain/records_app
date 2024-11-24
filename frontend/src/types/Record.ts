export interface Record {
  id: number;
  sender_name: string;
  sender_age: number;
  message: string;
  file_paths?: string[]; 
}