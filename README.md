# 🌱 小豆单词

每天进步一点点 - 一个优雅的单词学习应用

## ✨ 功能特点

- 📚 **菜单管理** - 自定义单词分类和菜单
- 🎯 **单词练习** - 20题随机测试，智能评分
- 📊 **进度追踪** - 查看学习记录和统计
- 🏆 **积分系统** - 答对得分，每日签到
- 👤 **个人中心** - 管理账户和查看历史
- 🔒 **后台管理** - 管理菜单、用户和记录

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 访问 http://localhost:5000
```

### 构建生产版本

```bash
# 构建
pnpm run build

# 启动生产服务器
pnpm run start
```

## 📦 部署到 Vercel

**最简单的方式，5 分钟上线！**

详细步骤请查看：[DEPLOY_NOW.md](./DEPLOY_NOW.md)

### 快速部署

1. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/xiaodou-words.git
   git push -u origin main
   ```

2. **在 Vercel 导入**
   - 访问 https://vercel.com
   - 导入 GitHub 仓库
   - 点击 Deploy

3. **完成！**
   - 访问生成的域名：`https://xiaodou-words.vercel.app`

详细文档：[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

## 📱 访问地址

- **启动页**: `/`
- **登录页**: `/login`
- **主页**: `/home`
- **练习页**: `/practice`
- **个人中心**: `/profile`
- **后台管理**: `/admin`

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: React 19 + shadcn/ui
- **样式**: Tailwind CSS 4
- **语言**: TypeScript 5
- **包管理**: pnpm

## 📄 文档

- [部署指南](./DEPLOYMENT.md) - 完整的部署方案
- [Vercel 部署](./VERCEL_DEPLOY.md) - Vercel 详细步骤
- [立即部署](./DEPLOY_NOW.md) - 5 分钟快速部署

## 🎯 使用说明

1. **注册登录** - 创建账号开始学习
2. **选择菜单** - 从主页选择要学习的单词分类
3. **开始练习** - 每次练习 20 题，30 秒/题
4. **查看进度** - 在个人中心查看学习记录
5. **后台管理** - 管理菜单、用户和操作记录

## 💾 数据存储

使用浏览器 localStorage 存储：
- 用户信息
- 单词菜单
- 练习记录
- 操作日志

## 🔐 积分规则

- 每答对一题得 5 分
- 满 100 分换算 1 积分
- 每日签到得 1 积分

## 📝 开发

### 类型检查
```bash
pnpm run ts-check
```

### 代码检查
```bash
pnpm run lint
```

## 🌐 其他部署方案

- [Docker 部署](./DEPLOYMENT.md#方案-2docker-容器化部署)
- [云服务器部署](./DEPLOYMENT.md#方案-3云服务器部署)

## 📄 许可证

MIT

## 🙏 致谢

使用 Next.js、React、Tailwind CSS 等优秀开源技术构建。

---

**每天进步一点点，从小豆开始！** 🌱
