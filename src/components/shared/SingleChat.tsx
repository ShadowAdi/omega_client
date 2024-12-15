import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { BASE_URL, Chat, Message, User } from "@/lib/types";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { socket } from "@/context/SocketContext";

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

  // Memoized fetchData to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    if (!userData?._id || !receiverId) return;

    try {
      const { data: userData } = await axios.get(
        `${BASE_URL}getUser/${singleChat.participants[1]}`
      );
      setUser(userData.user);

      const { data: messagesData } = await axios.get(
        `${BASE_URL}messages?chatId=${singleChat._id}`
      );

      const uniqueMessages = messagesData.reduce(
        (acc: Message[], current: Message) => {
          const isDuplicate = acc.some(
            (item) =>
              item.content === current.content &&
              item.sender === current.sender &&
              item.createdAt === current.createdAt
          );

          if (!isDuplicate) {
            acc.push(current);
          }

          return acc;
        },
        []
      );

      setMessages(uniqueMessages);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching chat data");
    }
  }, [userData?._id, receiverId, singleChat._id]);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!userData?._id || !singleChat._id) return;

    // Join room based on chat ID
    socket.emit("join_chat", {
      chatId: singleChat._id,
      userId: userData._id,
    });

    const handlePrivateMessage = (data: Message) => {
      // Ensure the message is for this specific chat
      if (data.chatId === singleChat._id) {
        setMessages((prevMessages) => {
          // Prevent duplicate messages
          const isDuplicate = prevMessages.some(
            (msg) =>
              msg.content === data.content &&
              msg.sender === data.sender &&
              msg.createdAt === data.createdAt
          );

          if (isDuplicate) return prevMessages;

          return [
            ...prevMessages,
            {
              ...data,
              self: data.sender === userData._id,
            },
          ];
        });
      }
    };

    socket.on("private_message", handlePrivateMessage);

    return () => {
      socket.off("private_message", handlePrivateMessage);
    };
  }, [singleChat._id, userData?._id]);

  // Send a message with improved error handling
  const sendMessage = async (content: string, type: string) => {
    if (!userData?._id) return;

    const newMessage: Message = {
      sender: userData._id,
      receiver: receiverId,
      content,
      type,
      chatId: singleChat._id,
      createdAt: new Date().toISOString(),
    };

    try {
      // Optimistically add message to UI
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.content === newMessage.content &&
            msg.sender === newMessage.sender
        );

        if (isDuplicate) return prev;

        return [...prev, { ...newMessage, self: true }];
      });

      // Emit message to the specific chat room
      socket.emit("send_private_message", {
        message: newMessage,
        chatId: singleChat._id,
      });

      // Save message to database
      await axios.post(`${BASE_URL}chat`, newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Remove the optimistically added message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.content !== newMessage.content)
      );
    }
  };

  // Memoize user and chat header to prevent unnecessary re-renders
  const ChatHeader = useMemo(
    () => (
      <header
        className="w-full border-b border-b-slate-700/30 pb-3 flex 
      items-center justify-between py-2 px-3 rounded"
      >
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
    ),
    [user]
  );

  return (
    <>
      {ChatHeader}

      {/* Chat messages */}
      <div className="w-full py-4 px-5 flex flex-col gap-4 h-full overflow-y-auto relative">
        {messages.map((message, i) => (
          <div
            key={`${i}-${message.sender}-${message.content}`}
            className={`w-full flex ${
              message.sender === userData?._id ? "justify-end" : "justify-start"
            }`}
          >
            <ChatBubble
              message={message.content}
              createdAt={message?.createdAt}
              senderId={message.sender}
            />
          </div>
        ))}
      </div>

      {/* Input for sending messages */}
      <div className="absolute bottom-10 left-0 w-full border-t">
        {userData?._id && user?._id && <ChatInput onSend={sendMessage} />}
      </div>
    </>
  );
};

export default SingleChat;
