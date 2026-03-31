"use client";

import { PanelLeft, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { navRoutes, routesNames } from "~/lib/constants";
import { auth$ } from "~/lib/states/auth";
import { settings$ } from "~/lib/states/settings";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { analyticsOptions$ } from "~/lib/states/analytics";
import { cameraOptions$ } from "~/lib/states/camera";
import { api } from "~/lib/axios";
import { toast } from "sonner";

export default function Header() {
  const auth = auth$.get();
  const settings = settings$.get();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      !settings.currentLocation ||
      !auth?.location.includes(settings.currentLocation)
    ) {
      settings$.set({
        ...settings,
        currentLocation: auth?.location[0] ?? "",
      });
    }
  }, [settings, auth]);

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b bg-background bg-opacity-100 px-4 py-2 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden">
            <PanelLeft className="size-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="TrailGuard"
                className="size-8 object-contain"
              />
              <span className={"sr-only"}>TrailGuard</span>
            </Link>
            {navRoutes.map((route) => (
              <Link
                key={route.title}
                href={`${route.route}`}
                className={
                  "flex w-full items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                }
              >
                <route.icon className="size-5" />
                {route.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden lg:flex">
        <BreadcrumbList>
          {(pathname === "/" ? [""] : pathname.split("/")).map(
            (path, index, list) => (
              <div className="flex items-center gap-2" key={index}>
                <BreadcrumbItem>
                  {index === list.length - 1 ? (
                    <BreadcrumbPage>
                      {routesNames[path] ?? "Not Found"}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={`/${pathname
                          .split("/")
                          .slice(1, index + 1)
                          .join("/")}`}
                      >
                        {routesNames[path] ?? "Not Found"}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < list.length - 1 && <BreadcrumbSeparator />}
              </div>
            ),
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarFallback>
                <User className="size-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40" align="end">
          <DropdownMenuLabel>{auth?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Change Location</DropdownMenuLabel>
          <Select
            value={settings.currentLocation ?? auth?.location[0]}
            onValueChange={(value) => {
              settings$.set({
                ...settings,
                currentLocation: value,
              });
              cameraOptions$.set({
                location: value,
                subLocation: "",
                species: "",
                startDate: undefined,
                endDate: undefined,
              });
              analyticsOptions$.set({
                colors: {
                  human: "#00AAFE",
                  animal: "#F1003E",
                  vehicle: "#E6D101",
                  elephant: "#00E785",
                },
                detectionsPerMonth: {
                  species: "All",
                  subLocation: "All",
                },
                hotpotSubLocation: {
                  species: "All",
                  filter: "month",
                },
                detectionTime: {
                  species: "All",
                  subLocation: "All",
                },
                percentageChart: {
                  species: "All",
                },
                batteryUsage: {},
              });
              void queryClient.refetchQueries();
            }}
          >
            <SelectTrigger className="h-fit border-none hover:bg-muted">
              <SelectValue placeholder="Change Location" />
            </SelectTrigger>
            <SelectContent className="min-w-48">
              {auth?.location.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenuSeparator />
          <Link href="/settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await api.post("/auth/signout").catch(console.error);
              toast.success("Logged out successfully");
              auth$.set(null);
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
