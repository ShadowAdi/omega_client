import axios from "axios";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

import { redirect } from "react-router-dom";
import { BASE_URL } from "@/lib/types";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const DeleteUser = ({ userId }: { userId: string }) => {
  const {userData,setUserData}=useContext(UserContext)!
  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}deleteUser/${id}`);
      toast.success("Delete the User");
      if (userData?._id===userId) {
        setUserData(null)
        localStorage.removeItem("token")
        redirect("/")
      }
      redirect("/admin");
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  };
  return (
    <Button
      variant={"outline"}
      className="bg-red-600  py-6 px-8 rounded-full text-white hover:border-transparent hover:text-white 
hover:bg-red-700     text-lg"
      onClick={() => deleteUser(userId)}
    >
      Delete User
    </Button>
  );
};

export default DeleteUser;
