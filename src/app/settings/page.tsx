"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "~/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { settings$ } from "~/lib/states/settings";

export default function Settings() {
  const { setTheme } = useTheme();

  const theme = settings$.theme.get();

  return (
    <div className="flex flex-col gap-4 px-8 pt-4">
      <h2 className="text-3xl font-bold">Settings</h2>
      <Separator />
      <h3 className="text-2xl font-medium">Appearance</h3>
      <h4 className="text-xl font-medium">Theme</h4>
      <div className="flex gap-4">
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(theme: "light" | "dark" | "system") => {
            setTheme(theme);
            settings$.theme.set(theme);
          }}
        >
          <ToggleGroupItem variant="outline" value="light">
            <Sun className="mr-2 size-4" />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="dark">
            <Moon className="mr-2 size-4" />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="system">
            <SunMoon className="mr-2 size-4" />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
