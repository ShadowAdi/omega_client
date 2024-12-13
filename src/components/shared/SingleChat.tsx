import { useContext, useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { BASE_URL, Chat, Message, User } from "@/lib/types";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { SocketContext } from "@/context/SocketContext";

const SingleChat = ({
  singleChat,
  receiverId,
}: {
  singleChat: Chat;
  receiverId: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { userData } = useContext(UserContext)!;
  const [user, setUser] = useState<User | null>(null);
  const { socket } = useContext(SocketContext)!;

  useEffect(() => {
    if (!userData?._id || !receiverId) return;

    socket.emit("register", userData._id);

    const fetchData = async () => {
      try {
        // Fetch user info
        const { data: userData } = await axios.get(
          `${BASE_URL}getUser/${receiverId}`
        );
        setUser(userData.user);

        // Fetch messages for this chat
        const { data: messagesData } = await axios.get(
          `${BASE_URL}messages?chatId=${singleChat._id}`
        );
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching chat data");
      }
    };

    fetchData();

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.chatId === singleChat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [userData?._id, receiverId, singleChat._id]);

  const sendMessage = async (content: string, type: string) => {
    if (!userData?._id) return;
    const newMessage: Message = {
      sender: userData._id,
      receiver: receiverId,
      content,
      type,
      chatId: singleChat._id,
    };

    try {
      setMessages((prev) => [...prev, newMessage]); // Optimistic UI update
      socket.emit("sendMessage", newMessage); // Send message via socket
      await axios.post(`${BASE_URL}chat`, newMessage); // Persist message to DB
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <>
      <header className="w-full border-b border-b-slate-700/30 pb-3 flex items-center justify-between py-2 px-3 rounded">
        <div className="flex items-center gap-3">
          <Avatar className="w-16 h-16 cursor-pointer">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-lg font-semibold text-black">{user?.name}</h1>
            <h1 className="text-sm font-light text-black">{user?.email}</h1>
          </div>
        </div>
        <SidebarTrigger className="bg-white" />
      </header>
      <div className="w-full py-4 px-5 flex flex-col gap-4 h-full overflow-y-auto relative">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`w-full flex ${
              message.sender === userData?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <ChatBubble
              key={i}
              message={message.content}
              createdAt={message?.createdAt}
              senderId={message.sender}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-10 left-0 w-full border-t">
        {userData?._id && user?._id && (
          <ChatInput
            onSend={sendMessage}
          />
        )}
      </div>
    </>
  );
};

export default SingleChat;
