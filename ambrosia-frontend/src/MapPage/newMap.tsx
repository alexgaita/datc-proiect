import React, { useCallback, useMemo, useState } from "react";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { AmbroziaZone, getZones, updateZone } from "../api/zones";
import { FeatureCollection, Feature } from 'geojson';
import { deleteZone, saveZone } from "../api/zones";
import area from "@turf/area";
import { ControlPanel } from "./control-panel";

export type Position = number[];

const useNewMap = ({ setFeatures }: { setFeatures: any }) => {


    const mapZonesToFeatures = (zones: AmbroziaZone[]): FeatureCollection => {
        return {
            type: "FeatureCollection",
            features: zones.map((zone) => ({
                id: zone.id,
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: zone.points,
                },
            })),
        };
    };

    const onCreate = useCallback(
        async (e: any) => {
            setFeatures((currFeatures: any) => {
                const newFeature = e.features[0];
                console.log('newFeature', newFeature);

                const size = Math.round(area(newFeature) * 100) / 100;
                console.log(size);


                saveZone({
                    id: newFeature.id,
                    size,
                    points: newFeature.geometry.coordinates,
                })
                    .then(() => console.log("save worked"))
                    .catch((error) => console.error(error));


                const newFeatures = [...currFeatures, newFeature]
                return newFeatures;
            });
        },
        []
    );

    const onUpdate = useCallback(
        async (e: any) => {
            setFeatures((currFeatures: any[]) => {
                const newFeature = e.features[0];
                const size = Math.round(area(newFeature) * 100) / 100;

                const newFeatures: any = currFeatures.filter((zone) => !e.features.map((feature: any) => feature.id).includes(zone.id));

                updateZone({
                    id: newFeature.id,
                    size,
                    points: newFeature.geometry.coordinates,
                })
                    .then(() => console.log("update worked"))
                    .catch((error) => console.error(error));

                newFeatures.push(newFeature)

                return newFeatures;
            });
        },
        []
    );

    const onDelete = useCallback((e: any) => {
        setFeatures((currFeatures: any[]) => {
            const newFeatures: any = currFeatures.filter((zone) => !e.features.map((feature: any) => feature.id).includes(zone.id));

            e.features.forEach((feature: any) => {
                deleteZone(feature.id)
                    .then(() => console.log("deleted zone worked"))
                    .catch((error) => console.error(error));
            });

            return newFeatures;
        });
    }, []);

    const handleMapLoad = async (lng: number,lat: number) => {

        console.log("intra aici macar")

        mapboxgl.accessToken = "pk.eyJ1IjoiYWxleDg4MTIxMyIsImEiOiJjbHBkMTBmY2kwdmRkMmpxdDhwZ2kzN2J6In0.iTBF38aHM4k7CqWeqV3kiQ";
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [lng, lat], // starting position [lng, lat]
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

        map.on('draw.create', onCreate);
        map.on('draw.delete', onDelete);
        map.on('draw.update', onUpdate);

        map.on('load', async () => {

            const zones = await getZones();

            setFeatures(mapZonesToFeatures(zones).features);

            draw.add(mapZonesToFeatures(zones));

        });

        const marker1 = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);

    }


    return {
        handleMapLoad,
    }

}

export default useNewMap;