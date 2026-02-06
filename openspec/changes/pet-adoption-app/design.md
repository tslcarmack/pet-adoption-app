## Context

我们正在从零开始构建一个宠物领养平台，需要支持Web和移动端访问。系统的主要用户包括：潜在领养者（浏览和申请领养宠物）和救助组织管理员（发布和管理宠物信息，处理领养申请）。

**当前状态**: 全新项目，没有现有代码库

**约束条件**:
- 使用TypeScript作为主要开发语言
- 需要支持图片上传和存储
- 需要响应式设计，支持移动端和桌面端
- 需要考虑未来扩展性（如支持多个救助组织）

**利益相关者**:
- 潜在领养者：需要简单易用的界面
- 救助组织：需要高效的管理工具
- 流浪宠物：最终受益者

## Goals / Non-Goals

**Goals:**
- 构建一个全栈Web应用，支持宠物浏览、搜索、详情展示
- 实现用户认证和授权系统
- 提供完整的领养申请流程
- 实现图片上传和展示功能
- 提供良好的用户体验和性能

**Non-Goals:**
- 移动原生应用（iOS/Android native apps）- 第一版使用响应式Web
- 实时聊天功能 - 第一版不包含
- 支付功能 - 领养通常免费或通过线下处理
- 多语言支持 - 第一版仅支持中文
- 管理后台 - 第一版使用相同UI，通过角色权限区分

## Decisions

### 1. 技术架构：Monorepo + Next.js全栈

**决策**: 使用Next.js 14+ (App Router)作为全栈框架，采用monorepo结构

**理由**:
- Next.js提供前后端一体化开发体验，减少维护成本
- App Router提供服务端组件，改善性能和SEO
- API Routes提供后端API能力，无需单独的后端服务
- TypeScript原生支持
- 内置图片优化和响应式图片处理

**替代方案考虑**:
- ❌ 分离的React前端 + Express后端：增加部署复杂度，团队需要维护两个代码库
- ❌ React + NestJS：对于这个规模的项目过于复杂

### 2. 数据库：PostgreSQL + Prisma ORM

**决策**: 使用PostgreSQL作为主数据库，Prisma作为ORM

**理由**:
- PostgreSQL提供强大的关系型数据支持，适合用户、宠物、申请等实体关系
- ACID特性保证数据一致性（特别是领养申请状态）
- 良好的全文搜索支持（用于宠物搜索功能）
- Prisma提供类型安全的数据库访问，与TypeScript完美集成
- Prisma Client自动生成，减少样板代码

**替代方案考虑**:
- ❌ MongoDB：虽然灵活，但对于这个有明确实体关系的项目，关系型数据库更合适
- ❌ MySQL：功能类似，但PostgreSQL的JSON支持和全文搜索更强大

**数据模型设计**:
```
User (用户)
  - id, email, password_hash, name, phone, role (adopter/admin)
  - created_at, updated_at

Pet (宠物)
  - id, name, species, breed, age, gender, size
  - description, health_status, vaccination_status
  - location, status (available/pending/adopted)
  - photos[] (JSON array of image URLs)
  - created_at, updated_at

AdoptionApplication (领养申请)
  - id, user_id, pet_id, status (pending/approved/rejected)
  - application_data (JSON: living_situation, experience, etc.)
  - submitted_at, reviewed_at

Favorite (收藏)
  - id, user_id, pet_id, created_at
```

### 3. 认证方案：NextAuth.js + JWT

**决策**: 使用NextAuth.js处理认证，JWT作为session策略

**理由**:
- NextAuth.js是Next.js生态的标准认证方案
- 支持多种认证provider，未来可扩展（Google、微信等）
- JWT无需服务端session存储，简化架构
- 内置CSRF保护和安全最佳实践

**替代方案考虑**:
- ❌ 自建JWT认证：重新发明轮子，容易出现安全漏洞
- ❌ Session-based auth：需要Redis等存储，增加复杂度

