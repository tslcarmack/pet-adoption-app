# 性能优化指南

本指南提供宠物领养平台的性能优化策略和最佳实践。

## 目录

1. [性能指标](#性能指标)
2. [前端优化](#前端优化)
3. [后端优化](#后端优化)
4. [数据库优化](#数据库优化)
5. [缓存策略](#缓存策略)
6. [监控和分析](#监控和分析)

## 性能指标

### 目标指标

**页面加载**:
- 首次内容绘制（FCP）: < 1.8s
- 最大内容绘制（LCP）: < 2.5s
- 首次输入延迟（FID）: < 100ms
- 累积布局偏移（CLS）: < 0.1
- 首字节时间（TTFB）: < 800ms

**API 响应**:
- 简单查询: < 200ms
- 复杂查询: < 500ms
- 写操作: < 300ms

**Lighthouse 分数**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## 前端优化

### 1. 图片优化

已实现 Next.js Image 组件，继续优化：

**使用 WebP 格式**:
```typescript
// next.config.ts
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**懒加载策略**:
```typescript
<Image
  src={pet.images[0]}
  alt={pet.name}
  loading="lazy"  // 懒加载
  placeholder="blur"  // 使用模糊占位符
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**优先级设置**:
```typescript
// 首屏关键图片
<Image priority src={heroImage} alt="Hero" />

// 其他图片懒加载
<Image loading="lazy" src={otherImage} alt="Other" />
```

### 2. 代码分割

**动态导入**:
```typescript
// components/heavy-component.tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./chart'), {
  loading: () => <p>加载中...</p>,
  ssr: false,  // 仅客户端渲染
});
```

**路由预取**:
```typescript
// 禁用自动预取（如果需要）
<Link href="/pets" prefetch={false}>

// 或使用手动预取
import { useRouter } from 'next/navigation';
const router = useRouter();
router.prefetch('/pets');
```

### 3. 字体优化

在 `layout.tsx` 中使用 Next.js 字体：

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // 字体交换策略
  preload: true,
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      {children}
    </html>
  );
}
```

### 4. CSS 优化

**移除未使用的样式**:
TailwindCSS 自动处理，确保配置正确：

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
};
```

**关键 CSS 内联**:
Next.js 自动处理，无需额外配置。

### 5. JavaScript 优化

**减少包大小**:
```bash
# 分析包大小
npm install --save-dev @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ...配置
});

# 运行分析
ANALYZE=true npm run build
```

**移除 console.log**:
```javascript
// next.config.ts
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### 6. React 性能

**使用 React.memo**:
```typescript
import { memo } from 'react';

export const PetCard = memo(function PetCard({ pet }) {
  // 组件逻辑
}, (prevProps, nextProps) => {
  return prevProps.pet.id === nextProps.pet.id;
});
```

**useCallback 和 useMemo**:
```typescript
const handleClick = useCallback(() => {
  // 处理函数
}, [dependencies]);

const filteredPets = useMemo(() => {
  return pets.filter(pet => pet.status === 'AVAILABLE');
}, [pets]);
```

**虚拟滚动（大列表）**:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// 适用于超过 100 项的列表
```

## 后端优化

### 1. API 路由优化

**使用 Edge Runtime（适合轻量级 API）**:
```typescript
// app/api/pets/route.ts
export const runtime = 'edge';  // 或 'nodejs'

export async function GET(request: Request) {
  // API 逻辑
}
```

**设置缓存头**:
```typescript
export async function GET() {
  const pets = await prisma.pet.findMany();
  
  return NextResponse.json(pets, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 2. 数据序列化优化

**避免发送不必要的数据**:
```typescript
// 不好：发送所有字段
const pets = await prisma.pet.findMany();

// 好：只发送需要的字段
const pets = await prisma.pet.findMany({
  select: {
    id: true,
    name: true,
    images: true,
    species: true,
    age: true,
    status: true,
  },
});
```

### 3. 并行请求

**使用 Promise.all**:
```typescript
// 串行（慢）
const user = await prisma.user.findUnique({ where: { id } });
const pets = await prisma.pet.findMany();

// 并行（快）
const [user, pets] = await Promise.all([
  prisma.user.findUnique({ where: { id } }),
  prisma.pet.findMany(),
]);
```

## 数据库优化

### 1. 索引策略

在 `schema.prisma` 中添加索引：

```prisma
model Pet {
  id        String     @id @default(cuid())
  name      String
  species   PetSpecies
  status    PetStatus
  location  String
  createdAt DateTime   @default(now())

  // 单列索引
  @@index([species])
  @@index([status])
  @@index([location])
  @@index([createdAt])
  
  // 复合索引（常见查询组合）
  @@index([species, status])
  @@index([status, createdAt])
  @@index([location, species, status])
}

model AdoptionApplication {
  // ...字段
  
  @@index([userId])
  @@index([petId])
  @@index([status])
  @@index([submittedAt])
}
```

### 2. 查询优化

**使用 select 替代全字段查询**:
```typescript
// 宠物列表只需要基本信息
const pets = await prisma.pet.findMany({
  select: {
    id: true,
    name: true,
    species: true,
    images: true,
    age: true,
    status: true,
  },
  where: { status: 'AVAILABLE' },
  orderBy: { createdAt: 'desc' },
  take: 20,
});
```

**预加载关系（避免 N+1）**:
```typescript
// N+1 问题
const applications = await prisma.adoptionApplication.findMany();
for (const app of applications) {
  const user = await prisma.user.findUnique({ where: { id: app.userId } });
}

// 解决方案：使用 include
const applications = await prisma.adoptionApplication.findMany({
  include: {
    user: {
      select: { id: true, name: true, email: true },
    },
    pet: {
      select: { id: true, name: true, images: true },
    },
  },
});
```

**分页优化（游标分页）**:
```typescript
// 偏移分页（在大数据集上较慢）
const pets = await prisma.pet.findMany({
  skip: (page - 1) * 20,
  take: 20,
});

// 游标分页（更快）
const pets = await prisma.pet.findMany({
  take: 20,
  cursor: lastPetId ? { id: lastPetId } : undefined,
  skip: lastPetId ? 1 : 0,
  orderBy: { createdAt: 'desc' },
});
```

### 3. 连接池配置

在 DATABASE_URL 中配置：

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&connection_limit=10&pool_timeout=20"
```

Prisma 配置：

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
});
```

## 缓存策略

### 1. Next.js 缓存

**页面级缓存**:
```typescript
// app/pets/page.tsx
export const revalidate = 60;  // 60 秒后重新验证

export default async function PetsPage() {
  const pets = await prisma.pet.findMany();
  return <PetList pets={pets} />;
}
```

**API 路由缓存**:
```typescript
export async function GET() {
  const pets = await prisma.pet.findMany();
  
  return NextResponse.json(pets, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 2. 数据缓存（高级，可选）

使用 Redis 或内存缓存：

```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; expiry: number }>();

export function setCache(key: string, data: any, ttl: number) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl * 1000,
  });
}

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item.data as T;
}

// 使用
export async function GET() {
  const cacheKey = 'pets:available';
  const cached = getCache(cacheKey);
  
  if (cached) {
    return NextResponse.json(cached);
  }
  
  const pets = await prisma.pet.findMany({
    where: { status: 'AVAILABLE' },
  });
  
  setCache(cacheKey, pets, 60);  // 缓存 60 秒
  return NextResponse.json(pets);
}
```

### 3. 浏览器缓存

利用 Service Worker（PWA）缓存静态资源。

## 监控和分析

### 1. Vercel Analytics

在 Vercel Dashboard 启用：
- Analytics: 流量和用户行为
- Speed Insights: 实际用户性能指标
- Web Vitals: Core Web Vitals 监控

### 2. 自定义监控

**性能监控**:
```typescript
// lib/monitor.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  
  if (duration > 1000) {
    console.warn(`Slow operation: ${name} took ${duration}ms`);
  }
}

// 使用
measurePerformance('fetch-pets', async () => {
  await prisma.pet.findMany();
});
```

**数据库查询监控**:
```typescript
// lib/prisma.ts
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  const duration = after - before;
  if (duration > 1000) {
    console.log(`Slow query: ${params.model}.${params.action} - ${duration}ms`);
  }
  
  return result;
});
```

### 3. 性能测试工具

**Lighthouse CI**:
```bash
npm install -g @lhci/cli

# 运行 Lighthouse
lhci autorun --url=https://your-app.vercel.app
```

**WebPageTest**:
访问 https://www.webpagetest.org/ 测试真实设备性能。

### 4. 日志和错误追踪

考虑集成 Sentry：

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% 的请求追踪
  environment: process.env.NODE_ENV,
});
```

## 优化检查清单

### 前端
- [ ] 图片使用 next/image
- [ ] 启用图片懒加载
- [ ] 使用 WebP 格式
- [ ] 代码分割已实现
- [ ] 字体优化
- [ ] CSS 压缩
- [ ] JavaScript 压缩
- [ ] 移除 console.log
- [ ] React 组件优化（memo, useCallback）

### 后端
- [ ] API 响应缓存
- [ ] 数据库查询优化
- [ ] 避免 N+1 查询
- [ ] 使用 select 减少数据传输
- [ ] 并行请求处理
- [ ] API 限流已实现

### 数据库
- [ ] 索引已添加
- [ ] 查询计划已分析
- [ ] 连接池已配置
- [ ] 慢查询已优化

### 监控
- [ ] Vercel Analytics 已启用
- [ ] 错误监控已配置
- [ ] 性能指标追踪
- [ ] 日志记录系统

## 性能预算

设置性能预算防止退化：

```javascript
// next.config.ts
module.exports = {
  // 设置包大小限制
  experimental: {
    bundlePagesRouterDependencies: true,
  },
};
```

**目标大小**:
- 首次加载 JS: < 200KB
- 总 JavaScript: < 500KB
- 图片: 单张 < 500KB

## 持续优化

1. **定期审查**: 每月检查性能指标
2. **A/B 测试**: 测试优化效果
3. **用户反馈**: 收集真实用户体验
4. **更新依赖**: 保持依赖最新（安全更新）
5. **代码审查**: 审查性能影响

---

性能优化是持续的过程。定期监控，持续改进！⚡
