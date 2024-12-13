import React from "react";
import { Input } from "../ui/input";

const SearchField = () => {
  return (
    <Input
      className="flex w-full text-base my-2 px-2 border border-slate-700/90 "
      placeholder="Search Something...."
      type="text"
    />
  );
};

export default SearchField;
