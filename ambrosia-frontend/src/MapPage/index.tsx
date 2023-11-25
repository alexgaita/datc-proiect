import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import Map from "react-map-gl";
import { DrawControl } from "./draw-control";
import { ControlPanel } from "./control-panel";
import { RotatingLines } from "react-loader-spinner";
import area from "@turf/area";

import "./styles.css";
import { deleteZone, saveZone } from "../api/zones";

const TOKEN =
  "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ"; // Set your mapbox token here

export function MapPage() {
  const [features, setFeatures] = useState({});
  const [sendFeatures, setSendFeatures] = useState([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [isSending, setIsSending] = useState(false);

  const onUpdate = useCallback(
    async (e: any) => {
      setFeatures((currFeatures) => {
        const newFeatures: any = { ...currFeatures };
        for (const f of e.features) {
          if (newFeatures[f.id]) continue;
          newFeatures[f.id] = f;
        }

        const newAdded = Object.keys(newFeatures).filter(
          (x: any) => !Object.keys(currFeatures).includes(x)
        )[0];

        console.log(newFeatures[newAdded]);
        const size = Math.round(area(newFeatures[newAdded]) * 100) / 100;
        console.log(size);
        //aici vine axios cu newAdded
        if (!isSending) {
          setIsSending(true);
          saveZone({
            id: newFeatures[newAdded].id,
            size,
            points: newFeatures[newAdded].geometry.coordinates,
          })
            .then(() => console.log("save worked"))
            .catch((error) => console.error(error));
        }

        return newFeatures;
      });
    },
    [isSending]
  );

  const onDelete = useCallback((e: any) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      const deleted = Object.keys(currFeatures).filter(
        (x: any) => !Object.keys(newFeatures).includes(x)
      )[0];

      deleteZone(deleted)
        .then(() => console.log("save worked"))
        .catch((error) => console.error(error));

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
        <>
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
              onUpdate={() => {
                console.log("aici");
              }}
              onCreate={onUpdate}
              onDelete={onDelete}
            />
            <ControlPanel polygons={Object.values(features)} />
            <button
              className="button-23"
              onClick={() => {
                window.location.href = "admin";
              }}
            >
              {" "}
              To Admin Page
            </button>
          </Map>
        </>
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
