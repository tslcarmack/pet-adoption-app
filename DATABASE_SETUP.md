# 数据库设置指南

## 方案一：使用 Neon（推荐 - 最简单）

Neon 是免费的 PostgreSQL 云数据库，设置只需 2 分钟。

### 步骤：

1. **注册 Neon 账号**
   - 访问: https://neon.tech
   - 点击 "Sign Up" 注册（可以用 GitHub 登录）

2. **创建数据库**
   - 登录后会自动创建一个项目
   - 复制连接字符串（类似：`postgresql://user:pass@host/db?sslmode=require`）

3. **配置环境变量**
   - 打开项目的 `.env` 文件
   - 将 `DATABASE_URL` 替换为 Neon 提供的连接字符串：
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

4. **初始化数据库**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

完成！🎉

---

## 方案二：本地 PostgreSQL（如果已安装）

如果你已经安装了 PostgreSQL：

1. **创建数据库**
   ```bash
   createdb pet_adoption_db
   ```

2. **配置 .env**
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/pet_adoption_db"
   ```

3. **初始化**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

---

## 方案三：使用 Docker（如果熟悉 Docker）

```bash
docker run --name postgres-pet -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pet_adoption_db -p 5432:5432 -d postgres:15

# 然后在 .env 中设置：
DATABASE_URL="postgresql://postgres:password@localhost:5432/pet_adoption_db"
```

---

## 当前服务状态

- ✅ **前端 + 后端**: http://localhost:3002
- ⚠️  **数据库**: 需要配置（按上述方法之一）

配置好数据库后，应用就完全可用了！
