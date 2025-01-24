// latest code
import React, { useContext, useEffect, useState } from "react";
import "./DefaultSettingsPopup.css";
import MainHeading from "../../Shared/MainHeading/MainHeading";
import TooltipIcon from "../../../Assets/tooltip-icon.svg";
import { AppContext } from "../../../App";
import Button from "../../Shared/Button/Button";
import ButtonWhite from "../../Shared/ButtonWhite/ButtonWhite";
import axios from "axios";
import Select from "react-select";
import Input from "../../Shared/Input/Input";

const DefaultSettingsPopup = ({
  activePopup,
  setActivePopup,
  handleInputChange,
  form,
  setForm,
  handleSave,
  formError,
  handleSelectedRules,
  activeRules,
  // nonExistTag,
  setNonExistTag,
  defaultSettingsOption,
  setLocationData,
  locationData,
  handleLocationSelect,
  getDefaultSettings,
  getLocations,
}) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { csvData, token } = useContext(AppContext);
  const [locationOptions, setLocationOptions] = useState([]);

  // const [nonExistTag, setNonExistTag] = useState([]);
  // console.log("csvDatacsvDatacsvDatacsvDatacsvDatacsvData", csvData);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (form.selectionRules === "tag" && form.selectTag.length > 0) {
        const tagUrl = `${API_BASE_URL}/api/metchShopTags`;
        try {
          const response = await axios.post(
            tagUrl,
            {
              tags: form.singleTag,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log("form.selectTag ::", form.singleTag);
          setNonExistTag(response?.data?.status);
        } catch (error) {
          console.log("metchShopTags errorrrr", error);
          setNonExistTag(error?.response?.data?.status);
        }
      }
    };

    fetchData();
  }, [form.selectionRules, form.selectTag]);

  // console.log("form.singleTag ::", form.singleTag)

  // const HandleSelectTags = (selectedOptions) => {
  //   setForm((prevState) => ({
  //     ...prevState,
  //     selectTag: selectedOptions.map((option) => option.value),
  //     singleTag: selectedOptions[selectedOptions.length - 1]?.value, // Set the latest value in singleTag
  //   }));
  // };

  // const getLocations = async () => {
  //   try {
  //     const locationUrl = `${API_BASE_URL}/api/fetchStoreLocation`;
  //     const response = await axios.get(locationUrl, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setLocationData(response?.data?.response?.data?.shop?.locations?.edges);
  //   } catch (error) {
  //     console.log("fetchStoreLocation error", error);
  //   }
  // };

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

  // useEffect(() => {
  //   if (
  //     form.selectionRules === "tag" &&
  //     csvData.length > 0 &&
  //     form.selectTag.length === 0
  //   ) {
  //     const firstTag = csvData[0].Tags;
  //     if (firstTag) {
  //       setForm((prevState) => ({
  //         ...prevState,
  //         selectTag: [firstTag],
  //         singleTag: firstTag,
  //       }));
  //     }
  //   }
  // }, [form.selectionRules, csvData, setForm]);

  useEffect(() => {
    if (
      form.selectionRules === "tag" &&
      csvData.length > 0 &&
      form.selectTag.length === 0
    ) {
      const firstTag = csvData[0].Tags;
      if (firstTag) {
        setForm((prevState) => ({
          ...prevState,
          selectTag: [firstTag],
          singleTag: firstTag,
        }));
      }
    } else {
      setForm((prevState) => ({
        ...prevState,
        selectTag: [],
        singleTag: "",
      }));
    }
  }, [form.selectionRules, csvData, setForm]);

  const HandleSelectTags = (selectedOptions) => {
    console.log("selectedOptions ::", selectedOptions);
    setForm((prevState) => ({
      ...prevState,
      selectTag: selectedOptions.map((option) => option.value),
      singleTag: selectedOptions[selectedOptions.length - 1]?.value, // Set the latest value in singleTag
    }));
  };
  // console.log("form ::", form)
  // console.log("csvData ::", csvData);

  return (
    <section className="DefaultSettingsPopup-os">
      <div className="DefaultSettingsPopup-row-os">
        <div className="DefaultSettingsPopup-cross-btn-os">
          <button
            onClick={() => {
              if (activePopup) {
                setActivePopup(false);
              }
            }}
          >
            X
          </button>
        </div>
        {activeRules === "supplierRules" && (
          <form className="DefaultSettingsPopup-form-os">
            <div className="default-heading-bar-os">
              <MainHeading title="Supplier Quantity Update Rules" />
            </div>

            {/* {!defaultSettingsOption && (
              <div className="DefaultSettingsPopup-col-os">
                <label className="control-os control--radio-os">
                  <input
                    type="radio"
                    name="selectionRules"
                    value="defaultSettings"
                    checked={form.selectionRules === "defaultSettings"}
                    onChange={handleInputChange}
                  />
                  <div className="control-indicatoros"></div>
                  Apply your default settings at all products in the excels
                </label>
              </div>
            )} */}

            <div className="DefaultSettingsPopup-col-os">
              <label className="control-os control--radio-os">
                <input
                  type="radio"
                  name="selectionRules"
                  value="allExcels"
                  checked={form.selectionRules === "allExcels"}
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
                Quantity updates based on all the products from the CSV
              </label>
            </div>

            <div className="DefaultSettingsPopup-col-os">
              <label className="control-os control--radio-os">
                <input
                  type="radio"
                  name="selectionRules"
                  value="tag"
                  checked={form.selectionRules === "tag"}
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
                Quantity updates based on specific product tags
              </label>
              <div className="select-tags-os">
                {/* <Select
                  name="selectTag"
                  value={form.selectTag.map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={HandleSelectTags}
                  isDisabled={form.selectionRules !== "tag"}
                  isMulti={true}
                  options={(() => {
                    const tagsOptions = csvData.map((tag, index) => ({

                      value: tag?.Tags,
                      label: tag?.Tags,
                      // label: tag.Tags ? tag.Tags : "No tags available",
                    }));

                    // Check if there is at least one valid Tags property
                    const hasValidTags = csvData.some((tag) => tag.Tags);

                    // If no valid Tags, add a single "No tags available" option
                    if (!hasValidTags) {
                      tagsOptions.push({
                        value: "",
                        label: "",
                        // label: "No tags available",
                      });
                    }

                    return tagsOptions;
                  })()}
                /> */}

                {/* <Select
                  name="selectTag"
                  value={
                    form.selectTag.length > 0
                      ? form.selectTag.map((value) => ({
                          value,
                          label: value,
                        }))
                      : csvData.length > 0 && form.selectionRules === "tag"
                      ? [
                          {
                            value: csvData[0].Tags || "",
                            label: csvData[0].Tags || "",
                          },
                        ]
                      : [] // Default empty array if csvData is empty
                  }
                  onChange={HandleSelectTags}
                  isDisabled={form.selectionRules !== "tag"}
                  isMulti={true}
                  options={(() => {
                    const tagsOptions = csvData.map((tag, index) => ({
                      value: tag?.Tags,
                      label: tag?.Tags,
                    }));

                    // Check if there is at least one valid Tags property
                    const hasValidTags = csvData.some((tag) => tag.Tags);

                    // If no valid Tags, add a single "No tags available" option
                    if (!hasValidTags) {
                      tagsOptions.push({
                        value: "",
                        label: "",
                      });
                    }

                    return tagsOptions;
                  })()}
                /> */}

                {/* <Select
                  name="selectTag"
                  value={form.selectTag.map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={HandleSelectTags}
                  isDisabled={form.selectionRules !== "tag"}
                  isMulti={true}
                  options={csvData.map((tag) => ({
                    value: tag.Tags,
                    label: tag.Tags || "No tags available",
                  }))}
                /> */}

                <Select
                  name="selectTag"
                  value={form.selectTag.map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={HandleSelectTags}
                  isDisabled={form.selectionRules !== "tag"}
                  isMulti={true}
                  options={csvData.reduce((uniqueOtions, tag) => {
                    const existingOption = uniqueOtions.find(
                      (option) => option.value === tag.Tags
                    );
                    if (!existingOption) {
                      uniqueOtions.push({
                        value: tag.Tags,
                        label: tag.Tags || "No tags available",
                      });
                    }
                    return uniqueOtions;
                  }, [])}
                />

                <div className="select__arrow"></div>
              </div>
            </div>
            {formError.selectTag && (
              <div className="error-message-os pb-3 text-center">
                {formError.selectTag}
              </div>
            )}

            <div className="DefaultSettingsPopup-col-os">
              <label className="control-os control--radio-os">
                <input
                  type="radio"
                  name="selectionRules"
                  value="selectSku"
                  checked={form.selectionRules === "selectSku"}
                  onChange={handleInputChange}
                />
                <div className="control-indicatoros"></div>
                Quantity updates only for specific SKUs mentioned in CSV
              </label>
              <div className="tooptip-icon-os">
                <img src={TooltipIcon} alt="" />
                <span>
                  To update SKU, please update specific SKU's in the CSV file
                  and exclude the other sku's to the file{" "}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => {
                  handleSelectedRules("selectionRules");
                }}
                title="Continue"
              />
            </div>
          </form>
        )}

        {activeRules === "selectionRules" && (
          <form onSubmit={handleSave} className="DefaultSettingsPopup-form-os">
            <div className="default-heading-bar-os">
              <MainHeading title="Rules Settings" />
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
                <span className="key-values-os">
                  Choose Warehouse Location :
                </span>
              </div>
              <div className="DefaultSettingsPopup-input-col-os-2">
                <div className="DefaultSettingsPopup-inputs-os multiple-selector-os">
                  {/* <select
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    {data?.length > 0 &&
                      data?.map((loc, index) => {
                        const locationId = (loc?.node?.id).split(
                          "gid://shopify/Location/"
                        );
                        return (
                          <option key={index} value={locationId[1]}>
                            {loc?.node?.name}
                          </option>
                        );
                      })}
                  </select> */}

                  <Select
                    name="location"
                    value={form.location?.map((data) => ({
                      value: data.value,
                      label: data.label,
                    }))}
                    onChange={handleLocationSelect}
                    isMulti={true}
                    options={locationOptions}
                  />
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
              <ButtonWhite
                type={"button"}
                onClick={() => {
                  handleSelectedRules("supplierRules");
                }}
                title={"Back"}
              />
              <Button type={"button"} onClick={handleSave} title={"Save"} />
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default DefaultSettingsPopup;
