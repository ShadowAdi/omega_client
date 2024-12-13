import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chats from "./pages/Chats";
import { useContext, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AddUser from "./pages/AddUser";
import UpdateUser from "./pages/UpdateUser";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import { BASE_URL } from "./lib/types";

function App() {
  const { userData, setUserData, loading, setLoading } =
    useContext(UserContext)!;
  const token = localStorage.getItem("token");
  const GetUser = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}getUser/${id}`
      );
      setUserData(response.data.user);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      setUserData(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<{ id: string }>(token);
      if (decodedToken?.id) {
        GetUser(decodedToken.id);
      }
    }
  }, [token]);

  return (
    <div className="w-screen h-screen relative flex items-center justify-center">
      <BrowserRouter>
        <Routes>
          {userData && !loading ? (
            <Route element={<Chats />} index path="/" />
          ) : (
            <Route element={<Login />} index path="/" />
          )}
          {!userData && <Route element={<Register />} path="/register" />}
          {userData && <Route element={<Admin />} path="/admin" />}
          {userData && <Route element={<AddUser />} path="/addUser" />}
          {userData && <Route element={<UpdateUser />} path="/editUser/:id" />}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
