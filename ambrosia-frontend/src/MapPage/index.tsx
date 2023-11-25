import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import Map from "react-map-gl";
import { DrawControl } from "./draw-control";
import { ControlPanel } from "./control-panel";
import { ColorRing, RotatingLines } from "react-loader-spinner";

const TOKEN =
  "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ"; // Set your mapbox token here

export function MapPage() {
  const [features, setFeatures] = useState({});
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

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

  function success(position: any) {
    const latitude: number = position.coords.latitude;
    const longitude: number = position.coords.longitude;
    setLocation({ latitude, longitude });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  useEffect(() => {
    if (navigator.geolocation) {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(success, error);
        if (location === undefined) {
          setLocation({ latitude: 45.7494, longitude: 21.2272 });
        }
      }, 5000);
    } else {
      console.log("error");
    }
  }, []);

  return (
    <>
      {location ? (
        <Map
          initialViewState={{
            longitude: location?.longitude,
            latitude: location?.latitude,
            zoom: 12,
          }}
          interactive
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
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="200"
            visible={true}
          />
        </div>
      )}
    </>
  );
}
