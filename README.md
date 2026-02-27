# 大巴扎助手 - 项目总结

## 已完成内容

### 1. 文档
- ✅ PRD.md - 需求文档
- ✅ TECH.md - 技术实现文档

### 2. Web 应用 (/web)
- ✅ React + TypeScript + Vite 项目结构
- ✅ Ant Design UI 组件
- ✅ 路由配置
- ✅ 页面框架：
  - 首页 (Home)
  - 物品图鉴 (Items) - 带筛选功能
  - 商店查询 (Shops)
  - 构筑库 (Builds) - 可新建构筑
  - 计算器 (Calculator) - 带输出曲线图
  - 战绩 (Matches)
- ✅ 构建成功

### 3. 桌面应用 (/desktop)
- ✅ Electron 项目结构
- ✅ 主进程代码
- ✅ 悬浮窗实现
- ✅ 预加载脚本

### 4. 项目结构
```
bazaar-assistant/
├── docs/
│   ├── PRD.md          # 需求文档
│   └── TECH.md         # 技术文档
├── web/                # Web 应用
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── dist/           # 构建输出
│   └── package.json
├── desktop/            # 桌面应用
│   ├── src/
│   │   ├── main/       # 主进程
│   │   └── preload/    # 预加载
│   └── package.json
└── shared/             # 共享代码
```

## 如何运行

### Web 版
```bash
cd bazaar-assistant/web
npm install
npm run dev          # 开发模式
npm run build        # 构建生产版本
```

### 桌面版
```bash
cd bazaar-assistant/desktop
npm install
npm run dev          # 开发模式
npm run dist         # 打包发布
```

## 待完成事项

### 高优先级
- [ ] 填充真实物品数据（目前为 mock 数据）
- [ ] 实现数据筛选和搜索功能
- [ ] 构筑保存和分享功能
- [ ] 战绩记录功能

### 中优先级
- [ ] 桌面版悬浮窗与主进程通信
- [ ] 输出曲线实时计算优化
- [ ] 摆放优化算法

### 低优先级
- [ ] 数据导入（从 bazaardb.gg）
- [ ] 云端同步
- [ ] 自动更新

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite |
| UI | Ant Design 5.x |
| 图表 | ECharts |
| 状态 | Zustand |
| 桌面 | Electron |
| 数据 | SQLite (计划中) |

## 截图

Web 应用已构建完成，可以运行 `npm run dev` 查看效果。
