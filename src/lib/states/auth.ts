import { observable } from "@legendapp/state";

export type UserAuth = {
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
  location: string[];
};

export const auth$ = observable<UserAuth | null>(null);
