import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import Map, { Marker } from "react-map-gl";
import { DrawControl } from "./draw-control";
import { ControlPanel } from "./control-panel";
import { RotatingLines } from "react-loader-spinner";
import area from "@turf/area";

import "./styles.css";
import { deleteZone, saveZone } from "../api/zones";

const TOKEN =
  "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ"; // Set your mapbox token here

export function MapPage({ isAdmin }: { isAdmin: boolean }) {
  const [features, setFeatures] = useState({});
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
    setLocation({ latitude: 45.7494, longitude: 21.2272 });
  }

  useEffect(() => {
    if (navigator.geolocation) {
      const config = {
        enableHighAccuracy: true,
        // response should provide a more accurate position
        timeout: 10000,
        // the device is allowed to take 10 seconds in order to return a position
      };
      navigator.geolocation.getCurrentPosition(success, error, config);


    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      {location ? (
        <div style={{display:"flex", flexDirection:"column",rowGap: 20, height:"100vh"}}>
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
            <Marker
              longitude={location.longitude}
              latitude={location.latitude}
            />
            <ControlPanel polygons={Object.values(features)} />

            </Map>

            <div style={{alignSelf:"center"}}>

            {isAdmin && (
              <button
                className="button-23"
                onClick={() => {
                  window.location.href = "admin";
                }}
              >
                {" "}
                To Admin Page
              </button>
            )}
            <button
              className="button-23"
              style={{ marginLeft: isAdmin ? 10 : 0 }}
              onClick={() => {
                localStorage.setItem("isAdmin", "null");
                window.location.href = "/";
              }}
            >
              {" "}
              Logout
            </button>
            </div>

        </div>
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
