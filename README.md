# 从前端新手到高级全栈 Agent 开发工程师 — 学习路线图

> 基于 supastarter Next.js 项目实践，系统规划从前端到全栈再到 AI Agent 开发的完整学习路径。

---

## 第一阶段：前端基础夯实（1-3 个月）

### HTML / CSS
- 语义化 HTML、无障碍（a11y）
- CSS Flexbox / Grid 布局
- 响应式设计与移动端适配
- Tailwind CSS（本项目使用）

### JavaScript 核心
- ES6+ 语法：解构、展开运算符、Promise、async/await
- 事件循环与异步编程模型
- 模块化（ESM / CommonJS）
- 错误处理与调试技巧

### TypeScript
- 类型系统：基础类型、接口、泛型、联合/交叉类型
- 类型推断与类型守卫
- 工具类型（Partial、Pick、Omit、Record 等）
- 在 React 项目中使用 TypeScript

### React
- 组件化思维、JSX
- Hooks（useState、useEffect、useRef、useMemo、useCallback）
- 自定义 Hook 编写
- 状态管理（Context、Zustand / Jotai）
- React Server Components 概念

---

## 第二阶段：现代全栈框架（2-4 个月）

### Next.js（本项目核心）
- App Router（路由、布局、加载状态、错误处理）
- Server Components vs Client Components
- Server Actions
- 中间件（Middleware）
- API Routes
- ISR / SSR / SSG 渲染策略
- 图片与字体优化

### 数据库与 ORM
- SQL 基础（查询、联表、索引）
- PostgreSQL
- Prisma / Drizzle ORM
- 数据库迁移管理
- Supabase（本项目使用）：Auth、Database、Storage、Realtime

### 身份认证与授权
- Cookie / Session / JWT 原理
- OAuth 2.0 / OpenID Connect
- 基于角色的访问控制（RBAC）
- Next-Auth / Supabase Auth

### API 设计
- RESTful API 设计原则
- tRPC（类型安全的 API 层）
- GraphQL 基础
- API 版本管理与错误规范

---

## 第三阶段：后端与基础设施（2-3 个月）

### Node.js
- 文件系统、Stream、Buffer
- Express / Hono / Fastify
- 中间件模式
- 进程管理与集群

### DevOps 基础
- Git 工作流（分支策略、Code Review、CI/CD）
- Docker 容器化
- Vercel / AWS / Cloudflare 部署
- 环境变量与密钥管理
- 日志与监控（Sentry、Grafana）

### 系统设计入门
- 缓存策略（Redis、CDN）
- 消息队列（BullMQ、RabbitMQ）
- 限流与熔断
- 微服务 vs 单体架构的取舍

---

## 第四阶段：AI 基础与大模型应用（2-3 个月）

### AI / ML 基础概念
- 机器学习基本概念（监督/无监督/强化学习）
- 神经网络与深度学习入门
- Transformer 架构原理
- Token、Embedding、向量数据库（Pinecone、pgvector）

### 大模型 API 使用
- Claude API / OpenAI API 调用
- Prompt Engineering（提示词工程）
  - 系统提示词设计
  - Few-shot / Chain-of-Thought
  - 结构化输出（JSON mode）
- 流式响应（Streaming）处理
- Function Calling / Tool Use
- 多模态（文本、图像、文档）

### AI 应用开发
- Vercel AI SDK（本项目生态）
- LangChain / LlamaIndex
- RAG（检索增强生成）
  - 文档切片与 Embedding
  - 向量检索与重排序
  - 上下文窗口管理
- 对话记忆管理
- AI 应用的评估与测试（Eval）

---

## 第五阶段：Agent 开发 — 核心目标（3-6 个月）

### Agent 核心概念
- Agent = LLM + 工具调用 + 规划 + 记忆
- ReAct 模式（推理 + 行动循环）
- 规划与任务分解（Plan-and-Execute）
- 自我反思与纠错机制

### Agent 框架与工具
- **Claude Agent SDK**（Anthropic 官方）
  - Agent 定义与生命周期
  - Tool 定义与调用
  - 多 Agent 协作（Handoff）
  - Guardrails 与安全控制
- **LangGraph** — 基于图的 Agent 工作流
- **CrewAI** — 多 Agent 角色协作
- **AutoGen** — 微软多 Agent 对话框架
- **Mastra** — TypeScript Agent 框架

### Agent 设计模式
- 单 Agent + 多工具
- 多 Agent 协作（Manager-Worker、Peer-to-Peer）
- Human-in-the-Loop（人机协同）
- Agent 记忆系统（短期 / 长期 / 工作记忆）
- Agent 可观测性与调试

### 工具（Tool）开发
- MCP（Model Context Protocol）服务器开发
- 自定义工具封装（API 调用、数据库查询、代码执行）
- 工具描述编写最佳实践
- 沙箱与安全执行环境

### 实战项目建议
1. **智能客服 Agent** — 接入知识库，自动回答用户问题
2. **代码审查 Agent** — 自动 Review PR 并给出建议
3. **数据分析 Agent** — 自然语言查询数据库并生成报表
4. **多 Agent 工作流** — 多个 Agent 协作完成复杂任务（如内容创作管线）
5. **个人助理 Agent** — 整合日历、邮件、笔记的全能助手

---

## 第六阶段：高级进阶（持续学习）

### 生产级 Agent 系统
- 可靠性工程：重试、降级、超时策略
- 成本控制：Token 用量优化、模型路由
- 安全性：Prompt 注入防御、输出过滤、权限最小化
- 性能优化：缓存、并发、流式处理
- A/B 测试与灰度发布

### 前沿方向
- Computer Use（让 Agent 操作电脑）
- 多模态 Agent（视觉 + 语音 + 文本）
- Agent 自主学习与进化
- Agent 与 Web3 / 区块链集成
- Agent 市场与生态

---

## 推荐学习资源

### 文档与教程
| 资源 | 链接 |
|------|------|
| Next.js 官方文档 | https://nextjs.org/docs |
| TypeScript 官方文档 | https://www.typescriptlang.org/docs |
| Supabase 官方文档 | https://supabase.com/docs |
| Claude API 文档 | https://docs.anthropic.com |
| Vercel AI SDK | https://sdk.vercel.ai/docs |
| LangChain 文档 | https://js.langchain.com/docs |
| Prompt Engineering Guide | https://www.promptingguide.ai |

### 视频课程
- freeCodeCamp（免费全栈课程）
- Fireship（快速了解技术概念）
- Theo Browne（Next.js 生态）
- Andrej Karpathy（AI/ML 入门）

### 书籍
- 《JavaScript 高级程序设计》（第4版）
- 《深入理解 TypeScript》
- 《系统设计面试》
- 《Building LLM Powered Applications》

### 社区
- GitHub — 阅读开源项目源码
- Discord — Next.js / Supabase / LangChain 社区
- Twitter/X — 关注 AI 领域开发者动态

---

## 学习原则

1. **项目驱动** — 每个阶段至少做一个完整项目，不要只看教程
2. **阅读源码** — 阅读优秀开源项目的代码比看 100 篇教程更有效
3. **写技术博客** — 输出是最好的学习方式
4. **参与开源** — 从修 typo 开始，逐步提交有意义的 PR
5. **拥抱 AI 工具** — 用 Claude Code 等工具提升开发效率，但要理解底层原理
6. **保持耐心** — 这条路线需要 12-18 个月，扎实走完比速成更重要
