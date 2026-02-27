# 大巴扎助手 - 技术实现文档

## 1. 技术栈选型

### 1.1 Web 应用
| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 18 + TypeScript | 组件化开发，类型安全 |
| 状态管理 | Zustand | 轻量级状态管理 |
| UI 组件 | Ant Design 5.x | 成熟的企业级组件库 |
| 图表库 | ECharts / Recharts | 输出曲线、数据统计图表 |
| 构建工具 | Vite | 快速构建，热更新 |
| 路由 | React Router v6 | 单页应用路由 |

### 1.2 桌面应用
| 技术 | 说明 |
|------|------|
| Electron | 跨平台桌面应用框架 |
| 主进程 | Node.js，负责悬浮窗、游戏检测 |
| 渲染进程 | 复用 Web 版代码 |
| 悬浮窗 | Electron 的 BrowserWindow (alwaysOnTop) |

### 1.3 后端服务
| 技术 | 说明 |
|------|------|
| 运行时 | Node.js 20+ |
| 框架 | Express / Fastify |
| 数据库 | SQLite (本地) / PostgreSQL (云端) |
| ORM | Prisma |
| API 文档 | Swagger/OpenAPI |

### 1.4 数据存储
| 数据类型 | 存储方案 |
|----------|----------|
| 物品/技能数据 | SQLite (内置) |
| 用户构筑 | SQLite (本地) / 云端同步 |
| 战绩记录 | SQLite (本地) |
| 缓存 | LocalStorage / IndexedDB |

---

## 2. 系统架构

### 2.1 整体架构图
```
┌─────────────────────────────────────────────────────────────┐
│                      用户层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web 浏览器  │  │  桌面应用     │  │  桌面悬浮窗   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                      应用层                                 │
│  ┌────────────────────────┴──────────────────────────────┐ │
│  │                 React 前端应用                          │ │
│  │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐  │ │
│  │  │物品图鉴  │商店查询  │构筑系统  │战绩系统  │计算器   │  │ │
│  │  └─────────┴─────────┴─────────┴─────────┴─────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                      服务层                                 │
│  ┌────────────────────────┴──────────────────────────────┐ │
│  │                 Node.js API 服务                        │ │
│  │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐  │ │
│  │  │物品查询  │构筑管理  │战绩记录  │数据分析  │同步服务  │  │ │
│  │  └─────────┴─────────┴─────────┴─────────┴─────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                      数据层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   SQLite     │  │  IndexedDB   │  │  LocalStorage│      │
│  │  (物品数据)   │  │  (用户数据)   │  │  (配置缓存)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 桌面应用架构
```
┌─────────────────────────────────────────┐
│           Electron 主进程                │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  主窗口管理  │  │   悬浮窗管理     │  │
│  │  (加载 Web) │  │  (alwaysOnTop)  │  │
│  └─────────────┘  └─────────────────┘  │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  游戏检测    │  │   数据同步       │  │
│  │ (可选: OCR) │  │  (主进程 ↔ 渲染) │  │
│  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    │ IPC 通信
                    │
┌─────────────────────────────────────────┐
│           Electron 渲染进程              │
│         (复用 Web 版 React 应用)          │
└─────────────────────────────────────────┘
```

---

## 3. 数据库设计

### 3.1 实体关系图
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Item      │     │   Build      │     │    Match     │
│   (物品)      │     │   (构筑)      │     │   (对局)      │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ name         │     │ name         │     │ characterId  │
│ size         │◄────┤ items        │     │ buildId      │
│ category     │     │ characterId  │     │ result       │
│ effect       │     │ wins         │     │ wins         │
│ bronzeData   │     │ createdAt    │     │ damage       │
│ silverData   │     └──────────────┘     │ healing      │
│ goldData     │            │             │ rounds       │
│ diamondData  │            │             │ createdAt    │
│ source       │            ▼             └──────────────┘
└──────────────┘     ┌──────────────┐            │
                     │  BuildItem   │◄───────────┘
                     │ (构筑物品关联) │
                     ├──────────────┤
                     │ buildId      │
                     │ itemId       │
                     │ position     │
                     │ enchantId    │
                     └──────────────┘
```

