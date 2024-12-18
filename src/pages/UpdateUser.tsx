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
import { Link,  useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { BASE_URL, User } from "@/lib/types";
import ClipLoader from "react-spinners/ClipLoader";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email or phone is required" })
    .refine((val) => val.includes("@"), {
      message: "Enter a valid email",
    }),
  mobileNo: z
    .string()
    .min(10, { message: "phone is required" })
    .max(10, { message: "phone is required" })
    .refine((val) => /^[0-9]{10}$/.test(val), {
      message: "Enter a valid Phone Number",
    }),
  name: z.string().min(3, { message: "More than 3 Characters Long" }),
  profileImage: z.string(),
  isMediaAllowed: z.boolean().default(false),
});

const UpdateUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      mobileNo: "",
      profileImage: "",
      isMediaAllowed: false,
    },
  });

  const GetUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}getUser/${id}`);
      setUser(response.data.user); // Set user data when fetched
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      setUser(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUser(); // Fetch user data on component mount
  }, [id]);

  useEffect(() => {
    if (user) {
      const currentValues = form.getValues();
      if (
        currentValues.email !== user.email ||
        currentValues.name !== user.name ||
        currentValues.mobileNo !== user.mobileNo ||
        currentValues.profileImage !== user.profileImage ||
        currentValues.isMediaAllowed !== user.isMediaAllowed
      ) {
        form.setValue("email", user.email || "");
        form.setValue("name", user.name || "");
        form.setValue("mobileNo", user.mobileNo || "");
        form.setValue("profileImage", user.profileImage || "");
        form.setValue("isMediaAllowed", user.isMediaAllowed || false);
      }
    }
  }, [user, form.setValue]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(`${BASE_URL}updateUser/${id}`, values);
      toast.success(response.data.message);
      window.location.href = "https://omega-client-jet.vercel.app/admin";
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  }

  if (loading) {
    return (
      <main className="flex w-[90%] mx-auto flex-col h-[90%] my-auto items-center justify-center gap-6 px-5 py-7 text-black">
        <h1 className="font-semibold">Update User</h1>
        <ClipLoader
          color={"#000"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
        />
      </main>
    );
  }

  return (
    <main className="flex w-[90%] mx-auto flex-col h-[90%] my-auto items-center justify-center gap-6 px-5 py-7 text-black">
      <h1 className="font-semibold">Update User</h1>

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
                <FormLabel>Name</FormLabel>
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
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="py-6 rounded-sm px-3 border-stone-900/40"
                    placeholder="Enter your Profile Image URL"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isMediaAllowed"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Media Allowed</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isMediaAllowed"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-8 w-8  border-gray-300 rounded-lg"
                    />
                    <label htmlFor="isMediaAllowed" className="text-sm">
                      Allow media?
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex mt-10 items-center justify-between">
            <Button
              type="submit"
              className="px-6 py-6 w-[300px]  text-white text-lg mx-auto"
            >
              Update User
            </Button>
            <Link to={"/admin"} className="w-[300px] mx-auto">
              <Button
                variant={"secondary"}
                type="submit"
                className="px-6 py-6 bg-slate-300 hover:border-transparent hover:bg-slate-300/40 text-lg w-full"
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

export default UpdateUser;
