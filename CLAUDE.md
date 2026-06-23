# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

三端知识分享平台（代码分享平台），包含 Web 前端、管理后台和后端 API 三个独立子项目，支持文章分享、题库练习、简历制作等功能。

## 项目结构

```
code-sharing/
├── frontend/          # Web 前端（Vue 3 + Vite）
├── frontend-api/      # 后端 API（Node.js + Express + MongoDB）
├── admin/             # 管理后台（Vue 3 + Vite）
└── admin-api/         # 管理后台 API
```

## 常用开发命令

### Web 前端（frontend/）
```bash
cd frontend
npm install          # 安装依赖
npm run dev          # 启动开发服务器（Vite）
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
```

### 后端 API（frontend-api/）
```bash
cd frontend-api
npm install          # 安装依赖
npm start            # 启动服务器（nodemon，端口 3040）
```

### 管理后台（admin/）
```bash
cd admin
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
```

## 技术栈

### 前端核心
- **Vue 3** + Composition API（`<script setup>` 语法）
- **Vite 7** 构建工具
- **Pinia** 状态管理（使用 `pinia-plugin-persistedstate` 持久化）
- **Vue Router 4** 路由管理（含路由守卫）

### Markdown 渲染
- **marked** 解析 Markdown 为 HTML
- **highlight.js** 代码语法高亮（Tokyo Night Dark 主题）
- 核心逻辑在 `frontend/src/tools/markdown.js`

### 后端
- **Express 4** RESTful API
- **MongoDB** + Mongoose ODM
- **JWT** 认证（24小时有效期，密钥在 `token.js`）
- **CORS** 跨域配置
- 请求体大小限制：10MB

### 数据模型（frontend-api/models/）
- `article.js` - 文章
- `question.js` - 题目
- `user.js` - 用户
- `register.js` - 注册申请
- `cateGory.js` - 题库分类
- `articleCategory.js` - 文章分类
- `links.js` - 友链
- `userArticleLog.js` - 文章浏览记录
- `userQuestionLog.js` - 题目浏览记录

## 架构要点

### 路由守卫（router.js）
- 白名单：仅 `/login` 无需登录
- 其他页面需通过 `/admin/check` 接口验证 JWT Token
- Token 存储在 localStorage

### API 路由结构
- `/` 前缀：公开接口（文章、题目、分类、友链）
- `/admin` 前缀：需认证接口（登录、注册、浏览记录、用户管理）

### 状态管理（store/）
- `user.js` - 用户状态
- `article.js` - 文章状态
- `question.js` - 题目状态
- `log.js` - 浏览记录状态

### Markdown 渲染流程
1. `marked.parse()` 将 Markdown 转为 HTML
2. `highlight.js` 对代码块进行语法高亮
3. 自动提取标题生成目录（TOC）
4. 支持平滑滚动到指定标题

## 开发注意事项

### 环境配置
- 后端端口：3040（`frontend-api/app.js`）
- 前端开发端口：Vite 默认 5173
- MongoDB 连接：配置在 `frontend-api/mongo.js`
- 服务器地址：配置在 `frontend/src/tools/ip.js`

### 代码规范
- Vue 组件使用 `<script setup>` 语法
- 后端使用 CommonJS 模块（`require/module.exports`）
- 前端使用 ES Modules（`import/export`）

### 常见问题
- **跨域问题**：前端通过 Vite 代理 + 后端 CORS 双重方案解决
- **Markdown 渲染**：使用 `renderArticleMarkdown()` 或 `renderQuestionMarkdown()` 函数
- **Token 刷新**：当前无自动刷新机制，过期后需重新登录
