import * as React from "react";
import { cn } from "@/lib/utils";

export interface AppCardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "hover" | "border" | "gradient";
  children?: React.ReactNode;
}

export function AppCard({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}: AppCardProps) {
  return (
    <div
      className={cn(
        // 기본 스타일
        "bg-background/50 backdrop-blur-sm border border-border/50",
        "transition-all duration-200 ease-in-out",

        // variant별 스타일
        {
          "hover:bg-background/60 hover:border-border/70 hover:shadow-lg hover:-translate-y-0.5":
            variant === "hover",
          "border-2": variant === "border",
          "bg-gradient-to-br from-background/60 to-background/30":
            variant === "gradient",
        },

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AppCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        className
      )}
      {...props}
    />
  );
}

export function AppCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function AppCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function AppCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("p-6 pt-0", className)} 
      {...props} 
    />
  );
}

export function AppCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
} 