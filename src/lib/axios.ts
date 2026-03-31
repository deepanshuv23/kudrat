import axios from "axios";

export type ErrorResponse = {
  message: string;
  status: number;
};

export const api = axios.create({
  baseURL: "https://hello-ubderpxgha-em.a.run.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});
