import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useContext, useState } from "react";
import SearchField from "./SearchFields";
import SideBarbuttons from "./SideBarbuttons";
import { UserContext } from "@/context/UserContext";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar({
  users,
  onUserSelect,
}: {
  users: User[] | [];
  onUserSelect: (user: User) => void;
}) {
  const { userData } = useContext(UserContext)!;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
  };

  return (
    <Sidebar className="h-full bg-[#DEDEDF] border-r p-4">
      <SidebarContent className="justify-between rounded-xl bg-white overflow-y-auto px-3 py-5">
        <SidebarGroup className="gap-6">
          <SidebarGroupLabel className="text-xl font-bold">
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {users.length > 0 ? (
                users.map((user) => {
                  if (user._id !== userData?._id) {
                    return (
                      <li
                        key={user._id}
                        className={`flex items-center gap-4 p-4 hover:bg-gray-200 cursor-pointer ${
                          selectedUser?._id === user._id ? "bg-gray-300" : ""
                        }`}
                        onClick={() => handleUserClick(user)}
                      >
                        <Avatar>
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-gray-600 truncate">
                            {user.email}
                          </p>
                        </div>
                      </li>
                    );
                  }
                })
              ) : (
                <p className="text-gray-600 text-sm">No users available</p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {userData?.isAdmin && <SideBarbuttons />}
      </SidebarContent>
    </Sidebar>
  );
}
