"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { raleway } from "@/fonts";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {};

function Navbar({}: Props) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = theme === "dark";
  return (
    <div className="container flex justify-between py-6">
      <div
        className={cn(
          raleway.className,
          "logo text-xl md:text-4xl font-extrabold"
        )}
      >
        <Link href="/">
          downloader.<span className="text-blut">online</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={toggleTheme} variant="outline">
          {isActive ? <Sun /> : <Moon />}
        </Button>
      </div>
      {/* <Switch
          id="airplane-mode"
          checked={isActive}
          onCheckedChange={toggleTheme}
        />
        <Label htmlFor="airplane-mode" className="text-sm md:text-2xl">
          Dark Mode
        </Label> */}
    </div>
  );
}

export default Navbar;
