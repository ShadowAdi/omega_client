import { AppSidebar } from "@/components/shared/AppSidebar";
import SingleChat from "@/components/shared/SingleChat";
import { UserContext } from "@/context/UserContext";
import { BASE_URL, Chat, User } from "@/lib/types";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Chats = () => {
  const [users, setUsers] = useState<User[] | []>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { userData } = useContext(UserContext)!;

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}users`);
      setUsers(data.users);
    } catch (error) {
      setUsers([]);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectChat = async (user: User) => {
    try {
      const { data } = await axios.post(`${BASE_URL}chat`, {
        sender: userData?._id,
        receiver: user._id,
      });
      console.log(data);
      toast.success(data.info);
      setSelectedChat(data.chat); // Save the chat data that includes receiver's ID
    } catch (error) {
      toast.error("An Error Happened in creating Chat: "+error);
      console.log(error, " An Error Happened");
    }
  };

  return (
    <main className="h-screen  flex w-screen">
      <AppSidebar users={users} onUserSelect={handleSelectChat} />
      <section
        className="flex-1  relative border-l border-l-slate-700/30 flex flex-col h-full
         bg-[#d2d2d4b7]
        py-3 px-4"
      >
        {selectedChat ? (
          <SingleChat
            singleChat={selectedChat}
            receiverId={selectedChat?.participants[1]} // Pass the receiver's ID here
          />
        ) : (
          <div className="flex w-full h-screen items-center justify-center">
            <h1 className="text-lg font-bold">
              Select A user to Chat With Him
            </h1>
          </div>
        )}
      </section>
    </main>
  );
};

export default Chats;
