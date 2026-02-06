import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { MobileNav } from "@/components/mobile-nav";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <MobileNav
            isAuthenticated={!!session}
            userRole={session?.user?.role}
            userName={session?.user?.name}
          />
        </div>

        {/* Logo */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-xl hidden sm:inline">宠物领养</span>
            <span className="font-bold text-lg sm:hidden">领养</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/pets"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              浏览宠物
            </Link>
            {session && (
              <>
                <Link
                  href="/favorites"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  我的收藏
                </Link>
                <Link
                  href="/applications"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  我的申请
                </Link>
              </>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                管理后台
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">注册</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
