import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { api } from "../axios";

type ChatParams = {
  prompt: string;
  location: string;
};

export const useChatMutation = ({
  params,
  options,
}: {
  params: ChatParams;
  options?: UseMutationOptions<string>;
}) =>
  useMutation<string>({
    ...options,
    mutationFn: async () => {
      const response = await api.post("v1/chatbot/chat", params);
      return response.data as string;
    },
  });
