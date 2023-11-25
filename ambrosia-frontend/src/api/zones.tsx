import axios from "./axios";
import { AxiosResponse } from "axios";

const responseBody = (response: AxiosResponse) => response.data;

export type AmbroziaZone = {
  id: string;
  size: number;
  points: number[][];
};

export const saveZone = async (zone: AmbroziaZone) =>
  await axios.post("/zones", zone);

export const deleteZone = async (id: string) =>
  await axios.delete(`/zones/${id}`);
