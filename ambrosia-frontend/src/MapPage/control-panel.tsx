import * as React from "react";
// @ts-ignore
import area from "@turf/area";
import { convertValue } from "../AdminPage/chart";

export function ControlPanel({ polygons }: any) {
  console.log("intra aici in control panel");

  const calculatePolygonArea = (polygons: any) => {
    let polygonArea = 0;
    polygons.forEach((polygon: any) => {
      polygonArea += area(polygon);
    });
    return polygonArea;
  };

  if (!polygons) {
    return null;
  }

  return (
    <div
      className="control-panel"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        margin: "10px",
        backgroundColor: "white",
        textAlign: "center",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: 100,
        minWidth: 100,
      }}
    >
      <h3>Area</h3>
      {calculatePolygonArea(polygons) > 0 ? (
        <p>
          {convertValue(calculatePolygonArea(polygons))} <br />
        </p>
      ) : (
        <p>Start Drawing</p>
      )}
    </div>
  );
}
