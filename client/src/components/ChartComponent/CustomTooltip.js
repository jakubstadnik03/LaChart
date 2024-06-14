// CustomTooltip.js
import React, { useEffect, useState } from "react";

const CustomTooltip = ({
  active,
  payload,
  colors,
  testings,
  secondsToPace,
  newTesting,
  sportSet,
}) => {
  const [sport, setSport] = useState("");
  useEffect(() => {
    setSport(sportSet);
  }, [sportSet]);
  useEffect(() => {
    setSport(testings[0]?.sport);
  }, [testings[0]?.sport]);

  if (active && payload && payload.length) {
    const displayPace = sport === "run" || sport === "swim";
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "5px",
          border: "1px solid #ccc",
        }}
      >
        <p>
          {displayPace
            ? `Pace: ${secondsToPace(payload[0].payload.power)}`
            : `Power: ${payload[0].payload.power} W`}
        </p>
        {!newTesting &&
          payload.map((entry, index) => (
            <>
              {entry.payload[`lactate${index + 1}`] !== undefined && (
                <p style={{ color: colors[index] }}>
                  Lactate{index + 1}: {entry.payload[`lactate${index + 1}`]}{" "}
                  mmol/L
                </p>
              )}
              {entry.payload[`heartRate${index + 1}`] !== undefined && (
                <p style={{ color: colors[index] }}>
                  Heart Rate{index + 1}:{" "}
                  {entry.payload[`heartRate${index + 1}`]} bpm
                </p>
              )}
            </>
          ))}
        {newTesting &&
          payload.map((entry, index) => (
            <>
              {entry.payload.lactate !== undefined && (
                <p style={{ color: colors[index] }}>
                  Lactate: {entry.payload.lactate} mmol/L
                </p>
              )}
              {entry.payload.heartRate !== undefined && (
                <p style={{ color: colors[index] }}>
                  Heart Rate: {entry.payload.heartRate} bpm
                </p>
              )}
            </>
          ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
