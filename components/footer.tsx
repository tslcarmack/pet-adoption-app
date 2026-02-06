import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐾</span>
              <span className="font-bold text-xl">宠物领养</span>
            </div>
            <p className="text-sm text-muted-foreground">
              帮助流浪宠物找到温暖的家
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">关于我们</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  关于平台
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">领养指南</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide" className="text-muted-foreground hover:text-foreground">
                  领养流程
                </Link>
              </li>
              <li>
                <Link href="/prepare" className="text-muted-foreground hover:text-foreground">
                  领养准备
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-muted-foreground hover:text-foreground">
                  宠物护理
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">法律信息</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  使用条款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 宠物领养平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
