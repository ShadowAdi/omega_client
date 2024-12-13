import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const AddUser = () => {
  return (
    <Link to={"/addUser"}>
      <Button
        variant={"outline"}
        className="bg-white  py-6 px-8 rounded-full text-black 
     hover:border-slate-200     text-lg"
      >
        Add User
      </Button>
    </Link>
  );
};

export default AddUser;
