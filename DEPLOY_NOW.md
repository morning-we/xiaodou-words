# 🚀 小豆单词 - 立即部署到 Vercel

## 📋 当前状态
✅ 代码已准备完成
✅ Git 仓库已初始化
✅ 部署配置已添加
⏳ 等待你推送到 GitHub 并部署

---

## 第一步：创建 GitHub 仓库（2 分钟）

### 1. 访问 GitHub
打开浏览器访问：https://github.com/new

### 2. 创建新仓库
填写以下信息：
- **Repository name**: `xiaodou-words`（或你喜欢的名字）
- **Description**: 小豆单词 - 每天进步一点点
- **Visibility**: 选择 Private（私有）或 Public（公开）
- **❌ 不要勾选**：
  - [ ] Add a README file
  - [ ] Add .gitignore
  - [ ] Choose a license
- 点击 **"Create repository"**

### 3. 复制仓库地址
创建后会看到类似这样的地址：
```
https://github.com/你的用户名/xiaodou-words.git
```
复制这个地址！

---

## 第二步：推送代码到 GitHub（1 分钟）

### 在项目目录执行以下命令：

```bash
cd /workspace/projects

# 添加 GitHub 仓库（替换下面的地址为你的仓库地址）
git remote add origin https://github.com/你的用户名/xiaodou-words.git

# 推送代码到 GitHub
git push -u origin main
```

### 如果遇到认证问题：

**方法 1：使用 Personal Access Token**
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 推送时使用 token 作为密码：
```bash
git push -u origin main
# 用户名：GitHub 用户名
# 密码：刚才生成的 token
```

**方法 2：使用 SSH**
```bash
git remote set-url origin git@github.com:你的用户名/xiaodou-words.git
git push -u origin main
```

### 验证推送成功
访问你的 GitHub 仓库，应该能看到所有代码文件！

---

## 第三步：在 Vercel 部署（3 分钟）

### 3.1 注册 Vercel
1. 访问 https://vercel.com
2. 点击 **"Sign Up"**
3. 选择 **GitHub** 登录（推荐，可以自动部署）
4. 授权 Vercel 访问你的 GitHub 仓库
5. 选择 **Hobby**（免费计划）

### 3.2 导入项目
1. 登录后，点击 **"Add New..."** → **"Project"**
2. 找到 `xiaodou-words` 仓库
3. 点击 **"Import"**

### 3.3 配置项目（保持默认即可）
Vercel 会自动检测并配置：
- **Framework Preset**: Next.js ✅
- **Build Command**: `pnpm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `pnpm install` ✅

**Project Name**: `xiaodou-words`（可以自定义）

点击 **"Deploy"**

### 3.4 等待部署
部署过程约 2-3 分钟：
- Cloning repository ✅
- Installing dependencies ✅
- Building project ✅
- Deploying to Edge Network ✅

### 3.5 访问应用
部署成功后，点击 **Live URL**：
```
https://xiaodou-words.vercel.app
```

🎉 **恭喜！你的应用已经上线了！**

---

## 📱 测试你的应用

访问部署地址，测试以下功能：

### 页面访问
- ✅ 启动页：`https://xiaodou-words.vercel.app/`
- ✅ 登录页：`https://xiaodou-words.vercel.app/login`
- ✅ 主页：`https://xiaodou-words.vercel.app/home`
- ✅ 后台：`https://xiaodou-words.vercel.app/admin`

### 功能测试
- ✅ 注册/登录
- ✅ 选择菜单练习
- ✅ 单词练习
- ✅ 查看个人中心
- ✅ 后台管理（需要先登录）

---

## 🔄 自动部署

### 推送代码自动部署
以后你修改代码后，只需：

```bash
git add .
git commit -m "Add new feature"
git push
```

Vercel 会自动检测到推送并重新部署！

### 查看部署日志
1. 访问 https://vercel.com/dashboard
2. 选择 `xiaodou-words` 项目
3. 点击 **"Deployments"**
4. 选择部署记录查看日志

---

## 🌐 自定义域名（可选）

### 绑定你的域名
1. 进入项目 → **Settings** → **Domains**
2. 添加你的域名（如：`words.yourdomain.com`）
3. Vercel 提供配置指南
4. 在域名服务商添加 DNS 记录

### 自动 HTTPS
Vercel 会自动为你的域名提供 SSL 证书！

---

## 💡 提示

### 部署失败？
查看 Build Logs：
1. Vercel 项目 → Deployments
2. 点击失败的部署记录
3. 查看错误信息
4. 修复后推送代码，自动重新部署

### 想回滚版本？
1. 进入 Deployments
2. 找到之前的成功部署
3. 点击 **"..."** → **"Promote to Production"**

### 查看访问统计？
1. 进入项目 → **Analytics**
2. 查看访问量、性能等数据

---

## ✅ 部署检查清单

- [ ] 创建 GitHub 仓库
- [ ] 推送代码到 GitHub
- [ ] 注册 Vercel 账号
- [ ] 在 Vercel 导入项目
- [ ] 等待部署完成
- [ ] 访问 Live URL 测试
- [ ] 测试所有功能
- [ ] （可选）配置自定义域名

---

## 🎯 快速链接

- **Vercel 控制台**: https://vercel.com/dashboard
- **GitHub 仓库**: https://github.com/你的用户名/xiaodou-words
- **应用地址**: https://xiaodou-words.vercel.app

---

## 📞 需要帮助？

- Vercel 文档: https://vercel.com/docs
- Next.js 部署: https://vercel.com/docs/frameworks/nextjs
- GitHub 支持: https://github.com/contact

---

## 🎉 开始部署吧！

按照上面的步骤，5 分钟内就能让小豆单词上线！

有任何问题随时查看 `VERCEL_DEPLOY.md` 获取详细说明。

**准备好了吗？开始第一步吧！** 🚀
