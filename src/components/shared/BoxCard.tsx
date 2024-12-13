import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import DeleteUser from "./DeleteUser";
import { User } from "@/lib/types";

const BoxCard = ({ user }: { user: User }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex w-full flex-col gap-1 items-start ">
          <span className="text-xl font-semibold">{user.name}</span>
          <span className="text-sm text-gray-400 font-base">{user.email}</span>
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex gap-2 justify-between px-4 w-full">
        <Link to={`/editUser/${user._id}`} className="w-[80%] mx-auto">
          <Button
            variant={"outline"}
            className="bg-green-600  py-6 px-8 rounded-full hover:text-white border-transparent text-white 
     hover:bg-green-700     text-lg"
          >
            Edit User
          </Button>
        </Link>
        <DeleteUser userId={user._id} />
      </CardFooter>
    </Card>
  );
};

export default BoxCard;
