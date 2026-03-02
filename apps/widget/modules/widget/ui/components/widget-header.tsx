import React from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { HomeIcon, InboxIcon } from "lucide-react";

type WidgetHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export const WidgetHeader = ({ children, className }: WidgetHeaderProps) => {
  const screen = "selection";

  return (
    <header
      className={cn(
        "bg-gradient-to-b from-primary to-[#0b63f3] p-4 text-primary-foreground",
        className
      )}
    >
      {children}
    </header>
  );
};