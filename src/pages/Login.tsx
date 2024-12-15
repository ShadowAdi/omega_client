import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { BASE_URL } from "@/lib/types";

const formSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, { message: "Email or phone is required" })
    .refine((val) => val.includes("@") || /^[0-9]{10}$/.test(val), {
      message: "Enter a valid email or 10-digit phone number",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const { setUserData } = useContext(UserContext)!;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${BASE_URL}login`, values);
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      setUserData(response.data.user);
      window.location.href = "https://omega-client-jet.vercel.app/";
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Login error:", error);
    }
  }

  return (
    <main className="flex w-[90%]  mx-auto flex-col  h-[90%] my-auto items-center justify-center gap-6 px-5 py-7 text-black">
      <h1 className="font-semibold">Login User</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6  w-3/4 md:w-1/2"
        >
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Phone</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="example@email.com or 1234567890 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="px-6 py-6  text-lg mx-auto text-white"
          >
            Login
          </Button>
        </form>
      </Form>
      <hr className="w-full border-b border-black" />

      <Button
        onClick={() => {
          window.location.href =
            "https://omega-server-rouge.vercel.app/api/auth/google";
        }}
        className="flex gap-2
 bg-blue-600 text-white w-[200px] py-6 hover:bg-blue-700 items-center rounded-full"
      >
        <span className="text-xl">Google</span>
      </Button>
      <div className="flex mt-4 items-center justify-center gap-1 text-center text-black">
        <p className="text-lg text-black text-center">
          {" "}
          Don{"'"}t Have An Account?
        </p>
        <Link to={"/register"}>
          <span className="text-lg text-black underline text-center">
            Register
          </span>
        </Link>
      </div>
    </main>
  );
};

export default Login;
