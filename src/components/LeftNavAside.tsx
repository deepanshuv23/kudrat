"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { cn } from "~/lib/utils";
import { navRoutes } from "~/lib/constants";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settings$ } from "~/lib/states/settings";
import { Badge } from "./ui/badge";

export default function LeftNavAside() {
  const pathname = usePathname();

  const expandNav = settings$.leftNavOpen.get();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "group z-10 hidden w-14 flex-col border-r bg-background transition-all duration-300 lg:flex",
          expandNav && "w-[15vw]",
        )}
      >
        <div className={cn("flex h-full flex-col gap-4 px-2 md:py-5")}>
          <div
            className={cn(
              "flex min-h-14 items-center border-b lg:min-h-[60px]",
              expandNav
                ? "flex-row justify-between pl-2 2xl:pl-4"
                : "flex-col-reverse gap-4 pb-8",
            )}
          >
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="TrailGuard"
                className="size-8 object-contain"
              />
              <span className={cn(!expandNav && "sr-only")}>TrailGuard AI</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                settings$.leftNavOpen.set((prev) => !prev);
              }}
            >
              {expandNav ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeftOpen className="size-4" />
              )}
            </Button>
          </div>
          <div className="flex-1">
            <nav
              className={cn(
                "flex h-full flex-col items-start gap-2 text-sm font-medium",
                expandNav ? "px-2" : "items-center",
              )}
            >
              {navRoutes.map((route) => (
                <Tooltip key={route.title}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`${route.route}`}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                        pathname === route.route &&
                          "bg-accent text-accent-foreground",
                        route.end && "mt-auto",
                      )}
                    >
                      <route.icon className="size-5" />
                      <span className={cn(!expandNav && "sr-only")}>
                        {route.title}
                      </span>
                      {route.badge && (
                        <Badge
                          className={cn(
                            "text-xs",
                            !expandNav &&
                              "absolute -bottom-2 left-0 right-0 h-4 px-1 py-0.5 text-center text-[0.7rem]",
                          )}
                        >
                          {route.badge}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    className={cn(expandNav && "hidden")}
                    side="right"
                  >
                    {route.title}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
