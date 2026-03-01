# 🚀 小豆单词 - Vercel 部署指南

## ⏱️ 预计时间：5 分钟

## 📋 前置要求
- ✅ Git 仓库已准备
- ✅ Vercel 账号（免费）
- ✅ GitHub、GitLab 或 Bitbucket 账号

---

## 步骤 1：注册 Vercel（2 分钟）

### 1.1 访问 Vercel
打开浏览器访问：https://vercel.com

### 1.2 创建账号
点击 "Sign Up"，可以选择以下方式注册：
- GitHub（推荐）
- GitLab
- Bitbucket
- Email

**推荐使用 GitHub**，这样可以实现自动部署！

### 1.3 完成注册
- 填写用户名
- 选择计划：选择 **Hobby**（免费）
- 确认邮箱

---

## 步骤 2：推送代码到 GitHub（3 分钟）

### 2.1 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 填写仓库名称：`xiaodou-words`（或你喜欢的名字）
3. 设置为 **Private**（私有）或 **Public**（公开）
4. **不要**勾选 "Add a README file"
5. 点击 "Create repository"

### 2.2 推送代码

**如果你本地还没有配置 Git 远程仓库：**

```bash
# 在项目根目录执行
cd /workspace/projects

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/xiaodou-words.git

# 推送代码
git push -u origin main
```

**如果已有远程仓库：**

```bash
# 直接推送
git push -u origin main
```

### 2.3 验证推送
访问你的 GitHub 仓库，确保所有文件都已上传。

---

## 步骤 3：在 Vercel 导入项目（2 分钟）

### 3.1 进入 Vercel 控制台
登录后，访问：https://vercel.com/dashboard

### 3.2 添加新项目
1. 点击 **"Add New..."** 按钮
2. 选择 **"Project"**

### 3.3 导入 Git 仓库
1. 找到你的 `xiaodou-words` 仓库
2. 点击 **"Import"** 按钮

### 3.4 配置项目
Vercel 会自动检测到 Next.js 项目，显示配置：

**Framework Preset:** `Next.js`

**Build and Output Settings:**
- Build Command: `pnpm run build` ✅
- Output Directory: `.next` ✅
- Install Command: `pnpm install` ✅

**这些配置应该自动正确，无需修改！**

### 3.5 设置项目名称
- Project Name: `xiaodou-words`（或自定义）
- Vercel 会生成域名：`https://xiaodou-words.vercel.app`

### 3.6 部署
点击 **"Deploy"** 按钮

---

## 步骤 4：等待部署完成（2-3 分钟）

### 4.1 观察部署进度
Vercel 会显示：
- **Cloning repository** - 克隆代码
- **Installing dependencies** - 安装依赖（使用 pnpm）
- **Building project** - 构建项目
- **Deploying to Edge Network** - 部署到全球网络

### 4.2 部署成功
看到 ✅ **Done!** 表示部署成功！

Vercel 会显示：
- **Live URL**: `https://xiaodou-words.vercel.app`
- **Build logs**: 构建日志
- **Domains**: 域名设置

### 4.3 访问应用
点击 **Live URL** 链接，你的应用现在可以访问了！

---

## 步骤 5：配置自定义域名（可选）

### 5.1 进入域名设置
1. 在项目页面，点击 **"Settings"** 标签
2. 点击 **"Domains"**

### 5.2 添加域名
1. 输入你的域名（如：`words.yourdomain.com`）
2. 点击 **"Add"**

### 5.3 配置 DNS
Vercel 会提供 DNS 配置，需要在你的域名服务商处添加：
- **类型**: `CNAME`
- **主机记录**: `words`
- **记录值**: `cname.vercel-dns.com`

### 5.4 启用 HTTPS
域名配置完成后，Vercel 会自动提供 SSL 证书。

---

## 🔄 自动部署

### 推送代码自动部署
当你推送新代码到 GitHub 时：

```bash
# 修改代码
git add .
git commit -m "Add new feature"
git push
```

Vercel 会自动：
1. 检测到新的推送
2. 开始构建
3. 部署新版本
4. 更新域名指向

### Pull Request 预览
当你创建 Pull Request 时：
- Vercel 会自动部署预览版本
- 提供预览 URL 供测试
- 合并 PR 后自动部署到生产环境

---

## 📊 Vercel 免费额度

### Hobby 计划（免费）
- ✅ **无限次部署**
- ✅ **100GB 带宽/月**
- ✅ **无限项目**
- ✅ **自动 HTTPS**
- ✅ **全球 CDN**
- ✅ **Git 集成**

### 足够用于
- ✅ 个人学习项目
- ✅ 小型应用
- ✅ 试用期项目

---

## 🛠️ 常见问题

### Q1: 部署失败怎么办？
**A:** 检查 Build Logs，查看错误信息：
1. 点击失败的部署记录
2. 查看 "Build & Output Settings"
3. 检查依赖安装是否成功
4. 查看构建错误详情

### Q2: 如何查看日志？
**A:**
1. 进入项目页面
2. 点击 "Deployments" 标签
3. 选择部署记录
4. 点击 "View Logs"

### Q3: 如何回滚到之前的版本？
**A:**
1. 进入 "Deployments"
2. 找到之前的成功部署
3. 点击 "..." 菜单
4. 选择 "Promote to Production"

### Q4: 如何设置环境变量？
**A:**
1. 进入项目 → Settings
2. 点击 "Environment Variables"
3. 添加键值对
4. 重新部署生效

### Q5: 为什么访问很慢？
**A:**
- 检查 Vercel 区域设置（默认是香港区域 hkg1）
- 检查网络连接
- 查看是否使用了过多的图片资源

---

## 📱 部署后的访问地址

### Vercel 生成的地址
```
https://xiaodou-words.vercel.app
```

### 页面路由
- 首页：`/`
- 登录：`/login`
- 主页：`/home`
- 练习：`/practice?menuId=xxx&menuTitle=xxx`
- 个人中心：`/profile`
- 后台管理：`/admin`

---

## ✅ 部署检查清单

- [ ] 注册 Vercel 账号
- [ ] 推送代码到 GitHub
- [ ] 在 Vercel 导入项目
- [ ] 等待部署完成
- [ ] 访问 Live URL 测试
- [ ] 测试所有页面和功能
- [ ] （可选）配置自定义域名

---

## 🎯 快速链接

- Vercel 控制台：https://vercel.com/dashboard
- Vercel 文档：https://vercel.com/docs
- Next.js 部署指南：https://vercel.com/docs/frameworks/nextjs

---

## 🆘 需要帮助？

- Vercel Discord：https://vercel.com/discord
- GitHub Issues：https://github.com/vercel/vercel/issues
- Next.js 社区：https://nextjs.org/docs

---

## 🎉 部署完成！

恭喜你，小豆单词应用已经成功部署到 Vercel！

现在你可以：
1. 分享你的应用链接给朋友
2. 通过手机浏览器访问测试
3. 继续开发新功能，自动部署

**有问题？随时回来查看这个指南！** 🚀
