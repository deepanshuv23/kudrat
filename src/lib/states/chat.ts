import { observable } from "@legendapp/state";

export type Chat = {
  type: "user" | "bot";
  message: string;
};

export const chat$ = observable<Chat[]>([
  {
    type: "bot",
    message: "Hello! How can I help you?",
  },
]);
