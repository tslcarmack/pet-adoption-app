# 已知问题和解决方案

本文档记录了开发和部署过程中遇到的问题及解决方案。

## 1. NextAuth UntrustedHost 错误

### 问题描述
```
[auth][error] UntrustedHost: Host must be trusted. URL was: http://localhost:3000/api/auth/session
TypeError: Cannot read properties of undefined (reading 'name')
```

### 原因
- NextAuth v5 默认要求显式信任主机
- 在生产环境中是安全特性，防止主机头攻击
- 本地开发和 Vercel 部署都需要此配置

### 解决方案
在 `lib/auth.ts` 的 NextAuth 配置中添加 `trustHost: true`：

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // 信任所有主机（开发和生产环境）
  providers: [
    // ...
  ],
  // ...
});
```

### 影响
- 允许应用在任何主机上运行（localhost, Vercel, 自定义域名）
- Vercel 会自动处理安全的主机验证
- 本地开发更方便

### 状态
✅ 已修复

---

## 2. 中间件 Edge Runtime 错误

### 问题描述
```
EvalError: Code generation from strings disallowed for this context
    at middleware.js
```

### 原因
- Next.js 中间件默认在 Edge Runtime 中运行
- NextAuth.js 使用的 bcryptjs 依赖 Node.js API (`process.nextTick`, `setImmediate`)
- Edge Runtime 不支持这些 API

### 解决方案
在 `middleware.ts` 中强制使用 Node.js runtime：

```typescript
export { auth as middleware } from "@/lib/auth";

// 强制使用 Node.js runtime
export const runtime = 'nodejs';

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
```

### 影响
- 中间件将在 Node.js runtime 运行，而不是 Edge Runtime
- 性能略有下降，但功能正常
- Vercel 部署时会自动处理

### 状态
✅ 已修复

---

## 2. 中间件 Edge Runtime 错误

### 问题描述
```
Property 'errors' does not exist on type 'ZodError<unknown>'
```

### 原因
Zod v4 将 `errors` 属性重命名为 `issues`

### 解决方案
将所有 `error.errors[0]` 替换为 `error.issues[0]`：

```typescript
// 错误
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { error: error.errors[0].message },
    { status: 400 }
  );
}

// 正确
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { error: error.issues[0].message },
    { status: 400 }
  );
}
```

### 受影响文件
- `app/api/applications/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/profile/password/route.ts`
- `app/api/profile/route.ts`
- `app/api/admin/pets/route.ts`
- `app/api/admin/pets/[id]/route.ts`

### 状态
✅ 已修复

---

## 3. Zod 错误处理

### 问题描述
```
Invalid module name in augmentation, module 'next-auth/jwt' cannot be found
```

### 原因
NextAuth v5 (beta) 的内部模块路径变更

### 解决方案
更新类型声明：

```typescript
// 错误
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// 正确
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
```

### 状态
✅ 已修复

---

## 4. NextAuth 类型声明

### 问题描述
```
Route "/pets/[id]" used params.id. params should be awaited before using its properties
```

### 原因
Next.js 15 中动态路由的 `params` 变为异步

### 解决方案
在使用前 await params：

```typescript
// 错误
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// 正确
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
}
```

### 状态
✅ 已修复

---

## 5. Next.js 15 params 处理

### 问题描述
```
Invalid src prop on next/image, hostname "images.unsplash.com" is not configured
```

### 原因
使用外部图片源需要在 `next.config.ts` 中配置

### 解决方案
添加 `remotePatterns`：

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
    ],
  },
};
```

### 状态
✅ 已修复

---

## 6. 图片域名配置

### 问题描述
```
TypeError: Cannot convert undefined or null to object
```

### 原因
Prisma schema 中的枚举名称与导入名称不匹配

### 解决方案
使用正确的枚举名称：

```typescript
// 错误
import { Species, Gender, Size } from "@prisma/client";

// 正确
import { PetSpecies, PetGender, PetSize } from "@prisma/client";
```

### 状态
✅ 已修复

---

## 7. Prisma 枚举导入

### 问题描述
```
Type 'T' is generic and can only be indexed for reading
```

### 原因
泛型对象无法直接写入

### 解决方案
使用 `any` 临时类型并断言返回：

```typescript
// 错误
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  sanitized[key] = sanitizeString(value); // 错误
  return sanitized;
}

// 正确
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = { ...obj };
  sanitized[key] = sanitizeString(value); // 正确
  return sanitized as T;
}
```

### 状态
✅ 已修复

---

## 8. TypeScript 泛型类型安全

### 问题描述
```
Property 'ip' does not exist on type 'NextRequest'
```

### 原因
Next.js Request 对象没有 `ip` 属性

### 解决方案
从请求头获取 IP：

```typescript
// 错误
const ip = req.ip || req.headers.get("x-forwarded-for");

// 正确
const ip = req.headers.get("x-forwarded-for") || 
           req.headers.get("x-real-ip") || 
           "unknown";
```

### 状态
✅ 已修复

---

## 9. 限流 IP 获取

### 问题描述
```
Do not use an <a> element to navigate. Use <Link /> from next/link instead
```

### 原因
ESLint 规则要求使用 Next.js Link 组件

### 解决方案
替换所有内部链接：

```typescript
// 错误
<Button asChild>
  <a href="/home">返回首页</a>
</Button>

// 正确
import Link from "next/link";

<Button asChild>
  <Link href="/home">返回首页</Link>
</Button>
```

### 受影响文件
- `app/error.tsx`
- `app/global-error.tsx`
- `components/profile-content.tsx`

### 状态
✅ 已修复

---

## 10. Link 组件使用

以下警告不影响功能，可在后续优化：

### 1. useEffect 依赖警告
```
React Hook useEffect has a missing dependency: 'fetchPets'
```

**位置**: `components/admin-pets-list.tsx:59`

**建议**: 使用 `useCallback` 包装 `fetchPets` 或添加到依赖数组

### 2. img 标签警告
```
Using <img> could result in slower LCP
```

**位置**: `components/pet-form.tsx:332`

**建议**: 替换为 `<Image />` 组件

---

## 预防措施

### 1. 依赖更新
定期运行以检查问题：
```bash
npm audit
npm outdated
```

### 2. 类型检查
部署前运行：
```bash
npm run type-check
```

### 3. 构建测试
本地测试生产构建：
```bash
npm run build
npm start
```

### 4. 环境变量
使用 `.env.example` 作为模板，确保所有必需变量已设置

---

## 获取帮助

遇到新问题时：

1. **检查构建日志**: `npm run build` 输出
2. **查看控制台**: 浏览器开发者工具
3. **搜索文档**:
   - [Next.js](https://nextjs.org/docs)
   - [Prisma](https://www.prisma.io/docs)
   - [NextAuth.js](https://next-auth.js.org/)
4. **GitHub Issues**: 搜索相关问题
5. **Stack Overflow**: 带标签搜索

---

**最后更新**: 2026-02-06  
**已解决问题数**: 10  
**待解决警告数**: 2 (非致命)
