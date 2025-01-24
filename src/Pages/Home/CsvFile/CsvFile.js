import React, { useContext, useEffect, useRef } from "react";
import "./CsvFile.css";
import { useState } from "react";
import Papa from "papaparse";
import SubHeading from "../../Shared/SubHeading/SubHeading";
import DefaultSettingsPopup from "../DefaultSettingsPopup/DefaultSettingsPopup";
import { AppContext } from "../../../App";
import Button from "../../Shared/Button/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import localFormatCsvFile from "../../../excelFormat/file-format.csv";
import MainHeading from "../../Shared/MainHeading/MainHeading";
import NotificationBar from "../../Shared/NotificationBar/NotificationBar";

const CsvFile = () => {
  const [locationData, setLocationData] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const NGROG_URL = process.env.REACT_APP_NGROG_URL;
  // console.log("API_BASE_URL:", API_BASE_URL);
  // console.log("NGROG_URL:", NGROG_URL);

  useEffect(() => {
    getLocations();
  }, []);

  // default expiryDate
  const getDefaultExpiryDate = () => {
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const year = nextDay.getFullYear();
    const month = String(nextDay.getMonth() + 1).padStart(2, "0");
    const day = String(nextDay.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to validate the expiry date
  const validateExpiryDate = (selectedDate) => {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj <= currentDate) {
      return "Expiry date must be in the future.";
    }
    return "";
  };

  // appContext and states
  const { csvData, setCSVData, file, setFile, token } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const [defaultSettingsOption, setDefaultSettingsOption] = useState(false);
  const [activeRules, setActiveRules] = useState("supplierRules");
  const [activePopup, setActivePopup] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [nonExistTag, setNonExistTag] = useState("");
  const [fileVal, setFileVal] = useState("");
  const [isFileValid, setIsFileValid] = useState(false);

  // const [selectionRules, setSelectionRules] = useState(
  //   defaultSettingsOption ? "allExcels" : "defaultSettings"
  // );

  // console.log("tokentokentokentokentoken", token)

  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [defaultSettingData, setDefaultSettingData] = useState([]);

  // useEffect(() => {
  //   const socket = io(NGROG_URL, {
  //     withCredentials: true,
  //     path: "/socket.io/",
  //   });

  //   socket.on("connect", () => {
  //      console.log("=========================2", socket.id);
  //   });

  //   socket.on("progress", (data) => {
  //     setShowProgressBar(true);
  //     console.log("datadatadatadatadata", data);
  //     setProgress(data.percentage);

  //     if (data.percentage === 100) {
  //       setShowProgressBar(false);
  //     }
  //   });

  //   socket.on("connect_error", () => {
  //     setTimeout(() => {
  //       socket.connect();
  //     }, 5000);
  //   });

  //   return () => socket.disconnect();
  // }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_BASE_URL, {
      withCredentials: true,
      path: "/socket.io/",
    });

    socket.on("connect", () => {
      console.log("=========================2", socket.id);
    });

    socket.on("progress", (data) => {
      setShowProgressBar(true);
      console.log("datadatadatadatadata", data);
      setProgress(data.percentage);

      if (data.percentage === 100) {
        setShowProgressBar(false);
      }
    });

    socket.on("connect_error", () => {
      setTimeout(() => {
        socket.connect();
      }, 5000);
    });

    return () => socket.disconnect();
  }, []);

  // console.log("progressprogressprogress", progress)

  const [form, setForm] = useState({
    selectionRules: "allExcels",
    selectTag: [],
    selectSku: "",
    belowZero: "DENY",
    location: [],
    locationIds: [],
    bufferQuantity: "no",
    inputBufferQuantity: "",
    expiryDate: getDefaultExpiryDate(),
    fileHeader: "",
    shopifyHeader: "sku",
    singleTag: "",
    id: "",
    fileInventoryHeader: "",
    shopifyInventoryHeader: "inventory-quantity",
    fileTagHeader: "",
    shopifyTagHeader: "tag",
  });

  const [formError, setFormError] = useState({
    bufferQuantity: "",
    expiryDate: "",
    fileHeader: "",
    inputBufferQuantity: "",
    selectTag: "",
    fileInventoryHeader: "",
    fileTagHeader: "",
  });

  const shopifyCSVData = [
    {
      header: "SKU",
    },
    {
      header: "Barcode",
    },
  ];

  // Function to format the date as YYYY-MM-DD
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // fetched Defaut Settings
  const defaultSettingApiUrl = `${API_BASE_URL}/api/fetchDefautSetting`;
  const getDefaultSettings = async () => {
    try {
      const response = await axios.get(
        defaultSettingApiUrl,
        // {
        //   shop: "https://0360-testing.myshopify.com",
        // },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.response?.id) {
        setDefaultSettingsOption(true);
      }
      // console.log("getDefaultSettings-response", response?.data?.response?.id);
      const defaultSettings = response?.data?.response;
      setDefaultSettingData(defaultSettings);
      // console.log("defaultSettings :::", defaultSettings);
      // console.log("locationData :::", locationData);

      // if (defaultSettings?.id && locationData.length > 0) {
      //   let locationIds = [];
      //   if (
      //     Array.isArray(defaultSettings.locations) &&
      //     defaultSettings.locations.length > 0
      //   ) {
      //     locationIds = defaultSettings.locations[0].split(",");
      //   }
      //   console.log("locationIds ::", locationIds);

      //   // Match location IDs with location data to get labels
      //   const matchedLocations = locationIds.map((id) => {
      //     const trimmedId = id.trim();
      //     console.log("trimmedId ::", trimmedId);

      //     const matchedLocation = locationData.find((loc) => {
      //       const locationId = loc?.node?.id
      //         .split("gid://shopify/Location/")[1]
      //         .trim();
      //       console.log("Comparing IDs: ", locationId);
      //       return locationId === trimmedId;
      //     });

      //     console.log("matchedLocation ::", matchedLocation);
      //     return {
      //       value: trimmedId,
      //       label: matchedLocation
      //         ? matchedLocation.node.name
      //         : "Unknown Location",
      //     };
      //   });

      //   console.log("matchedLocations ::", matchedLocations);

      //   setForm((preState) => ({
      //     ...preState,
      //     belowZero: defaultSettings.continueSell,
      //     bufferQuantity: "yes",
      //     inputBufferQuantity: defaultSettings.bufferQqantity,
      //     expiryDate: formatDate(defaultSettings.expireDate),
      //     location: matchedLocations,
      //   }));
      // }

      if (defaultSettings?.id && locationData.length > 0) {
        let locationIds = [];
        if (
          Array.isArray(defaultSettings.locations) &&
          defaultSettings.locations.length > 0
        ) {
          locationIds = defaultSettings.locations[0].split(",");
        }
        // console.log("locationIds ::", locationIds);

        // Match location IDs with location data to get labels
        const matchedLocations = locationIds.map((id) => {
          const trimmedId = id.trim();
          // console.log("trimmedId ::", trimmedId);

          const matchedLocation = locationData.find((loc) => {
            const locationId = loc?.node?.id
              .split("gid://shopify/Location/")[1]
              .trim();
            // console.log("Comparing locationId: ", locationId);
            return locationId === trimmedId;
          });

          // console.log("matchedLocation ::", matchedLocation);

          if (matchedLocation) {
            // console.log("matchedLocation if");
            return {
              value: trimmedId,
              label: matchedLocation ? matchedLocation.node.name : null,
            };
          } else {
            // console.log("matchedLocation else");
          }
        });

        const locationIdData = matchedLocations.map(
          (location) => location.value
        );
        // console.log("matchedLocations ::", matchedLocations);
        // console.log("locationIdData ::", locationIdData);

        setForm((preState) => ({
          ...preState,
          belowZero: defaultSettings.continueSell,
          bufferQuantity: "yes",
          inputBufferQuantity: defaultSettings.bufferQqantity,
          expiryDate: formatDate(defaultSettings.expireDate),
          location: matchedLocations,
          locationIds: locationIdData,
        }));
      }
    } catch (error) {
      // console.log("fetchStoreLocation errorrrrrrrr111", error);
    }
  };

  useEffect(() => {
    getDefaultSettings();
  }, []);

  useEffect(() => {
    // console.log("isFileValid ::", isFileValid);
  }, [isFileValid]);

  useEffect(() => {
    if (defaultSettingsOption) {
      setForm((prevState) => ({
        ...prevState,
        selectionRules: "allExcels",
      }));
    }
  }, [defaultSettingsOption]);

  // handle change for csv upload
  // const handleCsvInputChanges = (e) => {
  //   const selectedFile = e.target.files[0];

  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     Papa.parse(selectedFile, {
  //       complete: (result) => {
  //         // Filter out rows with empty or whitespace-only 'Tags' values
  //         const filteredData = result.data.filter(
  //           (row) => row.Tags && row.Tags.trim() !== ""
  //         );
  //         setCSVData(filteredData);
  //         // console.log("Filtered CSV Data:", filteredData);
  //       },
  //       header: true,
  //     });
  //   }
  // };

  const handleCsvInputChanges = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Set the selected file
      setFile(selectedFile);

      // Check if file name is not empty
      if (selectedFile.name.trim() !== "") {
        setIsFileValid(true);

        // Parse CSV file
        Papa.parse(selectedFile, {
          complete: (result) => {
            const filteredData = result.data.filter(
              (row) => row.Tags && row.Tags.trim() !== ""
            );
            setCSVData(filteredData);
            setNotificationMessage(
              "Supplier Quantity update CSV is uploaded successfully."
            );

            setTimeout(() => {
              setNotificationMessage("");
            }, 8000);
          },
          header: true,
        });
      } else {
        setIsFileValid(false);
      }
    } else {
      setIsFileValid(false);
    }
  };

  // Handle csv upload button
  const handleUploadCsvBtn = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setTimeout(() => {
      if (!activePopup) {
        setActivePopup(true);
      }
    }, 1000);
  };

  // // handle input change
  // const handleInputChange = async (val) => {
  //   if (val && val.target) {
  //     const { name, type, checked, value } = val.target;
  //     const newValue = type === "checkbox" ? (checked ? "1" : "0") : value;
  //     setForm((prevState) => ({
  //       ...prevState,
  //       [name]: newValue,
  //     }));
  //     setFormError((prevState) => ({
  //       ...prevState,
  //       [name]: "",
  //     }));
  //     console.log("newValueeeeeeeee", newValue);
  //   }
  // };

  const handleInputChange = (val) => {
    const { name, type, checked, value } = val.target;

    // Check if the input's name is 'inputBufferQuantity'
    if (name === "inputBufferQuantity") {
      // Allow only numbers 0-9
      const isValidInput = /^[0-9]*$/.test(value);

      if (!isValidInput) {
        setFormError((prevState) => ({
          ...prevState,
          [name]: "Please enter numbers only.",
        }));
        return; // Don't update state if the input is invalid
      }
    }

    // Handle checkbox and other input types
    const newValue = type === "checkbox" ? (checked ? "1" : "0") : value;

    // Update form state
    setForm((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    // Clear the error for the specific input
    setFormError((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  // handle selection continue button
  const handleSelectedRules = async (val) => {
    console.log("handleSelectedRules val ::", val);
    let isValid = true;

    if (form.selectionRules === "tag" && !form.singleTag) {
      setFormError((prevState) => ({
        ...prevState,
        selectTag: "Please select valid tag",
      }));
      isValid = false;
    } else if (form.selectionRules === "tag" && !nonExistTag) {
      setFormError((prevState) => ({
        ...prevState,
        selectTag: "Tag not exist",
      }));
      isValid = false;
    } else {
      setFormError((prevState) => ({
        ...prevState,
        selectTag: "",
      }));
      setActiveRules(val);
      console.log("handleSelectedRules val else::", val);
    }
    return isValid;
  };

  // Handle save button
  const handleSave = (e) => {
    e.preventDefault();
    const calendarError = validateExpiryDate(form.expiryDate);
    let isValid = true;

    // if (form.bufferQuantity === "no") {
    //   setFormError((prevState) => ({
    //     ...prevState,
    //     bufferQuantity: "Choose yes in buffer quantity",
    //   }));
    //   isValid = false;
    // }

    if (form.bufferQuantity === "yes" && form.inputBufferQuantity < 1) {
      setFormError((prevState) => ({
        ...prevState,
        inputBufferQuantity: "Buffer quantity must be greater than 0.",
      }));
      isValid = false;
    } else {
      setFormError((prevState) => ({
        ...prevState,
        inputBufferQuantity: "",
      }));
    }

    if (form.expiryDate && calendarError) {
      setFormError((prevState) => ({
        ...prevState,
        // expiryDate: form.expiryDate,
        expiryDate: "Expiry date must be future date",
      }));
      isValid = false;
    }

    // console.log("formErrorrrrrrrrrrr", formError);

    if (isValid) {
      if (activePopup) {
        setActivePopup(false);
      }
    }
  };

  const handleSubmit = async () => {
    let isValid = true;
    if (!form.fileHeader) {
      setFormError((prevState) => ({
        ...prevState,
        fileHeader: "Please select file header",
      }));
      return (isValid = false);
    }

    if (!form.fileInventoryHeader) {
      setFormError((prevState) => ({
        ...prevState,
        fileInventoryHeader: "Select file Inventory Header",
      }));
      return (isValid = false);
    }
    if (isValid) {
      const csvApiUrl = `${API_BASE_URL}/api/addCsvFile`;
      try {
        const response = await axios.post(
          csvApiUrl,
          {
            defaultSetting: form.selectionRules,
            csvFileData: csvData,
            productTags: form.selectTag,
            continueSell: form.belowZero,
            locations: form.locationIds,
            bufferQqantity: form.inputBufferQuantity,
            expireDate: form.expiryDate,
            fileHeaders: form.fileHeader,
            shopifyInventoryHeaders: form.shopifyHeader,
            fileInventoryHeaders: form.fileInventoryHeader,
            shopifyQqantityInventoryHeaders: form.shopifyInventoryHeader,
            fileTagHeader: form.fileTagHeader,
            shopifyTagHeader: form.shopifyTagHeader,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setNotificationMessage(
            "Fields Mapping & CSV Upload has been successfully done."
          );
          setTimeout(() => {
            setNotificationMessage("");
          }, 8000);
        }
      } catch (error) {
        console.log("csv data api error", error);
      }
    }
  };

  // handkleDownload csv
  const handleDownload = () => {
    console.log("handleDownload is working");
    // Path to your CSV file
    // const csvFilePath = "";
    const csvFilePath = localFormatCsvFile;

    // Create an anchor element
    const link = document.createElement("a");
    link.href = csvFilePath;

    // Set the download attribute and file name
    link.setAttribute("download", "format.csv");

    // Append the anchor to the body
    document.body.appendChild(link);

    // Trigger the click event
    link.click();

    // Clean up: remove the anchor element
    document.body.removeChild(link);
  };

  const handleLocationSelect = (data) => {
    console.log("handleLocationSelect ::", data);

    setForm((prevState) => ({
      ...prevState,
      location: data.map((val) => ({
        value: val.value,
        label: val.label,
      })),
      locationIds: data.map((val) => val.value),
    }));
  };

  const getLocations = async () => {
    try {
      const locationUrl = `${API_BASE_URL}/api/fetchStoreLocation`;
      const response = await axios.get(locationUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocationData(response?.data?.response?.data?.shop?.locations?.edges);
    } catch (error) {
      console.log("fetchStoreLocation error", error);
    }
  };

  return (
    <section className="CsvFiles-section-os">
      <div className="container-os">
        {notificationMessage && (
          <NotificationBar
            title={notificationMessage}
            style={{ marginBottom: "1.5rem" }}
          />
        )}

        <div className="default-heading-bar-os">
          <MainHeading title="Stock Adjustments" />
        </div>

        <div className="CsvFiles-csv-upload-data-os">
          <div className="CsvFile-upload-content-os">
            <div className="CsvFile-upload-note-os">
              <span>NOTE : </span>
              The inventory quantity that you will uploaded in CSV will
              over-write the inventory of those particular SKU's in Shopify.
            </div>
            <div className="CsvFile-content-row-os">
              <div className="CsvFile-upload-input">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvInputChanges}
                  style={{ display: "none" }}
                  // value={fileVal}
                />
                {/* <button onClick={handleUploadCsvBtn} type="button">
                Upload csv
              </button> */}
                <Button
                  onClick={handleUploadCsvBtn}
                  type="button"
                  title="Upload CSV"
                />
                {/* {csvData.length > 0 && (
                  <p className="success-message-os">
                    Supplier Quantity update CSV is uploaded successfully.
                  </p>
                )} */}
              </div>
              {/* {file?.name && <p className="pb-2">{file?.name}</p>} */}
              <div className="format-file-download-btn-os">
                <button type="button" onClick={handleDownload}>
                  Download Sample CSV
                </button>
                {/* <Button
                  onClick={handleDownload}
                  type="button"
                  title="Download Sample CSV"
                /> */}
              </div>
            </div>
          </div>

          {csvData.length > 0 && (
            <div className="CsvFile-mapping-data-os">
              <SubHeading title="Mapping" />
              <div className="CsvFile-mapping-select-row-os pb-4">
                <div className="CsvFile-mapping-select-col-os-1">
                  <h5>CSV Unique Identifier :</h5>
                  <select
                    onChange={handleInputChange}
                    name="fileHeader"
                    value={form.fileHeader}
                  >
                    <option value="">Select</option>
                    {Object.keys(csvData[0])
                      .splice(1)
                      .map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))}
                  </select>
                  {formError.fileHeader && (
                    <div className="error-message-os">
                      {formError.fileHeader}
                    </div>
                  )}
                </div>
                <div className="CsvFile-mapping-select-col-os-1">
                  <h5>Shopify Unique Identifier :</h5>
                  <select
                    onChange={handleInputChange}
                    value={form.shopifyHeader}
                    name="shopifyHeader"
                  >
                    {shopifyCSVData.map((values, index) => (
                      <option key={index} value={values.header}>
                        {values.header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inventory update */}
              <div className="CsvFile-mapping-select-row-os pb-4">
                <div className="CsvFile-mapping-select-col-os-1">
                  <h5>CSV Inventory Mapping Field :</h5>
                  <select
                    onChange={handleInputChange}
                    name="fileInventoryHeader"
                    value={form.fileInventoryHeader}
                  >
                    <option value="">Select</option>
                    {Object.keys(csvData[0])
                      .splice(1)
                      .map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))}
                  </select>
                  {formError.fileInventoryHeader && (
                    <div className="error-message-os">
                      {formError.fileInventoryHeader}
                    </div>
                  )}
                </div>
                <div className="CsvFile-mapping-select-col-os-1">
                  <h5>Shopify Inventory Mapping Field :</h5>
                  <select
                    onChange={handleInputChange}
                    value={form.shopifyInventoryHeader}
                    name="shopifyInventoryHeader"
                  >
                    <option value="inventory-quantity">
                      Inventory quantity
                    </option>
                  </select>
                </div>
              </div>

              {/* Tags update */}
              <div className="CsvFile-mapping-select-row-os pb-4">
                <div className="CsvFile-mapping-select-col-os-1">
                  <h5>CSV Tags Mapping Field :</h5>
                  <select
                    onChange={handleInputChange}
                    name="fileTagHeader"
                    value={form.fileTagHeader}
                  >
                    <option value="">Select</option>
                    {Object.keys(csvData[0])
                      .splice(1)
                      .map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))}
                  </select>
                  {formError.fileTagHeader && (
                    <div className="error-message-os">
                      {formError.fileTagHeader}
                    </div>
                  )}
                </div>
                <div className="CsvFile-mapping-select-col-os-1">
                  <h5>Shopify Tags Mapping Field :</h5>
                  <select
                    onChange={handleInputChange}
                    value={form.shopifyTagHeader}
                    name="shopifyTagHeader"
                  >
                    <option value="tags">Tags</option>
                  </select>
                </div>
              </div>

              {/* progress bar */}
              {showProgressBar && progress < 100 && (
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.floor(progress)}%` }}
                  >
                    {Math.floor(progress)}%
                  </div>
                </div>
              )}

              <div className="CsvFile-submit-btn-os">
                {/* {formConfirmMessage && (
                  <div className="success-message-os">{formConfirmMessage}</div>
                )} */}
                <Button
                  disabled={showProgressBar && progress < 100}
                  type="button"
                  onClick={handleSubmit}
                  title="Submit"
                />
              </div>
            </div>
          )}

          {/* {showProgressBar && progress < 100 && (
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${Math.floor(progress)}%` }}>
                {Math.floor(progress)}%
              </div>
            </div>
          )} */}

          {/* {apiResponseTime && (
            <div className="api-response-time">
              API Response Time: {formatTimer(apiResponseTime)}
            </div>
          )} */}

          {/* {csvData.length > 0 && (
            <div className="CsvFile-data-table-os">
              <table>
                <thead>
                  <tr>
                    {Object.keys(csvData[0]).map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((values, valuesIndex) => {
                        if (row.Buffer_quantity) {
                          return (
                            <td key={valuesIndex}>
                              <input type="text" value={values} />
                            </td>
                          );
                        } else {
                          return <td key={valuesIndex}>{values}</td>;
                        }
                        return <td key={valuesIndex}>{values}</td>;
                      })}
                    </tr>
                  ))} */}
          {/* {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.entries(row).map(([key, value], valuesIndex) => {
                        // if (key === "Buffer_quantity") {
                        //   return (
                        //     <td key={valuesIndex}>
                        //       <input type="text" value={value} />
                        //     </td>
                        //   );
                        // } else {
                        //   return <td key={valuesIndex}>{value}</td>;
                        // }
                        return <td key={valuesIndex}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}

          {csvData.length > 0 && (
            <div className="CsvFile-data-table-os">
              <table>
                <thead>
                  <tr>
                    {Object.keys(csvData[0]).map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map(
                    (
                      row,
                      rowIndex // Only take the first 10 rows
                    ) => (
                      <tr key={rowIndex}>
                        {Object.entries(row).map(
                          ([key, value], valuesIndex) => {
                            return <td key={valuesIndex}>{value}</td>;
                          }
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {activePopup && isFileValid && (
          <DefaultSettingsPopup
            activePopup={activePopup}
            setActivePopup={setActivePopup}
            handleInputChange={handleInputChange}
            form={form}
            setForm={setForm}
            handleSave={handleSave}
            formError={formError}
            handleSelectedRules={handleSelectedRules}
            activeRules={activeRules}
            setActiveRules={setActiveRules}
            nonExistTag={nonExistTag}
            setNonExistTag={setNonExistTag}
            setFormError={setFormError}
            defaultSettingsOption={defaultSettingsOption}
            locationData={locationData}
            setLocationData={setLocationData}
            handleLocationSelect={handleLocationSelect}
            getDefaultSettings={getDefaultSettings}
            getLocations={getLocations}
          />
        )}
      </div>
    </section>
  );
};

export default CsvFile;
