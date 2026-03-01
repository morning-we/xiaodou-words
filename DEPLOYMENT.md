# 小豆单词 - 发布部署指南

## 📦 发布方案选择

根据你的需求，可以选择以下任一种发布方式：

### 方案 1：Vercel（推荐，最简单）
- ✅ Next.js 官方推荐，零配置
- ✅ 自动 HTTPS 和 CDN
- ✅ 免费额度充足（100GB 带宽/月）
- ✅ 自动部署（Git 推送即发布）
- ✅ 全球边缘网络加速

### 方案 2：Docker 容器化部署
- ✅ 灵活可控，适合自己的服务器
- ✅ 环境一致，易于迁移
- ✅ 适合生产环境

### 方案 3：云服务器部署
- ✅ 阿里云、腾讯云等国内云平台
- ✅ 访问速度快（国内用户）
- ✅ 完全控制权

---

## 🚀 方案 1：部署到 Vercel（推荐）

### 步骤 1：准备代码仓库
```bash
# 如果还没有 Git 仓库，初始化一个
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub/GitLab
# 创建远程仓库后：
git remote add origin <你的仓库地址>
git push -u origin main
```

### 步骤 2：注册 Vercel
1. 访问 https://vercel.com
2. 使用 GitHub、GitLab 或邮箱注册
3. 免费账号即可

### 步骤 3：导入项目
1. 点击 "Add New" → "Project"
2. 选择你的 GitHub 仓库
3. Vercel 会自动检测 Next.js 项目
4. 点击 "Deploy"

### 步骤 4：配置环境变量（可选）
如果项目需要环境变量，在 Vercel 项目设置中添加：
- 进入项目 → Settings → Environment Variables
- 添加所需的环境变量

### 步骤 5：完成部署
- 等待 2-3 分钟
- Vercel 会自动分配一个域名：`https://你的项目名.vercel.app`
- 可以在设置中绑定自定义域名

### 自动部署
- 每次推送到主分支，Vercel 会自动重新部署
- 支持 PR 预览，方便测试

---

## 🐳 方案 2：Docker 容器化部署

### 步骤 1：创建 Dockerfile
在项目根目录创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:24-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm run build

# 运行阶段
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 复制构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["node", "server.js"]
```

### 步骤 2：修改 next.config.ts
需要启用 standalone 输出：

```typescript
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone', // 添加这行
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

### 步骤 3：构建和运行
```bash
# 构建镜像
docker build -t xiaodou-words .

# 运行容器
docker run -d -p 5000:5000 --name xiaodou-words xiaodou-words
```

### 步骤 4：部署到服务器
```bash
# 保存镜像
docker save xiaodou-words | gzip > xiaodou-words.tar.gz

# 上传到服务器
scp xiaodou-words.tar.gz user@your-server:/tmp/

# 在服务器上加载并运行
docker load < /tmp/xiaodou-words.tar.gz
docker run -d -p 80:5000 --name xiaodou-words --restart=always xiaodou-words
```

---

## ☁️ 方案 3：云服务器部署

### 准备工作
1. 购买云服务器（阿里云、腾讯云等）
2. 安装 Node.js 24 和 pnpm
3. 安装 Nginx（可选，用于反向代理）

### 部署步骤
```bash
# 1. 克隆代码
git clone <你的仓库地址> /var/www/xiaodou-words
cd /var/www/xiaodou-words

# 2. 安装依赖
pnpm install

# 3. 构建项目
pnpm run build

# 4. 使用 PM2 管理进程
pnpm add -D pm2
npx pm2 start npm --name "xiaodou-words" -- start
npx pm2 save
npx pm2 startup
```

### 配置 Nginx（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 配置 HTTPS（可选）
使用 Let's Encrypt 免费证书：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📊 方案对比

| 特性 | Vercel | Docker | 云服务器 |
|------|--------|--------|----------|
| 难度 | ⭐ 简单 | ⭐⭐ 中等 | ⭐⭐⭐ 复杂 |
| 成本 | 免费/便宜 | 服务器成本 | 服务器成本 |
| 维护 | 自动 | 需手动维护 | 需手动维护 |
| 扩展性 | 自动扩展 | 需手动扩展 | 需手动扩展 |
| 国内访问 | 慢 | 取决于服务器 | 快 |
| 自定义域名 | 支持 | 支持 | 支持 |
| HTTPS | 自动 | 需配置 | 需配置 |

---

## 💡 推荐选择

### 如果你是个人项目或快速原型：
→ **选择 Vercel**（最简单，5 分钟部署完成）

### 如果你有自己的服务器：
→ **选择 Docker**（灵活可控，易于迁移）

### 如果主要用户在国内：
→ **选择云服务器**（阿里云/腾讯云，访问速度快）

### 如果需要完全控制：
→ **选择 Docker + 自己的服务器**

---

## 🎯 下一步

请告诉我你想使用哪种方案，我可以为你提供详细的实施指导！

1. **Vercel**：我帮你准备 Git 仓库和部署配置
2. **Docker**：我帮你创建 Dockerfile 和部署脚本
3. **云服务器**：我帮你准备完整的部署文档
