import React from "react";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";


const useNewMap = () => {

    const handleMapLoad = () => {

        mapboxgl.accessToken = "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ";
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [21.2272, 45.7494], // starting position [lng, lat]
            zoom: 12 // starting zoom
        });

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            // Select which mapbox-gl-draw control buttons to add to the map.
            controls: {
                polygon: true,
                trash: true
            },
            // Set mapbox-gl-draw to draw by default.
            // The user does not have to click the polygon control button first.
            defaultMode: 'draw_polygon'
        });

        map.addControl(draw, 'top-left');
    }
    return {
        handleMapLoad
    }

}


export default useNewMap;