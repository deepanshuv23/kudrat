import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import { cleanObject, setColor } from "../utils";
import { type PaginatedResponse } from "../types";

type SubLocationNames = {
  sublocation: string;
}[];
type SubLocationNamesParams = {
  location: string;
};

export const useSubLocationNames = ({
  params,
}: {
  params: SubLocationNamesParams;
}) =>
  useQuery<SubLocationNames>({
    queryKey: ["subLocationNames", params],
    queryFn: async () => {
      const response = await api.get("data/sublocation", {
        params,
      });
      return response.data as SubLocationNames;
    },
  });

type SpeciesNames = {
  species: string;
}[];
type SpeciesNamesParams = {
  location: string;
};

export const useSpeciesNames = ({ params }: { params: SpeciesNamesParams }) =>
  useQuery<SpeciesNames>({
    queryKey: ["speciesNames", params],
    queryFn: async () => {
      const response = (
        (
          await api.get("data/species", {
            params,
          })
        ).data as SpeciesNames
      ).map((item) => ({
        ...item,
        species: item.species.replaceAll(" ", "_"),
      }));
      for (let i = 0; i < response.length; i++) {
        if (response[i]) {
          // @ts-expect-error response[i] can be undefined
          setColor(response[i]?.species, i);
        }
      }
      return response;
    },
  });

export type CameraImage = {
  imageId: string;
  dateTime: string;
  jpegString: string;
  [key: string]: string;
};
export type CameraImages = CameraImage[];
type CameraImageResp = PaginatedResponse<CameraImages>;
type CameraImagesParams = {
  location: string;
  sublocation: string;
  species: string;
  startDate?: string;
  endDate?: string;
  pageIndex?: number;
  pageSize?: number;
};

export const useCameraImages = ({
  params,
  options,
}: {
  params: CameraImagesParams;
  options?: UseQueryOptions<CameraImageResp>;
}) => {
  return useQuery<CameraImageResp>({
    ...options,
    queryKey: ["cameraImages", params],
    queryFn: async () => {
      const response = await api.get("data/image", {
        params: cleanObject<CameraImagesParams>(params),
      });
      return response.data as CameraImageResp;
    },
  });
};
