import * as React from "react";
import { useState, useCallback } from "react";
import Map from "react-map-gl";
import { DrawControl } from "./draw-control";
import { ControlPanel } from "./control-panel";

const TOKEN =
  "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ"; // Set your mapbox token here

export function MapPage() {
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e: any) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e: any) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  return (
    <>
      <Map
        initialViewState={{
          longitude: -91.874,
          latitude: 42.76,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={TOKEN}
        style={{
          height: "80vh",
          width: "100vw",
          borderRadius: "20%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <ControlPanel polygons={Object.values(features)} />
      </Map>
    </>
  );
}
