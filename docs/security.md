# 安全指南

本指南涵盖宠物领养平台的安全最佳实践和配置。

## 目录

1. [安全概览](#安全概览)
2. [认证和授权](#认证和授权)
3. [数据保护](#数据保护)
4. [API 安全](#api-安全)
5. [输入验证](#输入验证)
6. [安全头配置](#安全头配置)
7. [安全审计](#安全审计)

## 安全概览

### 已实现的安全功能

✅ **认证**: NextAuth.js v5 + JWT  
✅ **密码加密**: bcryptjs (10 轮加盐)  
✅ **API 限流**: 防止暴力攻击  
✅ **输入清理**: 防止 XSS 攻击  
✅ **HTTP 安全头**: HSTS, CSP, X-Frame-Options 等  
✅ **SQL 注入防护**: Prisma ORM 参数化查询  
✅ **CSRF 保护**: NextAuth 自动处理  
✅ **HTTPS**: Vercel 自动启用  

### 安全威胁模型

**主要威胁**:
1. 未授权访问（认证绕过）
2. SQL 注入
3. 跨站脚本（XSS）
4. 跨站请求伪造（CSRF）
5. 暴力破解
6. 数据泄露
7. 会话劫持

## 认证和授权

### 密码策略

**当前实现**:
```typescript
// bcryptjs 加密，10 轮加盐
const hashedPassword = await bcrypt.hash(password, 10);
```

**建议增强**:
```typescript
// lib/password.ts
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function validatePassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_REGEX.test(password);
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  if (password.length < 12) return 'medium';
  if (PASSWORD_REGEX.test(password)) return 'strong';
  return 'medium';
}
```

**密码要求**:
- 最少 8 个字符
- 至少 1 个大写字母
- 至少 1 个小写字母
- 至少 1 个数字
- 至少 1 个特殊字符

### 会话管理

**JWT 配置**:
```typescript
// lib/auth.ts
export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
};
```

**会话安全最佳实践**:
1. 使用 HttpOnly cookies（已实现）
2. 使用 Secure cookies（生产环境自动）
3. 实现会话过期
4. 敏感操作需要重新认证

### 角色权限控制

**中间件保护**:
```typescript
// middleware.ts
export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // 管理员路由保护
  if (pathname.startsWith('/admin')) {
    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // 需要登录的路由
  const protectedRoutes = ['/profile', '/applications', '/favorites'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
});
```

**API 权限检查**:
```typescript
// app/api/admin/*/route.ts
export async function POST(req: NextRequest) {
  const session = await auth();
  
  // 检查登录
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }
  
  // 检查角色
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }
  
  // 处理请求...
}
```

## 数据保护

### 敏感数据加密

**密码**: bcryptjs 加密（已实现）  
**重置令牌**: 随机生成，单次使用（已实现）

**建议增强 - 加密个人信息**:
```typescript
// lib/crypto.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 字节
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}

// 使用
const encryptedPhone = encrypt(user.phone);
const decryptedPhone = decrypt(encryptedPhone);
```

### 数据库安全

**连接安全**:
```env
# 始终使用 SSL
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

**最小权限原则**:
- 应用使用单独的数据库用户
- 仅授予必要的权限（SELECT, INSERT, UPDATE, DELETE）
- 不授予 DROP, CREATE 等权限

**备份加密**:
确保数据库备份加密存储。

## API 安全

### 速率限制

**已实现**:
```typescript
// lib/rate-limit.ts
export const rateLimiters = {
  auth: rateLimit({
    interval: 15 * 60 * 1000,  // 15 分钟
    maxRequests: 5,             // 5 次请求
  }),
  api: rateLimit({
    interval: 60 * 1000,        // 1 分钟
    maxRequests: 30,            // 30 次请求
  }),
  strict: rateLimit({
    interval: 5 * 60 * 1000,    // 5 分钟
    maxRequests: 10,            // 10 次请求
  }),
};
```

**建议增强 - IP 黑名单**:
```typescript
// lib/ip-blacklist.ts
const blacklist = new Set<string>();

export function isBlacklisted(ip: string): boolean {
  return blacklist.has(ip);
}

export function blacklistIP(ip: string, duration: number = 3600000) {
  blacklist.add(ip);
  setTimeout(() => blacklist.delete(ip), duration);
}

// 在限流检查中使用
if (isBlacklisted(clientIP)) {
  return NextResponse.json({ error: 'IP 已被封禁' }, { status: 403 });
}
```

### API 密钥管理

如果实现 API 密钥认证：

```typescript
// app/api/v1/*/route.ts
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('X-API-Key');
  
  if (!apiKey || !isValidApiKey(apiKey)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  
  // 处理请求...
}

function isValidApiKey(key: string): boolean {
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  // 与数据库中的哈希密钥比较
  return hashedKey === process.env.API_KEY_HASH;
}
```

### CORS 配置

```typescript
// app/api/*/route.ts
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

## 输入验证

### Zod 验证

**已实现**:
```typescript
// app/api/applications/route.ts
const applicationSchema = z.object({
  petId: z.string(),
  answers: z.object({
    experience: z.string().min(10),
    housing: z.enum(['HOUSE', 'APARTMENT', 'OTHER']),
    // ...
  }),
});

const validated = applicationSchema.parse(body);
```

### 输入清理

**已实现**:
```typescript
// lib/sanitize.ts
export function sanitizeString(input: string): string {
  return stripHtml(escapeHtml(input.trim()));
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

**使用**:
```typescript
import { sanitizeString } from '@/lib/sanitize';

const cleanName = sanitizeString(userInput.name);
const cleanEmail = sanitizeEmail(userInput.email);
```

### SQL 注入防护

**Prisma 自动防护**:
```typescript
// 安全 - Prisma 使用参数化查询
const user = await prisma.user.findUnique({
  where: { email: userInput },  // 自动转义
});

// 避免原始查询
// const users = await prisma.$queryRaw`SELECT * FROM User WHERE email = ${userInput}`;
```

## 安全头配置

**已实现**:
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on"
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload"
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN"
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff"
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block"
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin"
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ];
}
```

**建议增强 - 内容安全策略（CSP）**:
```typescript
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'self'"
  ].join("; ")
}
```

## 安全审计

### 依赖安全

**定期检查**:
```bash
# 检查已知漏洞
npm audit

# 自动修复
npm audit fix

# 检查过期依赖
npm outdated
```

**自动化**:
在 GitHub 启用 Dependabot:
1. 创建 `.github/dependabot.yml`
2. 配置自动更新

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 代码审查

**安全检查清单**:
- [ ] 敏感数据未硬编码
- [ ] 环境变量已保护
- [ ] 输入验证已实现
- [ ] 输出编码已实现
- [ ] 错误信息不泄露敏感信息
- [ ] 日志不包含密码/令牌
- [ ] 权限检查已实现
- [ ] 速率限制已添加

### 渗透测试

**基础测试**:
1. **SQL 注入**: 尝试注入 SQL 代码
2. **XSS**: 尝试注入 `<script>alert('XSS')</script>`
3. **CSRF**: 尝试跨站请求
4. **暴力破解**: 多次错误登录
5. **权限提升**: 尝试访问管理员功能
6. **敏感数据暴露**: 检查 API 响应

**工具**:
- OWASP ZAP
- Burp Suite
- SQLMap

## 事件响应

### 安全事件处理流程

1. **检测**: 监控异常活动
2. **遏制**: 限制损害扩散
3. **根除**: 移除威胁
4. **恢复**: 恢复正常服务
5. **总结**: 分析和改进

### 数据泄露响应

如果发生数据泄露：

1. **立即行动**:
   - 停止泄露源
   - 保存证据
   - 通知团队

2. **评估影响**:
   - 确定泄露数据范围
   - 识别受影响用户
   - 评估风险级别

3. **通知**:
   - 通知受影响用户
   - 根据法律要求通知监管机构
   - 公开透明沟通

4. **补救**:
   - 强制密码重置
   - 撤销受影响的令牌
   - 修复漏洞

5. **预防**:
   - 加强安全措施
   - 更新安全培训
   - 实施额外监控

## 安全配置清单

### 部署前检查

- [ ] 所有密码已更换（不使用默认/开发密码）
- [ ] NEXTAUTH_SECRET 已生成新密钥
- [ ] 数据库连接使用 SSL
- [ ] HTTPS 已启用
- [ ] 安全头已配置
- [ ] API 限流已启用
- [ ] 输入验证已实现
- [ ] 错误处理不泄露敏感信息
- [ ] 日志不包含敏感数据
- [ ] 依赖已更新到最新安全版本

### 运行时监控

- [ ] 设置安全告警
- [ ] 监控失败的登录尝试
- [ ] 监控异常 API 请求
- [ ] 定期审查访问日志
- [ ] 监控数据库查询

## 合规性

### GDPR（如适用）

- [ ] 用户数据最小化
- [ ] 用户同意机制
- [ ] 数据访问权
- [ ] 数据删除权
- [ ] 数据可携权
- [ ] 隐私政策
- [ ] Cookie 同意

### 数据保留

制定数据保留政策：
- 用户数据：账户存在期间
- 申请记录：1 年
- 日志：3 个月
- 备份：30 天

## 安全培训

团队成员应了解：
1. OWASP Top 10 威胁
2. 安全编码实践
3. 密码安全
4. 社会工程攻击
5. 钓鱼识别
6. 事件响应流程

## 持续改进

- 定期安全审计（每季度）
- 更新安全培训（每年）
- 审查和更新安全策略
- 关注安全公告
- 参与安全社区

---

安全是持续的过程，不是一次性任务。保持警惕！🔒
