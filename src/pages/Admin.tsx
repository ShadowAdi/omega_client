import AddUser from "@/components/shared/AddUser";
import BoxCard from "@/components/shared/BoxCard";
import ExportData from "@/components/shared/ExportData";
import ImportData from "@/components/shared/ImportData";
import SearchAdmin from "@/components/shared/SearchAdmin";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserContext";
import { BASE_URL, User } from "@/lib/types";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { toast } from "react-toastify";

const Admin = () => {
  const { setUserData } = useContext(UserContext)!;
  const [users, setUsers] = useState<User[] | []>([]);
  const getUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}users`);
      setUsers(response.data.users);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <section className="flex flex-col py-3 px-4 w-full h-screen ">
      <nav className="flex mx-auto justify-between items-center w-[80%]   py-4 border-b border-b-slate-700">
        <Link to={"/chats"}>
          <span className="text-3xl font-semibold text-black ">Chats</span>
        </Link>
        <div className="flex gap-6 items-center">
          <AddUser />
          <Button
            className="rounded-full"
            onClick={() => {
              setUserData(null);
              localStorage.removeItem("token");
              redirect("/");
            }}
          >
            Logout
          </Button>
        </div>
      </nav>
      <main className="w-[80%]   mx-auto h-full flex flex-col gap-6 items-center justify-start px-6 py-8">
        <h1 className="text-black text-4xl font-bold  text-center ">
          Admin Page
        </h1>
        <div className="flex w-full items-center gap-4 mt-6 justify-around px-2 py-1">
          <ImportData />
          <ExportData />
        </div>
        <div
          className="mt-3 w-full gap-4 mx-auto grid lg:grid-cols-3 
        sm:grid-cols-2 grid-cols-1 items-center px-4 py-8"
        >
          {users.length > 0 &&
            users.map((user, i) => {
              return <BoxCard user={user} key={i} />;
            })}
        </div>
      </main>
    </section>
  );
};

export default Admin;
