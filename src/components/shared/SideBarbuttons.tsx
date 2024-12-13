import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const SideBarbuttons = () => {
  const { userData } = useContext(UserContext)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="text-black hover:border-transparent bg-[#c0c0c2]
       hover:bg-[#d1d1d3e6] text-base py-1  w-1/3  border-transparent"
      >
        Profile
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hi, {userData?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userData?.isAdmin && (
          <DropdownMenuItem className="cursor-pointer text-black ">
            <Link
              to={"/admin"}
              className="text-black hover:underline hover:text-black"
            >
              Admin
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SideBarbuttons;