**安全措施**:
- 密码使用bcrypt哈希（rounds=10）
- HTTP-only cookies存储token
- 密码重置使用时效性token（有效期30分钟）
- Rate limiting防止暴力破解

### 4. 图片存储：Cloudinary

**决策**: 使用Cloudinary作为图片存储和处理服务

**理由**:
- 提供图片上传、存储、CDN分发一体化解决方案
- 自动图片优化和转换（WebP、响应式尺寸）
- 免费tier足够初期使用（25 credits/月）
- SDK简单易用，上传直接到Cloudinary，无需经过服务器

**替代方案考虑**:
- ❌ 本地存储：不适合生产环境，难以扩展
- ❌ AWS S3：需要自己处理图片转换和优化
- ❌ 阿里云OSS：功能类似，但Cloudinary的图片处理能力更强

**图片处理策略**:
- 上传时限制：最大5MB，支持jpg/png/webp
- 自动生成缩略图：小(200x200)、中(400x400)、大(800x800)
- 懒加载和渐进式加载

### 5. UI框架：TailwindCSS + shadcn/ui

**决策**: 使用TailwindCSS作为CSS框架，shadcn/ui提供组件

**理由**:
- TailwindCSS提供utility-first快速开发
- shadcn/ui提供高质量、可定制的React组件
- 组件基于Radix UI，accessibility完善
- 不是npm包依赖，代码可完全掌控和定制

**替代方案考虑**:
- ❌ Material UI：样式较难定制，bundle size大
- ❌ Ant Design：设计风格偏向后台管理，不适合面向C端

### 6. 搜索功能：PostgreSQL全文搜索

**决策**: 第一版使用PostgreSQL内置的全文搜索功能

**理由**:
- 无需引入额外服务，降低复杂度
- 支持中文分词（使用zhparser扩展）
- 性能足够应对中小规模数据（< 10万条宠物记录）
- 支持筛选（种类、年龄、性别、地区）+ 关键词搜索组合

**未来扩展**:
- 如果数据量增长或需要更复杂搜索（模糊匹配、同义词等），可以迁移到Elasticsearch

**搜索索引策略**:
```sql
CREATE INDEX idx_pet_search ON pets 
USING gin(to_tsvector('chinese', name || ' ' || breed || ' ' || description));
```

### 7. 状态管理：React Server Components + URL State

**决策**: 最小化客户端状态，优先使用服务端组件和URL状态

**理由**:
- Next.js 14 App Router的服务端组件减少客户端JavaScript
- 搜索参数、分页等状态存储在URL中，支持分享和SEO
- 仅在必要时使用客户端状态（如表单、收藏按钮）
- 避免Redux等重量级状态管理库

**客户端状态仅用于**:
- 表单输入和验证
- UI交互状态（modal、dropdown等）
- 乐观更新（收藏按钮）

### 8. 表单处理：React Hook Form + Zod

**决策**: 使用React Hook Form处理表单，Zod进行schema验证

**理由**:
- React Hook Form性能优秀，减少重渲染
- Zod提供TypeScript类型安全的schema定义
- 前后端共享验证schema，保证一致性
- 良好的错误处理和用户反馈

### 9. 部署方案：Vercel + Neon/Supabase

**决策**: 使用Vercel部署应用，Neon或Supabase托管PostgreSQL

**理由**:
- Vercel是Next.js的最佳部署平台（零配置）
- 自动HTTPS、CDN、preview环境
- Neon提供serverless PostgreSQL，按需付费
- Supabase提供免费PostgreSQL + 额外功能（存储、实时等）

**环境设置**:
- Development: 本地PostgreSQL + 本地Cloudinary测试账号
- Preview: Vercel preview + Neon分支数据库
- Production: Vercel production + Neon主数据库

## Risks / Trade-offs

