"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <div className="container flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">系统错误</h1>
              <p className="text-muted-foreground">
                应用遇到了严重错误，请刷新页面或联系管理员
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  错误代码: {error.digest}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 border rounded-md hover:bg-accent"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
