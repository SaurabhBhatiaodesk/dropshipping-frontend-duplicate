import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import axios from "axios";
import Button from "../../Shared/Button/Button";
import "./CsvList.css";

const CsvList = () => {
  const { token } = useContext(AppContext);
  const [csvData, setCsvData] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    getCsvFiles();
  }, []);

  // fetched csv files
  const getCsvFiles = async () => {
    const csvUrl = `${API_BASE_URL}/api/fetchCsvFile`;
    try {
      const response = await axios.get(csvUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response :::", response?.data?.response);
      setCsvData(response?.data?.response);
    } catch (error) {
      console.log("fetchCsvFile error ::", error);
    }
  };

  const handleDownload = (csv) => {
    console.log("csv ::", csv);
    const csvContent = `SR.No., SKU,Buffer Quantity,Tags\n${csv
      .map(
        (order) =>
          //   `${order.s.no.},${order.SKU},${order.Buffer_quantity},${order.Tags}`
          `${order["SR.No."]},${order["SKU"]},${order["Buffer Quantity"]},${order["Tags"]}`
      )
      .join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CSV-file.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  return (
    <table className="history-table-os">
      {csvData.length > 0 ? (
        <>
          <thead>
            <tr>
              {Object.keys(csvData[0]).map(
                (key, idx) =>
                  (key === "shop" || key === "createdAt") && (
                    <th key={idx}>
                      <h4>{key}</h4>
                    </th>
                  )
              )}
              <th>
                <h4>Download CSV</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((item, index) => {
              const keys = Object.keys(item);
              return (
                <tr key={index}>
                  {keys.map(
                    (key, idx) =>
                      (key === "shop" || key === "createdAt") && (
                        <td key={idx}>
                          <p>{item[key]}</p>
                        </td>
                      )
                  )}
                  <td>
                    <Button
                      onClick={() => handleDownload(item.csvFileData)}
                      type="button"
                      title="Download"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </>
      ) : (
        <tbody>
          <tr>
            <td>No CSV data found</td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

export default CsvList;
