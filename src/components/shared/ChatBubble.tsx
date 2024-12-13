import { BASE_URL, User } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";

// Helper function to check if a URL is an image
const isImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url);
};

// Helper function to check if a URL is a video
const isVideoUrl = (url: string) => {
  return /\.(mp4|webm|mov|avi)$/i.test(url);
};

const ChatBubble = ({
  message,
  createdAt,
  senderId,
}: {
  message: string;
  createdAt?: string;
  senderId: string;
}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}getUser/${senderId}`
        );
        setUser(data.user);
      } catch (error) {
        console.log("An error occurred while fetching user:", error);
      }
    };
    getUser();
  }, [senderId]);

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {createdAt && format(new Date(createdAt), "hh:mm a")}
          </span>
        </div>

        {/* Check if message is a valid image URL */}
        {isImageUrl(message) ? (
          <img
            src={message}
            alt="Image"
            className="w-full max-h-[200px] object-cover mt-2 rounded-md"
          />
        ) : isVideoUrl(message) ? (
          <video
            controls
            className="w-full max-h-[200px] object-cover mt-2 rounded-md"
          >
            <source src={message} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p
            className="text-sm font-normal py-2.5 text-gray-900 dark:text-white"
            style={{
              wordWrap: "break-word",
              whiteSpace: "normal", // Ensures text wraps normally
              overflowWrap: "break-word", // Handles long words breaking
              wordBreak: "break-word", // Ensures even long words break
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
