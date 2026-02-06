# 宠物领养平台

一个基于 Next.js 15 的现代化宠物领养平台，帮助流浪宠物找到温暖的家。

## 功能特性

### 用户功能
- 🔐 用户注册/登录（邮箱密码）
- 🔑 密码重置（邮件验证码）
- 🐾 浏览可领养宠物（分页、筛选）
- 🔍 高级搜索（物种、性别、体型、年龄、地区）
- ❤️ 收藏心仪的宠物
- 📝 提交领养申请
- 👤 个人中心（资料编辑、密码修改）
- 📋 查看申请记录和状态
- 📱 完整的移动端适配
- 🔔 Toast 实时反馈通知

### 管理员功能
- 📊 管理后台仪表板
- 🐕 宠物信息管理（增删改查）
- 📋 申请审核（批准/拒绝）
- 👥 查看申请详情和申请人信息

### 技术特性
- ⚡ Next.js 15 App Router
- 🎨 TailwindCSS + shadcn/ui
- 🔒 安全：API 限流、输入清理、安全头
- 📱 PWA 支持（离线访问）
- 🎯 TypeScript 全栈类型安全
- 🗄️ PostgreSQL + Prisma ORM
- 🔐 NextAuth.js v5 认证
- 📊 Analytics 事件追踪
- 🎭 优雅的错误处理

## 技术栈

### 前端
- **框架**: Next.js 15 (React 19)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: shadcn/ui (Radix UI)
- **状态管理**: React Server Components
- **表单验证**: Zod

### 后端
- **框架**: Next.js API Routes
- **数据库**: PostgreSQL (Neon)
- **ORM**: Prisma
- **认证**: NextAuth.js v5
- **密码加密**: bcryptjs

### 部署
- **平台**: Vercel (推荐)
- **数据库**: Neon PostgreSQL
- **CDN**: Vercel Edge Network

## 快速开始

### 前置要求

- Node.js 18+ 
- PostgreSQL 数据库
- npm 或 yarn

### 安装

1. 克隆项目

```bash
git clone <repository-url>
cd pet-adoption-app
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建 `.env` 文件：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# 生成密钥: openssl rand -base64 32
```

4. 初始化数据库

```bash
# 推送数据库架构
npx prisma db push

# (可选) 生成测试数据
npx prisma db seed
```

5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 创建管理员账户

在数据库中手动更新用户角色为 ADMIN：

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## 项目结构

```
pet-adoption-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   ├── auth/            # 认证 API
│   │   ├── pets/            # 宠物 API
│   │   ├── applications/    # 申请 API
│   │   ├── favorites/       # 收藏 API
│   │   └── admin/           # 管理员 API
│   ├── admin/               # 管理后台页面
│   ├── pets/                # 宠物浏览页面
│   ├── applications/        # 申请页面
│   ├── favorites/           # 收藏页面
│   ├── profile/             # 个人中心
│   ├── login/               # 登录
│   ├── register/            # 注册
│   └── layout.tsx           # 根布局
├── components/              # React 组件
│   ├── ui/                  # shadcn/ui 组件
│   ├── header.tsx           # 导航栏
│   ├── pet-card.tsx         # 宠物卡片
│   └── ...
├── lib/                     # 工具库
│   ├── auth.ts              # NextAuth 配置
│   ├── prisma.ts            # Prisma 客户端
│   ├── rate-limit.ts        # API 限流
│   └── sanitize.ts          # 输入清理
├── prisma/                  # 数据库架构
│   └── schema.prisma
├── public/                  # 静态资源
├── hooks/                   # React Hooks
└── middleware.ts            # Next.js 中间件
```

## API 路由

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/reset-password/request` - 请求密码重置
- `POST /api/auth/reset-password/confirm` - 确认密码重置

### 宠物
- `GET /api/pets` - 获取宠物列表（支持筛选）
- `GET /api/pets/[id]` - 获取单个宠物详情

### 申请
- `GET /api/applications` - 获取用户的申请列表
- `POST /api/applications` - 提交领养申请
- `POST /api/applications/[id]/review` - 审核申请（管理员）

### 收藏
- `GET /api/favorites` - 获取收藏列表
- `POST /api/favorites` - 添加收藏
- `DELETE /api/favorites?petId=[id]` - 取消收藏

### 个人资料
- `GET /api/profile` - 获取个人资料
- `PUT /api/profile` - 更新个人资料
- `POST /api/profile/password` - 修改密码

### 管理员
- `GET /api/admin/pets` - 获取所有宠物
- `POST /api/admin/pets` - 添加宠物
- `PUT /api/admin/pets/[id]` - 更新宠物
- `DELETE /api/admin/pets/[id]` - 删除宠物

## 数据库架构

主要表：

- **User** - 用户（ADMIN / USER）
- **Pet** - 宠物信息
- **AdoptionApplication** - 领养申请
- **Favorite** - 收藏记录

查看完整架构: `prisma/schema.prisma`

## 安全特性

1. **认证授权**: NextAuth.js + JWT
2. **密码加密**: bcryptjs
3. **API 限流**: 防止暴力攻击
4. **输入清理**: 防止 XSS 攻击
5. **安全头**: CSP, HSTS, X-Frame-Options 等
6. **SQL 注入防护**: Prisma ORM
7. **HTTPS**: 生产环境强制 HTTPS

## 开发指南

### 代码规范

```bash
# 运行 ESLint
npm run lint

# 格式化代码
npm run format
```

### 数据库迁移

```bash
# 创建迁移
npx prisma migrate dev --name migration_name

# 应用迁移
npx prisma migrate deploy

# 重置数据库
npx prisma migrate reset
```

### 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

详细部署指南请参考: 
- [部署指南](./docs/deployment.md) - 完整部署步骤
- [部署检查清单](./docs/deployment-checklist.md) - 部署前检查项
- [数据库管理](./docs/database-management.md) - 备份和恢复
- [性能优化](./docs/performance-optimization.md) - 性能优化策略
- [安全指南](./docs/security.md) - 安全最佳实践

## 待完善功能

- [ ] 邮件通知系统（SendGrid/Resend）
- [ ] 图片上传（Cloudinary）
- [ ] 完整的单元测试
- [ ] E2E 测试（Playwright）
- [ ] 完善的无障碍访问
- [ ] Service Worker（离线支持）
- [ ] 更多筛选选项
- [ ] 宠物详情页评论功能

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请通过以下方式联系：

- Issue: [GitHub Issues](https://github.com/yourusername/pet-adoption-app/issues)
- Email: support@example.com

---

❤️ 用爱心构建，帮助流浪宠物找到家
