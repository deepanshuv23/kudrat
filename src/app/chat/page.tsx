"use client";

import {
  ArrowBigUp,
  Bot,
  ChevronDown,
  CornerDownLeft,
  SendHorizonal,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { AIResponseSkeleton } from "~/components/ui/skeletons";
import { Textarea } from "~/components/ui/textarea";
import { useChatMutation } from "~/lib/model/chat";
import { auth$ } from "~/lib/states/auth";
import { chat$ } from "~/lib/states/chat";
import { settings$ } from "~/lib/states/settings";

export default function Chat() {
  const [downKeys, setDownKeys] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const chat = chat$.get();
  const settings = settings$.get();
  const auth = auth$.get();

  const lastChatRef = useRef<HTMLDivElement>(null);

  const chatQuery = useChatMutation({
    params: {
      prompt: message.trim(),
      location: settings.currentLocation ?? auth?.location[0],
    },
  });

  function handleSubmit() {
    if (chatQuery.isPending || !message.trim()) return;
    chat$.set((chat) => [...chat, { type: "user", message: message }]);
    chatQuery.mutate();
  }

  useEffect(() => {
    if (chatQuery.data) {
      chat$.set((chat) => [...chat, { type: "bot", message: chatQuery.data }]);
      setMessage("");
    }
  }, [chatQuery.data]);

  useEffect(() => {
    lastChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, lastChatRef]);

  return (
    <div className="relative -mb-4 flex flex-1 flex-col gap-4 overflow-hidden px-8 pt-4">
      <h2 className="text-3xl font-bold">AI Chat (Beta)</h2>
      <div className="relative mt-4 flex w-full flex-1 flex-col items-center gap-4 overflow-hidden">
        <div className="flex w-full flex-1 flex-col items-center gap-4 overflow-auto">
          <div className="flex w-full flex-1 flex-col gap-2 lg:max-w-[70vw]">
            {chat.map((chat, index) => (
              <div className="flex gap-4 border-b pb-4 pt-2" key={index}>
                <div
                  className={
                    "flex h-10 min-w-10 items-center justify-center rounded-full bg-secondary text-foreground"
                  }
                >
                  {chat.type === "bot" ? (
                    <Bot className="size-5" />
                  ) : (
                    <User className="size-5" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p>{chat.message}</p>
                </div>
              </div>
            ))}
            {chatQuery.isPending && (
              <div className="flex gap-4 border-b pb-4 pt-2">
                <div
                  className={
                    "flex h-10 min-w-10 items-center justify-center rounded-full bg-secondary text-foreground"
                  }
                >
                  <Bot className="size-5" />
                </div>
                <div className="flex w-full flex-col gap-1">
                  <AIResponseSkeleton />
                </div>
              </div>
            )}
            <div ref={lastChatRef} />
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 hidden lg:block"
          onClick={() => {
            lastChatRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          disabled={chatQuery.isPending}
        >
          <ChevronDown className="size-6 text-foreground" />
        </Button>
        <div className="grid w-full grid-cols-[1fr_10vw] lg:grid-cols-[1fr_min-content] items-center gap-4 rounded-t-xl border bg-background bg-opacity-80 p-4 lg:w-[50vw]">
          <Textarea
            rows={1}
            className="h-full resize-none"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              setDownKeys([...downKeys, e.key]);
            }}
            onKeyUp={(e) => {
              setDownKeys(downKeys.filter((key) => key !== e.key));
              if (downKeys.includes("Shift") && e.key === "Enter") {
                handleSubmit();
              }
            }}
            disabled={chatQuery.isPending}
          />
          <div className="flex flex-col justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              className="group w-full"
              onClick={handleSubmit}
            >
              <SendHorizonal className="size-6 text-muted-foreground group-hover:text-foreground" />
            </Button>
            <div className="hidden flex-col gap-1 lg:flex">
              <div className="flex items-center gap-1">
                <div className="center h-5 w-fit min-w-[1rem] rounded-md border border-foreground/20 px-1 text-xs text-foreground/50">
                  <ArrowBigUp className="size-4" />
                </div>
                +
                <div className="center h-5 w-fit min-w-[1rem] rounded-md border border-foreground/20 px-1 text-xs text-foreground/50">
                  <CornerDownLeft className="size-4" />
                </div>
              </div>
              <span className="text-xs text-foreground/50">Shift + Enter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
