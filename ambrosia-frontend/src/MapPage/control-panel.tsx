import * as React from "react";
// @ts-ignore
import area from "@turf/area";

export function ControlPanel(props: any) {
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
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
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h3>Draw Polygon</h3>
      {polygonArea > 0 && (
        <p>
          {Math.round(polygonArea * 100) / 100} <br />
          square meters
        </p>
      )}
    </div>
  );
}
