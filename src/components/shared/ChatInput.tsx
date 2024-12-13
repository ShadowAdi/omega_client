import React, { useState, useContext } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ClipboardIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";

const ChatInput = ({
  sender,
  receiver,
  onSend,
}: {
  sender: string;
  receiver: string;
  onSend: (content: string, type: string) => void;
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const { userData } = useContext(UserContext)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSend(inputMessage, "text");
    setInputMessage(""); // Clear input field
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "assignment");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/shadowaditya/image/upload`,
        formData
      );
      console.log(response);
      const imageUrl = response.data.secure_url;
      onSend(imageUrl, "image"); // Send image URL as message
      toast.success("Image sent successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
    }
  };

  const handleVideoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "assignment");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/shadowaditya/video/upload`,
        formData
      );
      console.log(response);
      const imageUrl = response.data.secure_url;
      onSend(imageUrl, "video"); // Send image URL as message
      toast.success("Video sent successfully!");
    } catch (error) {
      console.error("Video upload failed:", error);
      toast.error("Failed to upload Video.");
    }
  };

  return (
    <div className="w-[80%] mx-auto">
      <form onSubmit={handleSubmit} className="py-2">
        <div className="flex items-center py-1 px-3 bg-stone-900 rounded-lg dark:bg-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full items-center justify-center h-[40px] w-[40px] flex
             bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
            >
              <p className="text-xs">Media</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Choose Media</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userData?.isMediaAllowed && (
                <DropdownMenuItem
                  onClick={() => {
                    document.getElementById("upload-video")?.click(); // Manually trigger file input
                  }}
                >
                  Video
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  document.getElementById("upload-image")?.click(); // Manually trigger file input
                }}
              >
                Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVideoUpload(e.target.files[0]);
              } else {
                console.error("No file selected.");
              }
            }}
            style={{ display: "none" }}
            id="upload-video"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              } else {
                console.error("No file selected.");
              }
            }}
            style={{ display: "none" }}
            id="upload-image"
          />

          <Textarea
            rows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Your message..."
            className="block mx-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2 text-blue-600 rounded-full hover:bg-blue-100 bg-stone-200"
          >
            <svg
              className="w-6 h-6 rotate-90"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