### 1. 图片存储成本
**风险**: 如果用户量增长，Cloudinary成本可能快速上升

**缓解措施**:
- 初期使用免费tier验证产品
- 实施上传限制（每个宠物最多5张照片）
- 监控使用量，设置告警
- 预留迁移方案（如必要，迁移到S3 + 自建图片处理）

### 2. PostgreSQL全文搜索性能
**风险**: 随着宠物数据增长，搜索性能可能下降

**缓解措施**:
- 合理设计索引
- 实施分页和结果数量限制
- 监控查询性能
- 准备迁移到Elasticsearch的方案（数据量 > 10万时）

### 3. 并发领养申请
**风险**: 多人同时申请同一只宠物，可能导致状态冲突

**缓解措施**:
- 使用数据库事务保证一致性
- 申请提交时检查宠物状态
- 明确的状态转换流程：available → pending → adopted
- 第一个获批的申请自动将宠物标记为pending

### 4. 缺少管理后台
**风险**: 管理员使用同一个前端UI可能不够高效

**缓解措施**:
- 第一版通过角色权限在同一UI中区分功能
- 管理员看到额外的操作按钮（审批、编辑、删除）
- 收集管理员反馈，决定是否需要独立后台
- 如需要，可以在同一Next.js项目中添加`/admin`路由

### 5. 移动端体验
**风险**: 响应式Web可能无法提供原生应用的流畅体验

**缓解措施**:
- 使用PWA技术（Service Worker、manifest）
- 优化移动端性能（代码分割、懒加载）
- 设计移动优先的UI
- 收集用户反馈，决定是否需要原生应用

### 6. 数据备份和恢复
**风险**: 数据丢失可能导致领养信息永久丢失

**缓解措施**:
- Neon/Supabase提供自动备份
- 实施定期导出重要数据
- 测试恢复流程
- 保留操作日志（Prisma中间件）

## Migration Plan

### 初始部署步骤

1. **设置基础设施**
   - 注册Vercel账号，连接GitHub仓库
   - 注册Neon账号，创建PostgreSQL数据库
   - 注册Cloudinary账号，获取API credentials
   - 配置环境变量（DATABASE_URL, NEXTAUTH_SECRET, CLOUDINARY_*）

2. **数据库初始化**
   - 运行Prisma migrations创建表结构
   - Seed初始数据（测试用户、示例宠物）

3. **部署**
   - 推送代码到main分支
   - Vercel自动构建和部署
   - 验证生产环境功能

4. **监控设置**
   - 配置Vercel Analytics
   - 设置错误监控（Sentry可选）
   - 配置数据库连接池监控

### 回滚策略

- Vercel提供instant rollback到任何历史部署
- 数据库schema变更使用Prisma migrations，支持回滚
- 关键操作前创建数据库快照

### 数据迁移（未来）

如果需要迁移数据库或图片存储：
1. 在新平台创建资源
2. 实施双写（写入旧和新系统）
3. 批量迁移历史数据
4. 验证数据一致性
5. 切换读取到新系统
6. 停止写入旧系统
7. 下线旧系统

## Open Questions

1. **角色权限模型**: 
   - 第一版只有adopter和admin两种角色是否足够？
   - 是否需要支持多个救助组织，每个组织有自己的管理员？

2. **通知机制**:
   - 领养申请状态变更时如何通知用户？
   - 邮件通知 vs 站内消息 vs 两者都有？
   - 是否需要短信通知？

3. **审核流程**:
   - 新发布的宠物是否需要审核才能上线？
   - 用户注册是否需要验证邮箱或手机？

4. **数据隐私**:
   - 用户的个人信息（电话、地址）何时对管理员可见？
   - 是否需要GDPR合规（如果面向海外用户）？

5. **性能目标**:
   - 页面加载时间目标是多少？（建议：首页 < 2秒，详情页 < 3秒）
   - 同时在线用户数预期？（用于估算资源需求）
