import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { Project } from "../interfaces/project.interface";

export function getProjectDetails(
  apiUrl: string,
  apiKey: string,
  apiHeader: string
): Promise<AxiosResponse<Project>> {
  const headers = new AxiosHeaders();
  headers.set("Content-Type", "application/json");
  headers.set(apiHeader, apiKey);
  return axios.get<Project>(apiUrl + "/api/v1/project/details", {
    headers: headers,
  });
}
