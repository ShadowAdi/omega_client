import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Link, redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/types";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email or phone is required" })
    .refine((val) => val.includes("@"), {
      message: "Enter a valid email",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  mobileNo: z
    .string()
    .min(10, { message: "phone is required" })
    .max(10, { message: "phone is required" })
    .refine((val) => /^[0-9]{10}$/.test(val), {
      message: "Enter a valid Phone Number",
    }),
  name: z.string().min(3, { message: "More than 3 Characters Long" }),
  profileImage: z.string(),
});

const AddUser = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      mobileNo: "",
      name: "",
      profileImage: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${BASE_URL}addUser`,
        values
      );
      redirect("https://omega-client-jet.vercel.app/");
      toast.success(response.data.message);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  }
  return (
    <main className="flex w-[90%]  mx-auto flex-col  h-[90%] my-auto items-center justify-center gap-6 px-5 py-7 text-black">
      <h1 className="font-semibold">Create User</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-3/4 md:w-1/2 items-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="123456789"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adi</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="Adi"
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
                    type="password"
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="Enter your Profile"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex mt-10 items-center justify-between">
            <Button
              type="submit"
              className="px-6 py-6 w-[300px]  text-lg mx-auto"
            >
              Add User
            </Button>
            <Link to={"/admin"} className="w-[300px] mx-auto">
              <Button
                variant={"secondary"}
                type="submit"
                className="px-6 py-6  bg-slate-300 hover:border-transparent hover:bg-slate-300/40  text-lg w-full"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default AddUser;
