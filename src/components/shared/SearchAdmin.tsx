import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";

const SearchAdmin = () => {
  const form = useForm({
    defaultValues: {
      searchText: "",
    },
  });

  return (
    <div
      className="flex px-4 py-3 flex-[0.6] sm:boxShadow
    rounded-sm sm:rounded-full  border-2"
    >
      <Form {...form}>
        <form
          //   onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex-col sm:flex-row  flex gap-4 items-center justify-between"
        >
          <FormField
            control={form.control}
            name="searchText"
            render={({ field }) => (
              <FormItem className="w-full flex-1 h-full">
                <FormControl>
                  <Input
                    className="outline-none h-full   flex-1 py-1 rounded-md px-3 
                     border-b-2 bg-transparent"
                    placeholder="Type Name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="rounded-full shadow-md w-10 h-10 bg-[#e4572eff] duration-500 
          hover:bg-[#e4572eff] hover:text-[#e4572eff]"
            type="submit"
          >
            <SearchIcon className="text-white" size={24} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchAdmin;
