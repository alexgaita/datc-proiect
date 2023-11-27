import { Position } from "../MapPage/newMap";
import axios from "./axios";
import { AxiosResponse } from "axios";

const responseBody = (response: AxiosResponse) => response.data;

export type AmbroziaZone = {
  id: string;
  size: number;
  points: Position[][];
};

export const saveZone = async (zone: AmbroziaZone) =>
  await axios.post("/zones", zone);

export const deleteZone = async (id: string) =>
  await axios.delete(`/zones/${id}`);

export const updateZone = async (zone: AmbroziaZone) =>
  await axios.put(`/zones/${zone.id}`, zone);

export const getIsInZone = async (
  lng: number,
  lat: number,
): Promise<{ isInZone: boolean }> => {
  return axios
    .get(`/isInZone?x=${lng}&y=${lat}`)
    .then(responseBody)
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const getZones = (): Promise<AmbroziaZone[]> => {
  return axios
    .get(`/zones`)
    .then(responseBody)
    .catch((error) => {
      console.log(error);
      return [];
    });
};
