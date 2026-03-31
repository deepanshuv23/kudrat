import { observable } from "@legendapp/state";

export const cameraOptions$ = observable<{
    location: string;
    subLocation: string;
    species: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
}>({
  location: "TEST-DELHI",
  subLocation: "",
  species: "",
  startDate: undefined,
  endDate: undefined,
});