import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Teams", path: "/teams" },
  { label: "Training", path: "/training" },
  { label: "Analytics", path: "/analytics" },
];

export function Navigation() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-brand-logo">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Rugby Coach</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover-elevate px-3 py-2 rounded-md ${
                    location === item.path
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setOpen(false)}
                      className={`text-sm font-medium transition-colors hover-elevate px-3 py-2 rounded-md ${
                        location === item.path
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground"
                      }`}
                      data-testid={`link-mobile-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
