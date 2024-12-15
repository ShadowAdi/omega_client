export interface User {
  _id: string; // Mongoose uses `_id`, but it's commonly converted to `id` for frontend use
  name: string;
  email: string;
  mobileNo: string;
  profileImage?: string;
  provider: "email" | "google";
  isAdmin: boolean;
  isMediaAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id?: string;
  chatId: string;
  sender: string;
  receiver: string;
  content: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export const BASE_URL="https://omega-server-rouge.vercel.app/api/"