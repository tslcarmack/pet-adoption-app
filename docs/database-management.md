# 数据库管理指南

本指南涵盖数据库的备份、恢复、迁移和维护操作。

## 目录

1. [数据库架构](#数据库架构)
2. [备份策略](#备份策略)
3. [恢复流程](#恢复流程)
4. [迁移管理](#迁移管理)
5. [性能优化](#性能优化)
6. [常见问题](#常见问题)

## 数据库架构

### 主要表结构

**User（用户表）**
- 存储用户账户信息
- 字段：email, password, name, role, phone, address, createdAt

**Pet（宠物表）**
- 存储宠物信息
- 字段：name, species, breed, gender, age, size, description, images, location, status

**AdoptionApplication（领养申请表）**
- 存储领养申请
- 字段：userId, petId, status, answers, reviewerNotes, submittedAt

**Favorite（收藏表）**
- 用户收藏的宠物
- 字段：userId, petId, createdAt

### 关系图

```
User (1) -----> (N) AdoptionApplication
Pet (1) -----> (N) AdoptionApplication
User (1) -----> (N) Favorite
Pet (1) -----> (N) Favorite
```

## 备份策略

### Neon 自动备份

Neon 提供自动备份功能：

- **频率**: 每日自动备份
- **保留期**: 根据计划不同（Free: 7天，Pro: 30天）
- **恢复点**: 可恢复到任意时间点（Point-in-Time Recovery）

### 查看备份

1. 登录 [Neon Console](https://console.neon.tech/)
2. 选择项目
3. 导航到 "Backups" 或 "History"
4. 查看可用的备份点

### 手动备份（推荐定期执行）

#### 方法 1: 使用 pg_dump（完整备份）

```bash
# 导出整个数据库
pg_dump "postgresql://user:pass@host/db?sslmode=require" > backup_$(date +%Y%m%d).sql

# 导出特定表
pg_dump "postgresql://user:pass@host/db?sslmode=require" -t User -t Pet > backup_tables.sql

# 导出为压缩格式
pg_dump "postgresql://user:pass@host/db?sslmode=require" | gzip > backup_$(date +%Y%m%d).sql.gz
```

#### 方法 2: 使用 Prisma（数据导出）

```bash
# 导出数据为 JSON
npx ts-node scripts/export-data.ts
```

创建导出脚本 `scripts/export-data.ts`:

```typescript
import fs from 'fs';
import prisma from '../lib/prisma';

async function exportData() {
  const users = await prisma.user.findMany();
  const pets = await prisma.pet.findMany();
  const applications = await prisma.adoptionApplication.findMany();
  const favorites = await prisma.favorite.findMany();

  const data = {
    users,
    pets,
    applications,
    favorites,
    exportedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    `backup-${Date.now()}.json`,
    JSON.stringify(data, null, 2)
  );

  console.log('Data exported successfully!');
  await prisma.$disconnect();
}

exportData();
```

### 备份计划建议

**生产环境**:
- 自动备份：依赖 Neon 自动备份
- 手动备份：每周一次完整备份
- 在重大更新前：手动备份

**开发环境**:
- 在架构变更前备份
- 定期导出测试数据

## 恢复流程

### 从 Neon 备份恢复

**时间点恢复（Point-in-Time Recovery）**:

1. 登录 Neon Console
2. 选择项目和分支
3. 点击 "Restore" 或 "Time Travel"
4. 选择恢复时间点
5. 确认恢复操作

**注意**: 恢复会创建新分支，不会覆盖当前数据。

### 从 SQL 备份恢复

```bash
# 恢复完整备份
psql "postgresql://user:pass@host/db?sslmode=require" < backup_20240101.sql

# 恢复压缩备份
gunzip -c backup_20240101.sql.gz | psql "postgresql://user:pass@host/db?sslmode=require"
```

**警告**: 恢复会覆盖现有数据，请谨慎操作！

### 从 JSON 备份恢复

创建恢复脚本 `scripts/import-data.ts`:

```typescript
import fs from 'fs';
import prisma from '../lib/prisma';

async function importData(filename: string) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));

  // 清空现有数据（谨慎！）
  await prisma.favorite.deleteMany();
  await prisma.adoptionApplication.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  // 导入数据
  await prisma.user.createMany({ data: data.users });
  await prisma.pet.createMany({ data: data.pets });
  await prisma.adoptionApplication.createMany({ data: data.applications });
  await prisma.favorite.createMany({ data: data.favorites });

  console.log('Data imported successfully!');
  await prisma.$disconnect();
}

importData(process.argv[2]);
```

使用：

```bash
npx ts-node scripts/import-data.ts backup-1234567890.json
```

## 迁移管理

### Prisma 迁移

**开发环境**:

```bash
# 创建新迁移
npx prisma migrate dev --name add_new_field

# 应用迁移
npx prisma migrate dev

# 重置数据库（会删除所有数据！）
npx prisma migrate reset
```

**生产环境**:

```bash
# 仅应用迁移（不创建新迁移）
npx prisma migrate deploy

# 查看迁移状态
npx prisma migrate status

# 解决迁移冲突
npx prisma migrate resolve --applied <migration-name>
npx prisma migrate resolve --rolled-back <migration-name>
```

### 无迁移部署（使用 db push）

适用于快速原型开发：

```bash
# 同步架构到数据库（不创建迁移文件）
npx prisma db push

# 查看会执行的变更（不实际执行）
npx prisma db push --preview-feature
```

**注意**: 生产环境推荐使用 `migrate deploy`，不推荐 `db push`。

### 迁移最佳实践

1. **版本控制**: 始终提交迁移文件到 Git
2. **测试**: 在开发/预演环境测试迁移
3. **备份**: 生产环境迁移前先备份
4. **回滚计划**: 准备回滚步骤
5. **停机窗口**: 大型迁移选择低流量时段

### 架构变更示例

**添加新字段**:

```prisma
model User {
  // 现有字段...
  bio String? @db.Text  // 新增字段
}
```

```bash
npx prisma migrate dev --name add_user_bio
```

**修改字段类型**:

```prisma
model Pet {
  // 从 String 改为 Int
  age Int  // 之前是 String
}
```

**警告**: 可能导致数据丢失，需要数据迁移脚本！

**删除字段**:

```prisma
model User {
  // 移除不再使用的字段
  // oldField String?  // 删除这行
}
```

```bash
npx prisma migrate dev --name remove_old_field
```

## 性能优化

### 添加索引

在 `schema.prisma` 中添加索引：

```prisma
model Pet {
  id        String   @id @default(cuid())
  name      String
  species   PetSpecies
  status    PetStatus
  createdAt DateTime @default(now())

  // 索引定义
  @@index([species])
  @@index([status])
  @@index([createdAt])
  @@index([species, status])  // 复合索引
}
```

应用索引：

```bash
npx prisma migrate dev --name add_indexes
```

### 查询优化

**使用 select 减少数据传输**:

```typescript
// 不好：获取所有字段
const pets = await prisma.pet.findMany();

// 好：只获取需要的字段
const pets = await prisma.pet.findMany({
  select: {
    id: true,
    name: true,
    images: true,
  },
});
```

**使用 include 预加载关系**:

```typescript
// 避免 N+1 查询
const applications = await prisma.adoptionApplication.findMany({
  include: {
    user: true,
    pet: true,
  },
});
```

**分页查询**:

```typescript
const pets = await prisma.pet.findMany({
  take: 20,  // 每页 20 条
  skip: (page - 1) * 20,  // 跳过前面的
  orderBy: { createdAt: 'desc' },
});
```

### 数据库连接池

Neon 自动提供连接池，但可以优化 Prisma 客户端：

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### 监控慢查询

在 Prisma 中启用查询日志：

```typescript
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {  // 超过 1 秒
    console.log('Slow query:', e.query);
    console.log('Duration:', e.duration, 'ms');
  }
});
```

## 维护任务

### 定期检查

**每周**:
- [ ] 检查数据库大小
- [ ] 查看慢查询日志
- [ ] 验证备份完整性

**每月**:
- [ ] 分析表统计信息
- [ ] 检查未使用的索引
- [ ] 清理过期数据（如果有）

### 数据清理

如果需要清理旧数据（例如，已完成的申请）：

```typescript
// scripts/cleanup-old-data.ts
import prisma from '../lib/prisma';

async function cleanupOldApplications() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const result = await prisma.adoptionApplication.deleteMany({
    where: {
      status: 'REJECTED',
      submittedAt: {
        lt: threeMonthsAgo,
      },
    },
  });

  console.log(`Deleted ${result.count} old applications`);
  await prisma.$disconnect();
}

cleanupOldApplications();
```

### 数据完整性检查

```typescript
// scripts/check-integrity.ts
import prisma from '../lib/prisma';

async function checkIntegrity() {
  // 检查孤立的收藏（宠物已删除）
  const orphanedFavorites = await prisma.favorite.findMany({
    where: {
      pet: null,
    },
  });

  if (orphanedFavorites.length > 0) {
    console.warn(`Found ${orphanedFavorites.length} orphaned favorites`);
  }

  // 检查无效的申请状态
  const invalidApplications = await prisma.adoptionApplication.findMany({
    where: {
      OR: [
        { user: null },
        { pet: null },
      ],
    },
  });

  if (invalidApplications.length > 0) {
    console.warn(`Found ${invalidApplications.length} invalid applications`);
  }

  console.log('Integrity check complete');
  await prisma.$disconnect();
}

checkIntegrity();
```

## 常见问题

### 迁移失败怎么办？

1. 查看错误信息
2. 检查数据库状态：`npx prisma migrate status`
3. 如果需要，标记迁移为已应用或已回滚
4. 修复问题后重新应用

### 如何回滚迁移？

Prisma 不支持自动回滚，需要手动：

1. 创建反向迁移
2. 或恢复数据库备份

### 数据库连接错误

检查：
- DATABASE_URL 格式正确
- 数据库服务运行正常
- 防火墙/安全组设置
- SSL 模式正确

### 性能下降

1. 检查慢查询
2. 添加适当索引
3. 优化查询逻辑
4. 考虑缓存策略

## 紧急联系

- Neon 支持：https://neon.tech/docs/introduction
- Prisma 文档：https://www.prisma.io/docs
- 社区论坛：https://github.com/prisma/prisma/discussions

---

## 快速命令参考

```bash
# 备份
pg_dump "$DATABASE_URL" > backup.sql

# 恢复
psql "$DATABASE_URL" < backup.sql

# 迁移
npx prisma migrate dev        # 开发环境
npx prisma migrate deploy     # 生产环境

# 查看数据库
npx prisma studio

# 验证架构
npx prisma validate

# 生成客户端
npx prisma generate

# 重置数据库（危险！）
npx prisma migrate reset
```

保持数据安全，定期备份！💾