### 3.2 数据表结构

#### items (物品表)
```sql
CREATE TABLE items (
  id TEXT PRIMARY KEY,           -- 唯一标识
  name TEXT NOT NULL,            -- 物品名称
  nameEn TEXT,                   -- 英文名称
  size INTEGER NOT NULL,         -- 尺寸: 1=小型, 2=中型, 3=大型
  category TEXT NOT NULL,        -- 类别: weapon/tool/water/food/...
  rarity TEXT NOT NULL,          -- 稀有度: common/rare/epic/legendary
  effect TEXT NOT NULL,          -- 效果描述
  triggerCondition TEXT,         -- 触发条件
  cooldown REAL,                 -- CD时间(秒)
  
  -- 各品质数据 (JSON)
  bronzeData TEXT,               -- { damage: 10, heal: 0, ... }
  silverData TEXT,
  goldData TEXT,
  diamondData TEXT,
  
  -- 元数据
  characterId TEXT,              -- 角色专属 (null=通用)
  sources TEXT,                  -- 获取来源 (JSON数组)
  tags TEXT,                     -- 标签 (JSON数组)
  synergies TEXT,                -- 协同物品 (JSON数组)
  
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### shops (商店表)
```sql
CREATE TABLE shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,            -- 商店名称
  type TEXT NOT NULL,            -- 商店类型
  dayAvailable INTEGER,          -- 第几天开始出现
  items TEXT                     -- 可售物品ID列表 (JSON)
);
```

#### builds (构筑表)
```sql
CREATE TABLE builds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,            -- 构筑名称
  characterId TEXT NOT NULL,     -- 角色
  description TEXT,              -- 描述
  
  -- 统计数据
  totalGames INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  avgDamage REAL,
  avgHealing REAL,
  
  -- 元数据
  tags TEXT,                     -- 标签 (JSON)
  isPublic BOOLEAN DEFAULT 0,    -- 是否公开
  shareCode TEXT UNIQUE,         -- 分享代码
  
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### build_items (构筑物品关联表)
```sql
CREATE TABLE build_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buildId TEXT NOT NULL,
  itemId TEXT NOT NULL,
  position INTEGER,              -- 摆放位置 (0-9)
  enchantId TEXT,                -- 附魔ID
  FOREIGN KEY (buildId) REFERENCES builds(id),
  FOREIGN KEY (itemId) REFERENCES items(id)
);
```

