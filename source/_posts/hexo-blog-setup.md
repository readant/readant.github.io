---
title: Hexo 博客搭建完全指南
date: 2026-05-09
categories: 教程
tags: [Hexo, GitHub Pages, 博客]
---

# Hexo 博客搭建完全指南

## 前言

Hexo 是一个快速、简洁且高效的博客框架，使用 Markdown 编写文章，生成静态网页。本文将详细介绍如何从零开始搭建一个基于 Hexo + GitHub Pages 的个人博客。

## 环境准备

### 1. 安装 Node.js

Hexo 基于 Node.js 运行，需要先安装 Node.js 环境。

**下载地址**：https://nodejs.org/

安装完成后，在终端验证：
```bash
node -v
npm -v
```

### 2. 安装 Git

Git 用于版本管理和部署到 GitHub。

**下载地址**：https://git-scm.com/

验证安装：
```bash
git --version
```

### 3. 配置 GitHub

如果没有 GitHub 账号，需要先注册：https://github.com/

然后配置 Git：
```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

生成 SSH 密钥（用于免密登录）：
```bash
ssh-keygen -t rsa -C "你的邮箱"
```

将 `~/.ssh/id_rsa.pub` 的内容添加到 GitHub Settings → SSH Keys。

## 初始化博客

### 1. 创建博客项目

```bash
# 使用 npm 创建博客项目
npx hexo init blog
cd blog

# 安装依赖
npm install
```

### 2. 项目目录结构

```
blog/
├── _config.yml      # 博客配置文件
├── package.json    # 依赖配置
├── scaffolds/      # 文章模板
├── source/         # 博客内容
│   └── _posts/     # 文章目录
└── themes/        # 主题目录
```

### 3. 启动本地服务器

```bash
npx hexo server
```

浏览器访问 http://localhost:4000 即可预览博客。

## 更换主题

Hexo 有丰富的主题生态，可以根据喜好选择。

### 安装主题

以 Butterfly 主题为例：
```bash
npm install hexo-theme-butterfly
```

### 启用主题

修改 `_config.yml`：
```yaml
theme: butterfly
```

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

在 GitHub 创建一个名为 `username.github.io` 的仓库（username 为你的 GitHub 用户名）。

### 2. 安装部署插件

```bash
npm install hexo-deployer-git --save
```

### 3. 配置部署信息

修改 `_config.yml`：
```yaml
deploy:
  type: git
  repo: https://github.com/username/username.github.io.git
  branch: gh-pages
```

### 4. 部署博客

```bash
# 生成静态文件
npx hexo generate

# 部署到 GitHub
npx hexo deploy
```

### 5. 配置 GitHub Pages

在 GitHub 仓库 Settings → Pages：
- Source 选择 `gh-pages` 分支

等待几分钟后，博客即可通过 `https://username.github.io` 访问。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npx hexo server` | 启动本地服务器 |
| `npx hexo generate` | 生成静态文件 |
| `npx hexo deploy` | 部署到 GitHub |
| `npx hexo new "标题"` | 创建新文章 |
| `npx hexo clean` | 清理缓存文件 |

## 编写文章

### 创建文章

```bash
npx hexo new "我的第一篇文章"
```

文章会创建在 `source/_posts/` 目录下。

### 文章格式

文章使用 Markdown 编写，开头需要包含 Front-matter：

```markdown
---
title: 我的第一篇文章
date: 2026-05-09
categories: 分类
tags: [标签1, 标签2]
---

正文内容...
```

## 常见问题

### Q: 部署后页面没有更新？

尝试清理缓存后重新部署：
```bash
npx hexo clean
npx hexo generate
npx hexo deploy
```

### Q: GitHub Pages 显示 404？

检查 GitHub 仓库 Settings → Pages 的 Source 是否设置为 `gh-pages` 分支。

### Q: 如何绑定自定义域名？

在 `source/` 目录添加 `CNAME` 文件，内容为你的域名，然后在域名服务商处添加 DNS 解析。

## 结语

通过以上步骤，你已经成功搭建了一个基于 Hexo + GitHub Pages 的个人博客。Hexo 的强大之处在于其丰富的主题和插件生态，你可以根据需要进一步定制和优化你的博客。

祝你写作愉快！