import { Button } from "../ui/button";
import axios from "axios";
import { BASE_URL } from "@/lib/types";

const ExportData = () => {
  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}export-users`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv"); // You can change the file name here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting users:", error);
    }
  };
  return (
    <Button
      onClick={handleExport}
      variant={"outline"}
      className="bg-white  py-6 px-8 rounded-full text-green-600 hover:text-green-700
       hover:border-slate-200     text-lg"
    >
      Export Data
    </Button>
  );
};

export default ExportData;
