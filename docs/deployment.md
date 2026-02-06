# 宠物领养平台 - 部署指南

本指南将帮助您将应用部署到生产环境。

## 目录

1. [前置准备](#前置准备)
2. [数据库设置](#数据库设置)
3. [Vercel 部署](#vercel-部署)
4. [环境变量配置](#环境变量配置)
5. [数据库迁移](#数据库迁移)
6. [部署后验证](#部署后验证)
7. [常见问题](#常见问题)

## 前置准备

### 1. 准备账户

- [Vercel](https://vercel.com/) - 应用托管
- [Neon](https://neon.tech/) 或 [Supabase](https://supabase.com/) - PostgreSQL 数据库
- [GitHub](https://github.com/) - 代码托管

### 2. 检查本地构建

在部署前，确保本地构建成功：

```bash
# 安装依赖
npm install

# 生成 Prisma 客户端
npx prisma generate

# 构建应用
npm run build

# 测试生产构建
npm start
```

如果本地构建失败，需要先解决错误再部署。

## 数据库设置

### 使用 Neon（推荐）

1. 访问 [Neon Console](https://console.neon.tech/)
2. 创建新项目：
   - 项目名称：`pet-adoption-app`
   - 区域：选择最近的（如 `ap-southeast-1`）
   - PostgreSQL 版本：15+

3. 获取连接字符串：
   - 在项目面板中找到 "Connection String"
   - 选择 "Pooled connection" 用于生产环境
   - 复制连接字符串，格式如下：
     ```
     postgresql://username:password@host/database?sslmode=require
     ```

### 使用 Supabase（备选）

1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 创建新项目
3. 在 Settings → Database 获取连接字符串
4. 使用 "Connection pooling" 中的 "Transaction" 模式

## Vercel 部署

### 方法 1: 通过 Vercel Dashboard（推荐新手）

1. **推送代码到 GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/pet-adoption-app.git
git push -u origin main
```

2. **导入项目到 Vercel**

- 访问 [Vercel Dashboard](https://vercel.com/dashboard)
- 点击 "Add New" → "Project"
- 从 GitHub 导入项目
- 选择仓库：`pet-adoption-app`

3. **配置项目**

- Framework Preset: `Next.js`（自动检测）
- Root Directory: `./` （默认）
- Build Command: `npm run build`（自动检测）
- Output Directory: `.next`（自动检测）

4. **添加环境变量**（见下一节）

5. **点击 "Deploy"**

### 方法 2: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

## 环境变量配置

在 Vercel Dashboard 的项目设置中添加以下环境变量：

### 必需的环境变量

```env
# 数据库连接（使用 Neon 的连接字符串）
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# NextAuth 配置
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key
```

### 生成 NEXTAUTH_SECRET

```bash
# 在本地终端运行
openssl rand -base64 32
```

将生成的密钥复制到 Vercel 环境变量中。

### 可选的环境变量

```env
# Vercel Analytics（在 Vercel Dashboard 启用后自动添加）
VERCEL_ANALYTICS_ID=your-analytics-id

# 邮件服务（如果使用）
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com

# Cloudinary（如果使用图片上传）
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 环境变量设置步骤

1. 进入 Vercel 项目设置：`Settings` → `Environment Variables`
2. 为每个变量：
   - 填写 Key（变量名）
   - 填写 Value（变量值）
   - 选择环境：Production, Preview, Development（通常全选）
   - 点击 "Save"

## 数据库迁移

部署后，需要初始化生产数据库。

### 方法 1: 使用 Prisma Studio（推荐）

1. 在本地连接到生产数据库：

```bash
# 临时设置生产数据库 URL
DATABASE_URL="your-production-database-url" npx prisma db push
```

2. 验证架构：

```bash
DATABASE_URL="your-production-database-url" npx prisma studio
```

### 方法 2: 通过 Vercel CLI

```bash
# 连接到生产环境
vercel env pull .env.production

# 使用生产环境变量
export $(cat .env.production | xargs)

# 推送数据库架构
npx prisma db push

# 生成 Prisma 客户端
npx prisma generate
```

### 创建管理员账户

1. 在生产环境注册一个账户
2. 通过数据库直接修改角色：

```sql
-- 在 Neon Console 的 SQL Editor 中运行
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';
```

或使用 Prisma Studio：
1. 连接到生产数据库
2. 找到 User 表
3. 编辑用户，将 `role` 改为 `ADMIN`

### 种子数据（可选）

如果需要初始测试数据：

```bash
DATABASE_URL="your-production-database-url" npm run db:seed
```

**注意**: 仅在测试环境使用种子数据，生产环境通常不需要。

## 部署后验证

### 1. 功能测试清单

访问您的生产 URL 并测试：

- [ ] 首页加载正常
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 浏览宠物列表
- [ ] 搜索和筛选
- [ ] 查看宠物详情
- [ ] 添加/移除收藏
- [ ] 提交领养申请
- [ ] 个人中心访问
- [ ] 管理员登录（使用管理员账户）
- [ ] 管理员功能：
  - [ ] 添加宠物
  - [ ] 编辑宠物
  - [ ] 删除宠物
  - [ ] 查看申请列表
  - [ ] 审核申请

### 2. 性能检查

使用以下工具测试性能：

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

目标指标：
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 3. 移动端测试

在不同设备上测试：
- iOS Safari
- Android Chrome
- 不同屏幕尺寸

### 4. 浏览器兼容性

测试主流浏览器：
- Chrome（最新）
- Firefox（最新）
- Safari（最新）
- Edge（最新）

## 持续集成/持续部署 (CI/CD)

Vercel 自动为每次 Git 推送创建部署：

### 分支策略

- `main` 分支 → 生产环境
- 其他分支 → 预览环境

### 预览部署

每个 Pull Request 自动创建预览部署：
- 独立的 URL
- 可以在合并前测试
- 不影响生产环境

### 部署钩子

在 Vercel 项目设置中配置：
- Deploy hooks（用于外部触发）
- Git 集成设置
- 忽略构建步骤（可选）

## 监控和维护

### 1. Vercel Analytics

在项目设置中启用：
- Analytics（流量和性能）
- Speed Insights（性能监控）
- Web Vitals（用户体验指标）

### 2. 错误监控（可选）

推荐使用 [Sentry](https://sentry.io/)：

```bash
npm install @sentry/nextjs
```

### 3. 日志监控

Vercel 提供内置日志：
- 实时日志：Dashboard → Functions → Logs
- 保留时间：根据计划不同

### 4. 数据库备份

Neon 自动备份：
- 每日自动备份
- 可在 Console 中恢复
- 建议定期测试恢复流程

### 5. 正常运行时间监控

使用以下服务监控网站可用性：
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## 域名配置（可选）

### 1. 购买域名

从域名注册商购买：
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Cloudflare](https://www.cloudflare.com/)

### 2. 在 Vercel 添加域名

1. 项目设置 → Domains
2. 添加您的域名（如 `petadoption.com`）
3. 按照提示配置 DNS：

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

4. 等待 DNS 传播（最多 48 小时）

### 3. SSL 证书

Vercel 自动提供免费 SSL 证书（Let's Encrypt）。

## 回滚程序

如果部署出现问题：

### 方法 1: Vercel Dashboard

1. 进入项目 → Deployments
2. 找到之前的稳定版本
3. 点击 "..." → "Promote to Production"

### 方法 2: Git 回滚

```bash
# 回滚到上一个提交
git revert HEAD
git push origin main

# 或回滚到特定提交
git revert <commit-hash>
git push origin main
```

### 数据库回滚

如果需要回滚数据库：

1. 在 Neon Console 中恢复备份
2. 或使用 Prisma 迁移：

```bash
# 回滚最后一次迁移
npx prisma migrate resolve --rolled-back <migration-name>
```

## 扩展和优化

### 1. 缓存策略

Vercel 自动缓存静态资源。优化动态内容：

```typescript
// app/api/pets/route.ts
export const revalidate = 60; // 60 秒缓存
```

### 2. 图片优化

使用 Next.js Image 组件自动优化（已实现）。

### 3. 数据库连接池

Neon 自动提供连接池，无需额外配置。

### 4. Edge Functions（高级）

对于高流量 API，考虑使用 Edge Runtime：

```typescript
export const runtime = 'edge';
```

## 成本估算

### 免费层额度

**Vercel Hobby（免费）**:
- 100GB 带宽/月
- 无限部署
- 自动 HTTPS
- 适合个人项目和小型应用

**Neon Free Tier**:
- 500MB 存储
- 100 小时计算时间/月
- 适合开发和测试

### 升级选项

当流量增长时：
- **Vercel Pro**: $20/月，更多带宽和功能
- **Neon Pro**: 从 $19/月开始，更多资源

## 安全检查清单

部署前确保：

- [ ] 所有敏感信息使用环境变量
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] 生产环境使用强密码
- [ ] NEXTAUTH_SECRET 已更换（不使用开发环境的）
- [ ] 数据库使用 SSL 连接
- [ ] 已配置安全头（已在 next.config.ts 中）
- [ ] 已启用 HTTPS（Vercel 自动）
- [ ] API 限流已启用（已实现）
- [ ] 输入验证和清理已实现（已实现）

## 故障排除

### 构建失败

```bash
# 检查本地构建
npm run build

# 查看详细错误
vercel logs <deployment-url>
```

常见问题：
- TypeScript 类型错误
- 缺少环境变量
- 依赖版本冲突

### 数据库连接失败

检查：
1. DATABASE_URL 格式正确
2. 数据库允许外部连接
3. SSL 模式正确（`?sslmode=require`）
4. IP 白名单（Neon 通常不需要）

### 认证问题

检查：
1. NEXTAUTH_URL 与实际域名匹配
2. NEXTAUTH_SECRET 已设置
3. Cookie 设置正确
4. 浏览器允许 Cookie

### 性能问题

优化步骤：
1. 检查数据库查询效率
2. 添加适当的索引
3. 使用 Vercel Analytics 识别瓶颈
4. 考虑缓存策略

## 支持和帮助

遇到问题时：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Neon 文档](https://neon.tech/docs)
3. 查看 [Next.js 文档](https://nextjs.org/docs)
4. 搜索 GitHub Issues
5. 联系支持团队

---

## 快速部署命令总结

```bash
# 1. 构建测试
npm run build

# 2. 推送到 GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. 部署到 Vercel（如果使用 CLI）
vercel --prod

# 4. 数据库迁移
DATABASE_URL="production-url" npx prisma db push

# 5. 创建管理员（在数据库中运行）
# UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

恭喜！您的宠物领养平台现在已经部署到生产环境了！🎉
