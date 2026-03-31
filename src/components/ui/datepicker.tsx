"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, setParamsinDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "./separator";
import { Input } from "./input";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { ScrollArea } from "./scroll-area";

interface DatePickerProps {
  mode: "single";
  dateType: "start" | "end";
  time?: boolean;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  showIcon?: boolean;
  error?: string;
}

export function DateTimePicker(props: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<Date | undefined>(props.value);
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(ref.current?.clientHeight ?? 0);

  function onChange(date: Date | undefined) {
    setDate(date);
    props.onChange(date);
  }

  const scrollToSelected = useCallback(() => {
    const element = document.querySelectorAll("button[data-state=on]");
    element.forEach((e) => {
      e.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center",
      });
    });
    // element[1].scrollIntoView({
    //   behavior: "smooth",
    //   block: "center",
    //   inline: "center",
    // });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHeight(ref.current?.getBoundingClientRect().height ?? 0);
    }, 100);
    window.addEventListener("resize", () => {
      setHeight(ref.current?.getBoundingClientRect().height ?? 0);
    });
  }, [ref, open]);

  return (
    <>
      <style jsx global>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
      </style>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                props.error && "border-red-800",
              )}
            >
              {props.showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
              {date
                ? format(date, "MMM dd, yyyy HH:mm") ?? ""
                : `Select ${!props.time ? "a" : ""} date ${props.time ? " & time" : ""}`}
            </Button>
            <span className="text-xs text-red-700">{props.error}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex h-full w-auto gap-2 p-0">
          <div ref={ref} className="h-fit">
            <Calendar
              mode={props.mode}
              selected={date}
              onSelect={(newDate: Date | undefined) => {
                if (!newDate) return;
                let timedDate = newDate;
                timedDate = setParamsinDate(newDate, {
                  hours: date
                    ? date.getHours()
                    : props.dateType === "start"
                      ? 0
                      : 23,
                  minutes: date
                    ? date.getMinutes()
                    : props.dateType === "start"
                      ? 0
                      : 59,
                  seconds: date
                    ? date.getSeconds()
                    : props.dateType === "start"
                      ? 0
                      : 59,
                })!;
                onChange(timedDate);
              }}
              initialFocus
              onClear={() => {
                onChange(undefined);
              }}
            />
          </div>
          <Separator orientation="vertical" className="my-2 h-auto" />
          <div
            className="grid grid-cols-2 gap-4 p-2 py-3"
            style={{ height }}
            ref={scrollToSelected}
          >
            <div className="col-span-2 flex items-center gap-2">
              <Input
                value={date?.getHours() ?? 0}
                className="w-fit text-center"
                type="number"
                min={0}
                max={24}
                onChange={(e) => {
                  if (!date) {
                    toast.error("Please select a date first");
                    return;
                  }
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 24) {
                    onChange(setParamsinDate(date, { hours: value }));
                  } else {
                    toast.error("Please select a valid time");
                  }
                }}
              />
              <span className="text-lg">:</span>
              <Input
                value={date?.getMinutes() ?? 0}
                className="w-fit text-center"
                type="number"
                min={0}
                max={60}
                onChange={(e) => {
                  if (!date) {
                    toast.error("Please select a date first");
                    return;
                  }
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 60) {
                    console.log(date, value);
                    onChange(setParamsinDate(date, { minutes: value }));
                  } else {
                    toast.error("Please select a valid time");
                  }
                }}
              />
            </div>
            {/* <Select
              value={(date?.getHours() ?? 0) >= 12 ? "PM" : "AM"}
              onValueChange={(value) => {
                console.log(value);
                const hours = date?.getHours() ?? 0;
                if (value === "AM") {
                  onChange(setParamsinDate(date, { hours: hours - 12 }));
                } else {
                  onChange(setParamsinDate(date, { hours: hours + 12 }));
                }
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select> */}
            <ScrollArea className="flex flex-col gap-2 overflow-auto">
              <ToggleGroup
                type="single"
                className="flex flex-col"
                value={date?.getHours().toString()}
                onValueChange={(value) => {
                  const hours = Number(value);
                  onChange(setParamsinDate(date, { hours: hours }));
                }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <ToggleGroupItem
                    key={i}
                    value={i.toString()}
                    className="w-full "
                  >
                    {i < 10 ? `0${i}` : i}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </ScrollArea>
            <ScrollArea className="flex flex-col gap-2 overflow-auto">
              <ToggleGroup
                type="single"
                className="flex flex-col"
                value={date?.getMinutes().toString()}
                onValueChange={(value) => {
                  const minutes = Number(value);
                  onChange(setParamsinDate(date, { minutes: minutes }));
                }}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <ToggleGroupItem
                    key={i}
                    value={i.toString()}
                    className="w-full"
                  >
                    {i < 10 ? `0${i}` : i}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
