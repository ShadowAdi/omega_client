import React, { useState } from "react";
import { Button } from "../ui/button";
import Papa from "papaparse";
import axios from "axios";
import { BASE_URL } from "@/lib/types";

const ImportData = () => {
  const [csvData, setCsvData] = useState<any>(null); // Store parsed CSV data

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      // Parse the CSV file
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed CSV data:", result);
          const processedData = result.data
            .map((row: any) => ({
              ...row,
              isAdmin: row.isAdmin === "TRUE", 
              isMediaAllowed: row.isMediaAllowed === "TRUE", 
            }))
            .filter((row: any) => row.name && row.email && row.mobileNo); // Only include rows with name, email, and mobileNo

          setCsvData(processedData);
        },
        header: true,
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleSubmit = async () => {
    if (csvData) {
      try {
        const response = await axios.post(
          `${BASE_URL}import-users`,
          {
            data: csvData,
          }
        );

        console.log("Data imported successfully:", response.data);
        alert("Data imported successfully!");
      } catch (error) {
        console.error("Error importing data:", error);
        alert("There was an error importing the data.");
      }
    } else {
      alert("No CSV data to import.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the file input
        id="csv-file-input"
      />

      {/* Test button to trigger file input dialog */}
      <button
        className="bg-green-600 text-white py-2 px-8 rounded-full hover:bg-green-700 text-lg"
        onClick={() => {
          const inputElement = document.getElementById("csv-file-input");
          if (inputElement) {
            (inputElement as HTMLInputElement).click(); // Ensure it's treated as an input element
          }
        }}
      >
        Import Data
      </button>

      {/* Only show the Submit button if csvData exists */}
      {csvData && (
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 ml-4 py-6 px-8 rounded-full hover:bg-blue-700 text-lg mt-4"
        >
          Submit Data
        </Button>
      )}
    </div>
  );
};

export default ImportData;
