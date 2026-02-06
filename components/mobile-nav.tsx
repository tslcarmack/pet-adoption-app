"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Search, Heart, FileText, User, LogIn, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  isAuthenticated: boolean;
  userRole?: string;
  userName?: string | null;
}

export function MobileNav({ isAuthenticated, userRole, userName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "首页", icon: Home },
    { href: "/pets", label: "浏览宠物", icon: Search },
  ];

  const authenticatedItems = [
    { href: "/favorites", label: "我的收藏", icon: Heart },
    { href: "/applications", label: "我的申请", icon: FileText },
    { href: "/profile", label: "个人中心", icon: User },
  ];

  const adminItems = [
    { href: "/admin", label: "管理后台", icon: Shield },
  ];

  const unauthenticatedItems = [
    { href: "/login", label: "登录", icon: LogIn },
    { href: "/register", label: "注册", icon: UserPlus },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span>宠物领养平台</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-8">
          {/* User Info */}
          {isAuthenticated && userName && (
            <>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">欢迎回来</p>
                <p className="font-medium">{userName}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Main Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted ${
                    isActive(item.href) ? "bg-muted font-medium" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Authenticated User Items */}
          {isAuthenticated && (
            <>
              <Separator />
              <nav className="flex flex-col gap-2">
                {authenticatedItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted ${
                        isActive(item.href) ? "bg-muted font-medium" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </>
          )}

          {/* Admin Items */}
          {isAuthenticated && userRole === "ADMIN" && (
            <>
              <Separator />
              <nav className="flex flex-col gap-2">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted ${
                        isActive(item.href) ? "bg-muted font-medium" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </>
          )}

          {/* Unauthenticated Items */}
          {!isAuthenticated && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                {unauthenticatedItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant={item.href === "/register" ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
