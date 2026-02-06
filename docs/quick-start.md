# 快速开始指南

5 分钟内启动宠物领养平台开发环境。

## 前置要求

- ✅ Node.js 18+ 已安装
- ✅ Git 已安装
- ✅ PostgreSQL 数据库（本地或云端）

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd pet-adoption-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库 - 使用 Neon 免费层
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**生成 NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 4. 初始化数据库

```bash
# 推送数据库架构
npx prisma db push

# (可选) 生成测试数据
npx prisma db seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000

## 创建管理员账户

### 方法 1: 注册后升级

1. 在网站注册账户
2. 在数据库中修改角色：

```bash
# 打开 Prisma Studio
npx prisma studio
```

3. 找到 User 表
4. 编辑您的用户
5. 将 `role` 改为 `ADMIN`

### 方法 2: 直接在数据库创建

```sql
-- 在 Neon Console 或 psql 中运行
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

## 验证安装

访问以下页面确认一切正常：

- ✅ 首页: http://localhost:3000
- ✅ 宠物列表: http://localhost:3000/pets
- ✅ 登录: http://localhost:3000/login
- ✅ 注册: http://localhost:3000/register
- ✅ 管理后台: http://localhost:3000/admin

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm start                # 运行生产服务器

# 代码质量
npm run lint             # 运行 ESLint
npm run type-check       # TypeScript 类型检查

# 数据库
npx prisma studio        # 可视化数据库界面
npx prisma db push       # 同步架构到数据库
npx prisma migrate dev   # 创建迁移
npx prisma generate      # 生成 Prisma 客户端
npm run db:seed          # 生成测试数据
```

## 项目结构

```
pet-adoption-app/
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   ├── admin/          # 管理后台
│   ├── pets/           # 宠物相关页面
│   └── ...
├── components/          # React 组件
├── lib/                # 工具库
├── prisma/             # 数据库架构
├── public/             # 静态资源
└── docs/               # 文档
```

## 开发工作流

1. 创建功能分支
   ```bash
   git checkout -b feature/my-feature
   ```

2. 开发功能

3. 测试
   ```bash
   npm run lint
   npm run build
   ```

4. 提交代码
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/my-feature
   ```

5. 创建 Pull Request

## 开发工具推荐

### VS Code 扩展

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens

### 浏览器扩展

- React Developer Tools
- Redux DevTools (如果使用)

## 故障排查

### 端口被占用

如果 3000 端口被占用，Next.js 会自动使用下一个可用端口（如 3001）。

或手动指定端口：
```bash
PORT=3001 npm run dev
```

### 数据库连接失败

1. 检查 `DATABASE_URL` 格式
2. 确认数据库服务运行中
3. 检查防火墙设置
4. 验证 SSL 模式（`?sslmode=require`）

### Prisma 错误

```bash
# 重新生成 Prisma 客户端
npx prisma generate

# 重置数据库（会删除所有数据！）
npx prisma migrate reset
```

### 构建错误

```bash
# 清除缓存
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 免费资源

### 数据库

- [Neon](https://neon.tech/) - 500MB 免费
- [Supabase](https://supabase.com/) - 500MB 免费

### 部署

- [Vercel](https://vercel.com/) - Hobby 计划免费

### 图片存储

- [Cloudinary](https://cloudinary.com/) - 25GB 免费
- [Unsplash](https://unsplash.com/) - 免费占位图

## 下一步

- 📖 阅读 [README.md](../README.md) 了解项目详情
- 🚀 查看 [部署指南](./deployment.md) 准备上线
- 🔒 阅读 [安全指南](./security.md) 了解最佳实践
- ⚡ 查看 [性能优化](./performance-optimization.md) 提升速度

## 获取帮助

遇到问题？

1. 查看 [故障排查](#故障排查) 部分
2. 搜索 GitHub Issues
3. 查阅官方文档：
   - [Next.js](https://nextjs.org/docs)
   - [Prisma](https://www.prisma.io/docs)
   - [NextAuth.js](https://next-auth.js.org/getting-started/introduction)

## 贡献

欢迎贡献！请查看贡献指南（如果有）。

---

祝开发愉快！🚀
