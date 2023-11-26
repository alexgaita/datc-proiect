import React, { useEffect, useMemo, useRef } from "react";
import { useState, useCallback } from "react";
import { ControlPanel } from "./control-panel";
import { RotatingLines } from "react-loader-spinner";
import { Feature } from "geojson";
import "./styles.css";
import { deleteZone, getIsInZone, saveZone } from "../api/zones";
import useNewMap from "./newMap";

const TOKEN =
  "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ"; // Set your mapbox token here


export function MapPage({ isAdmin }: { isAdmin: boolean }) {
  const locationRef = useRef<{
    latitude: number;
    longitude: number;
  }>();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [features, setFeatures] = useState<Feature<any, any>[] | null>(null);
  const [isInZone, setIsInZone] = useState<boolean>(false);

  const { handleMapLoad } = useNewMap({setFeatures});

  function success(position: any) {
    console.log("position", position);
    const latitude: number = position.coords.latitude;
    const longitude: number = position.coords.longitude;
    locationRef.current = { latitude, longitude }
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
        timeout: 5000,
      };
      navigator.geolocation.getCurrentPosition(success, error, config);


    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    const intervalId = setInterval(() => {
      console.log("checking if map is loaded");
      const mapContainer = document.getElementById("map");
      if (mapContainer && locationRef.current) {
        // Container with id "map" is rendered
        clearInterval(intervalId);
        // Perform any actions you need here

        const { longitude, latitude } = locationRef.current; // Destructure the location object
        handleMapLoad(longitude, latitude);
      }
    }, 2000); // Check every 3 secondsn

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };

  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!locationRef.current) return;

      console.log('checking if in zone');

      const { longitude, latitude } = locationRef.current; // Destructure the location object

      getIsInZone(longitude, latitude).then((response) => {
        setIsInZone(response.isInZone);
      });
     
    }, 5000);

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };

  },[]);

  useEffect(() => {
    if(isInZone) {
      alert("You are in a zone!");
    }
  }, [isInZone])
  
  console.log(location);

  return (
    <>
      {location  ? (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 20, height: "100vh" }}>

          <div id="map" style={{
            height: "80vh",
            width: "100vw",
          }}>
          </div>
          <ControlPanel polygons={features}/>
          <div style={{ alignSelf: "center" }}>

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