#### matches (对局记录表)
```sql
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  characterId TEXT NOT NULL,
  buildId TEXT,
  
  -- 对局结果
  result TEXT NOT NULL,          -- win/loss
  finalWins INTEGER,             -- 最终胜场数
  reputationLost INTEGER,        -- 失去的声望
  
  -- 统计数据
  totalDamage INTEGER,
  totalHealing INTEGER,
  totalRounds INTEGER,
  
  -- 构筑快照
  buildSnapshot TEXT,            -- JSON
  
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### skills (技能表)
```sql
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,            -- character/generic/monster
  characterId TEXT,              -- 角色专属时填写
  effect TEXT NOT NULL,
  rarity TEXT                    -- common/rare/epic
);
```

#### enchants (附魔表)
```sql
CREATE TABLE enchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  effect TEXT NOT NULL,
  applicableItems TEXT           -- 适用物品类型 (JSON)
);
```

#### monsters (野怪表)
```sql
CREATE TABLE monsters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty INTEGER,            -- 难度等级 1-5
  dayAvailable INTEGER,          -- 第几天出现
  skills TEXT,                   -- 技能 (JSON)
  drops TEXT                     -- 掉落物品 (JSON)
);
```

---

## 4. API 设计

### 4.1 物品相关
```
GET    /api/items              # 获取物品列表 (支持筛选)
GET    /api/items/:id          # 获取单个物品详情
GET    /api/items/search       # 搜索物品
GET    /api/items/categories   # 获取物品分类列表
```

### 4.2 商店相关
```
GET    /api/shops              # 获取商店列表
GET    /api/shops/:id/items    # 获取商店可售物品
POST   /api/shops/query        # 按条件查询商店物品
```

### 4.3 构筑相关
```
GET    /api/builds             # 获取构筑列表
POST   /api/builds             # 创建构筑
GET    /api/builds/:id         # 获取构筑详情
PUT    /api/builds/:id         # 更新构筑
DELETE /api/builds/:id         # 删除构筑
POST   /api/builds/:id/share   # 生成分享代码
GET    /api/builds/code/:code  # 通过代码获取构筑
```

### 4.4 战绩相关
```
GET    /api/matches            # 获取对局记录
POST   /api/matches            # 记录对局
GET    /api/matches/stats      # 获取统计数据
GET    /api/matches/analysis   # 对局分析
```

### 4.5 计算相关
```
POST   /api/calc/damage        # 计算理论伤害
POST   /api/calc/optimize      # 优化摆放位置
POST   /api/calc/simulate      # 模拟对战
```

---

## 5. 项目结构

```
bazaar-assistant/
├── docs/                       # 文档
│   ├── PRD.md                 # 需求文档
│   └── TECH.md                # 技术文档
│
├── shared/                     # 共享代码
│   ├── types/                 # TypeScript 类型定义
│   ├── constants/             # 常量
│   └── utils/                 # 工具函数
│
├── web/                        # Web 应用
│   ├── src/
│   │   ├── components/        # 组件
│   │   ├── pages/             # 页面
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── stores/            # 状态管理
│   │   ├── services/          # API 服务
│   │   ├── utils/             # 工具函数
│   │   ├── assets/            # 静态资源
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── desktop/                    # 桌面应用
│   ├── src/
│   │   ├── main/              # 主进程
│   │   │   ├── index.ts
│   │   │   ├── window.ts      # 窗口管理
│   │   │   ├── overlay.ts     # 悬浮窗
│   │   │   └── game-detector.ts # 游戏检测
│   │   └── preload/           # 预加载脚本
│   ├── package.json
│   └── electron-builder.json
│
├── server/                     # 后端服务 (可选)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── index.ts
│   └── package.json
│
└── database/                   # 数据库
    ├── schema.sql
    ├── seed-data/             # 初始数据
    └── migrations/
```

---

## 6. 开发计划

### 阶段一：基础架构 (Week 1)
- [ ] 项目初始化
- [ ] 数据库设计 + 初始数据
- [ ] Web 项目搭建
- [ ] 基础组件库

### 阶段二：核心功能 (Week 2-3)
- [ ] 物品图鉴系统
- [ ] 商店池查询
- [ ] 构筑库基础功能
- [ ] 数据导入/导出

### 阶段三：进阶功能 (Week 4)
- [ ] 摆放优化器
- [ ] 伤害计算器
- [ ] 战绩系统

### 阶段四：桌面版 (Week 5)
- [ ] Electron 项目搭建
- [ ] 悬浮窗实现
- [ ] 打包发布

---

## 7. 技术难点

### 7.1 游戏数据获取
- 方案A：手动录入官方数据
- 方案B：社区数据导入 (bazaardb.gg)
- 方案C：OCR识别游戏画面（桌面版）

### 7.2 摆放优化算法
- 使用遗传算法或模拟退火
- 考虑触发顺序、协同效果
- 实时计算反馈

### 7.3 悬浮窗实现
- 跨平台窗口管理
- 游戏画面检测
- 性能优化

---

## 8. 部署方案

### Web 版
- 静态托管：Vercel / Netlify / GitHub Pages
- 可选后端：Railway / Render

### 桌面版
- 自动更新：electron-updater
- 发布平台：GitHub Releases
- 签名证书：需要自行申请
