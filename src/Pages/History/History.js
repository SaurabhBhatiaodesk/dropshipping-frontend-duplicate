import React from "react";
import MainHeading from "../Shared/MainHeading/MainHeading";
import CsvList from "./CsvList/CsvList";

const History = () => {
  return (
    <div className="container-os">
      <div className="default-heading-bar-os">
        <MainHeading title="CSV History" />
      </div>

      {/* <div className="history-content-os">
        {csvData.length > 0 ? (
          csvData.map((item, index) => {
            const keys = Object.keys(item);
            return (
              <div key={index}>
                {index === 0 && (
                  <div className="history-row-os history-headers-row-os">
                    {keys.map(
                      (key, idx) =>
                        (key === "shop" || key === "createdAt") && (
                          <div key={idx} className="history-col-os">
                            <h4>{key}</h4>
                          </div>
                        )
                    )}
                    <div className="history-col-os">
                      <h4>Download CSV</h4>
                    </div>
                  </div>
                )}

                <div className="history-row-os">
                  {keys.map(
                    (key, idx) =>
                      (key === "shop" || key === "createdAt") && (
                        <div key={idx} className="history-col-os">
                          <p>{item[key]}</p>
                        </div>
                      )
                  )}
                  <div className="history-col-os">
                    <Button
                      onClick={() => handleDownload(item.csvFileData)}
                      type="button"
                      title="Download"
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <>No CSV data found</>
        )}
      </div> */}

      <div className="history-content-os">
        <CsvList />
      </div>
    </div>
  );
};

export default History;
