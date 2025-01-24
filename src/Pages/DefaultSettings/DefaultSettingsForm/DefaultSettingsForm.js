// latest code
import React, { useContext, useState } from "react";
import "./DefaultSettingsForm.css";
import "../../Home/DefaultSettingsPopup/DefaultSettingsPopup.css";
import MainHeading from "../../Shared/MainHeading/MainHeading";
import Button from "../../Shared/Button/Button";
import axios from "axios";
import { useEffect } from "react";
import Input from "../../Shared/Input/Input";
import { AppContext } from "../../../App";
import { MoonLoader } from "react-spinners";
import Select from "react-select";
// import TooltipIcon from "../../../Assets/tooltip-icon.svg";

import { io } from "socket.io-client";
import NotificationBar from "../../Shared/NotificationBar/NotificationBar";

const DefaultSettingsForm = () => {
  const { token } = useContext(AppContext);
  const [locationData, setLocationData] = useState([]);
  const [defaultSettingData, setDefaultSettingData] = useState([]);
  const [formConfirmMessage, setFormConfirmMessage] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const NGROG_URL = process.env.REACT_APP_NGROG_URL;
  // console.log("API_BASE_URL:", API_BASE_URL);
  // console.log("NGROG_URL:", NGROG_URL);

  useEffect(() => {
    const socket = io(NGROG_URL, {
      withCredentials: true,
      path: "/socket.io/",
    });

    socket.on("connect", () => {
      console.log("=========================", socket.id);
    });

    socket.on("progress", (data) => {});

    socket.on("connect_error", () => {
      setTimeout(() => {
        socket.connect();
      }, 5000);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    getLocations();
  }, []);

  // Get locations for select options
  useEffect(() => {
    if (locationData?.length > 0) {
      const options = locationData.map((loc) => {
        const locationId = (loc?.node?.id).split("gid://shopify/Location/");
        return {
          value: locationId[1],
          label: loc?.node?.name,
        };
      });
      setLocationOptions(options);
      getDefaultSettings();
    }
  }, [locationData]);

  // console.log("locationData ::", locationData);

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

  const [form, setForm] = useState({
    belowZero: "DENY",
    location: [],
    locationIds: [],
    bufferQuantity: "no",
    inputBufferQuantity: "",
    expiryDate: getDefaultExpiryDate(),
  });
  const [formError, setFormError] = useState({
    bufferQuantity: "",
    expiryDate: "",
    inputBufferQuantity: "",
  });

  // useEffect(() => {
  //   console.log("form ::", form);
  //   console.log("form.locationIds ::", form.locationIds);
  // }, [form]);

  // fetched store location
  const locationUrl = `${API_BASE_URL}/api/fetchStoreLocation`;
  const getLocations = async () => {
    try {
      const response = await axios.get(locationUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocationData(response?.data?.response?.data?.shop?.locations?.edges);
      setLoading(false);
      // console.log(
      //   "response?.data?.response?.data?.shop?.locations?.edges",
      //   response?.data?.response?.data?.shop?.locations?.edges
      // );
    } catch (error) {}
  };

  // fetched Defaut Settings
  // const defaultSettingApiUrl = `${API_BASE_URL}/api/fetchDefautSetting`;
  // const getDefaultSettings = async () => {
  //   try {
  //     const response = await axios.get(defaultSettingApiUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // console.log("getDefaultSettings-response", response?.data?.response);

  //     const defaultSettings = response?.data?.response;
  //     setDefaultSettingData(defaultSettings);
  //     console.log("defaultSettings :::", defaultSettings);

  //     if (response?.data?.response.id) {
  //       // Match location IDs with location data to get labels
  //       const matchedLocations = defaultSettings.locations.map((id) => {
  //         const matchedLocation = locationData.find(
  //           (loc) => loc.node.id.split("gid://shopify/Location/")[1] === id
  //         );
  //         return {
  //           value: id,
  //           label: matchedLocation ? matchedLocation.node.name : "",
  //         };
  //       });

  //       console.log("matchedLocations ::", matchedLocations);

  //       setForm((preState) => ({
  //         ...preState,
  //         belowZero: response?.data?.response?.continueSell,
  //         bufferQuantity: "yes",
  //         inputBufferQuantity: response?.data?.response?.bufferQqantity,
  //         expiryDate: formatDate(response?.data?.response?.expireDate),
  //         // location: response?.data?.response?.locations,
  //         location: matchedLocations,
  //       }));
  //     }
  //   } catch (error) {
  //     console.log("fetchDefautSetting errorrrrrrrr", error);
  //   }
  // };

  const defaultSettingApiUrl = `${API_BASE_URL}/api/fetchDefautSetting`;
  const getDefaultSettings = async () => {
    try {
      const response = await axios.get(defaultSettingApiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const defaultSettings = response?.data?.response;
      setDefaultSettingData(defaultSettings);
      // console.log("defaultSettings :::", defaultSettings);
      // console.log("locationData :::", locationData);

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
      // console.log("fetchDefautSetting error:", error);
    }
  };

  // Function to format the date as YYYY-MM-DD
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // handle input change with 0-9 validation for a specific input
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

  const handleSave = async (e) => {
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
        expiryDate: "Expiry date must be future date.",
      }));
      isValid = false;
    }

    console.log("formErrorrrrrrrrrrr", formError);

    if (isValid) {
      // console.log("handleSubmit defaultSettings form", form);

      const defaultSettingUrl = `${API_BASE_URL}/api/saveDefautSetting`;
      try {
        const response = await axios.post(
          defaultSettingUrl,
          {
            // shop : "https://om-test12.myshopify.com",
            continueSell: form.belowZero,
            locations: form.locationIds,
            bufferQqantity: form.inputBufferQuantity,
            expireDate: form.expiryDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("form.selectTag", form.singleTag);
        // setNonExistTag(response?.data?.status);
        console.log("saveDefautSetting responseeee", response);
        setNotificationMessage("Configuration is saved successfully.");
        setTimeout(() => {
          setNotificationMessage("");
        }, 8000);
      } catch (error) {
        console.log("saveDefautSetting errorrrr", error);
        // console.log("object message: ", error?.response?.data?.status);
        // setNonExistTag(error?.response?.data?.status);
        // console.log("nonExistTaggggggg catch", nonExistTag);
      }
    }
  };
  return (
    <section className="DefaultSettings-page-os">
      <div className="container-os">
        <form onSubmit={handleSave} className="DefaultSettings-row-os">
          {notificationMessage && (
            <NotificationBar
              title={notificationMessage}
              style={{ marginBottom: "1.5rem" }}
            />
          )}
          <div className="default-heading-bar-os">
            <MainHeading title="Quantity Update Settings" />
          </div>

          <div className="DefaultSettingsPopup-input-row-os">
            <div className="DefaultSettingsPopup-input-col-os-1">
              <span className="key-values-os">
                Continue Selling When Out of Stock :
              </span>
            </div>
            <div className="DefaultSettingsPopup-input-col-os-2">
              <label className="control-os control--radio-os">
                Yes
                <input
                  type="radio"
                  name="belowZero"
                  value="CONTINUE"
                  checked={form.belowZero === "CONTINUE"}
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
              </label>
              <label className="control-os control--radio-os">
                No
                <input
                  type="radio"
                  name="belowZero"
                  value="DENY"
                  checked={form.belowZero === "DENY"}
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
              </label>
            </div>
          </div>

          <div className="DefaultSettingsPopup-input-row-os">
            <div className="DefaultSettingsPopup-input-col-os-1">
              <span className="key-values-os">Choose Warehouse Location :</span>
            </div>
            <div className="DefaultSettingsPopup-input-col-os-2">
              <div className="DefaultSettingsPopup-inputs-os multiple-selector-os">
                {loading ? (
                  <MoonLoader
                    css={{ margin: "0 auto", borderColor: "blue" }}
                    size={50}
                    color={"blue"}
                  />
                ) : (
                  // <select
                  //   name="location"
                  //   value={form.location}
                  //   onChange={handleInputChange}
                  // >
                  //   <option value="">Select</option>
                  //   {locationData?.length > 0 &&
                  //     locationData?.map((loc, index) => {
                  //       const locationId = (loc?.node?.id).split(
                  //         "gid://shopify/Location/"
                  //       );
                  //       // console.log("idArray", locationId[1]);
                  //       return (
                  //         <option key={index} value={locationId[1]}>
                  //           {loc?.node?.name}
                  //         </option>
                  //       );
                  //     })}
                  // </select>

                  <Select
                    name="location"
                    value={
                      form.locationIds && form.locationIds.length > 0
                        ? form.location?.map((data) => ({
                            value: data.value,
                            label: data.label,
                          }))
                        : []
                    }
                    onChange={handleLocationSelect}
                    isMulti={true}
                    options={locationOptions}
                  />
                )}
                <div className="select__arrow"></div>
              </div>
            </div>
          </div>

          <div className="DefaultSettingsPopup-input-row-os">
            <div className="DefaultSettingsPopup-input-col-os-1">
              <span className="compulsary-fields-os">*</span>
              <span className="key-values-os">Specify Buffer Quantity :</span>
            </div>
            <div className="DefaultSettingsPopup-input-col-os-2">
              <label className="control-os control--radio-os">
                Yes
                <input
                  type="radio"
                  name="bufferQuantity"
                  checked={form.bufferQuantity === "yes"}
                  value="yes"
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
              </label>
              <label className="control-os control--radio-os">
                No
                <input
                  type="radio"
                  name="bufferQuantity"
                  checked={form.bufferQuantity === "no"}
                  value="no"
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
              </label>
              <div>
                <div className="DefaultSettingsPopup-inputs-os">
                  <Input
                    type="text"
                    placeholder="Quantity"
                    name="inputBufferQuantity"
                    value={
                      form.bufferQuantity === "yes"
                        ? form.inputBufferQuantity
                        : "0"
                    }
                    onChange={handleInputChange}
                    disabled={form.bufferQuantity !== "yes"}
                  />
                </div>
              </div>
            </div>
          </div>
          {formError.bufferQuantity && (
            <div className="error-message-os pb-3 text-center">
              {formError.bufferQuantity}
            </div>
          )}
          {formError.inputBufferQuantity && (
            <div className="error-message-os pb-3 text-center">
              {formError.inputBufferQuantity}
            </div>
          )}

          {/* <div className="DefaultSettingsPopup-row-os-1">
            <span className="compulsary-fields-os">*</span>
            <div className="DefaultSettingsPopup-col-os">
              <span className="key-values-os">Expiry date :</span>
              <input
                type="date"
                placeholder="Enter sku"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {formError.expiryDate && (
            <div className="error-message-os">{formError.expiryDate}</div>
          )} */}
          <div className="DefaultSettingsPopup-input-row-os">
            <div className="DefaultSettingsPopup-input-col-os-1">
              <span className="compulsary-fields-os">*</span>
              <span className="key-values-os">Expiry Date :</span>
            </div>
            <div className="DefaultSettingsPopup-input-col-os-2">
              <Input
                type="date"
                placeholder="Enter sku"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {formError.expiryDate && (
            <div className="error-message-os text-center">
              {formError.expiryDate}
            </div>
          )}
          <div className="DefaultSettingsPopup-submit-os">
            <Button type="button" onClick={handleSave} title="Save" />
          </div>
          {/* <div className="success-message-os text-center pt-2">
            {notificationMessage ? notificationMessage : ""}
          </div> */}
        </form>
      </div>
    </section>
  );
};

export default DefaultSettingsForm;
