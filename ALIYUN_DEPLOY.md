# 🚀 阿里云部署指南 - 小豆单词应用

## 📋 目录
1. [购买阿里云服务器](#购买阿里云服务器)
2. [连接到服务器](#连接到服务器)
3. [部署应用](#部署应用)
4. [配置域名](#配置域名-可选)
5. [测试访问](#测试访问)
6. [日常维护](#日常维护)

---

## 购买阿里云服务器

### 步骤 1：注册/登录

访问阿里云：https://www.aliyun.com/

### 步骤 2：购买 ECS 实例

1. 进入"产品" → "云服务器 ECS"
2. 点击"立即购买"或"创建实例"

### 步骤 3：选择配置

**基础配置**：
- **付费模式**：按量付费（测试）或 包年包月（长期）
- **地域**：选择离你近的（如：华东1-杭州）
- **实例规格**：1核 2GB（最便宜，够用）
- **镜像**：Ubuntu 22.04 LTS

**网络和安全组**：
- **网络类型**：专有网络（VPC）
- **带宽计费**：按使用量付费
- **带宽峰值**：1-3 Mbps

**系统配置**：
- **登录凭证**：自定义密码（记住！）
- **实例名称**：xiaodou-words

**分组设置**：
- **安全组**：选择默认安全组

**确认订单**：
- 确认配置
- 点击"确认订单"
- 支付

### 步骤 4：等待实例创建

约 1-2 分钟后，实例创建完成。

### 步骤 5：获取连接信息

在阿里云控制台找到：
- **公网 IP**：如 `123.45.67.89`
- **用户名**：`root`
- **密码**：你设置的密码

---

## 连接到服务器

### 方法 1：使用 SSH（推荐）

**Windows**：
```bash
# 打开 CMD 或 PowerShell
ssh root@123.45.67.89
# 输入密码
```

**Mac/Linux**：
```bash
# 打开终端
ssh root@123.45.67.89
# 输入密码
```

### 方法 2：使用阿里云控制台

1. 登录阿里云控制台
2. 找到 ECS 实例
3. 点击"远程连接"
4. 选择"Workbench"
5. 输入密码连接

---

## 部署应用

### 步骤 1：下载部署脚本

**方式 A：在服务器上执行（推荐）**

连接到服务器后，执行：

```bash
# 下载部署脚本
cd /root
wget https://raw.githubusercontent.com/morning-we/xiaodou-words/main/deploy-aliyun.sh

# 添加执行权限
chmod +x deploy-aliyun.sh

# 执行部署
./deploy-aliyun.sh
```

**方式 B：手动部署**

如果脚本下载失败，手动执行以下命令：

```bash
# 1. 更新系统
apt-get update && apt-get upgrade -y

# 2. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. 安装 pnpm
npm install -g pnpm

# 4. 安装 Git
apt-get install -y git

# 5. 安装 PM2
npm install -g pm2

# 6. 创建项目目录
mkdir -p /var/www/xiaodou-words
cd /var/www/xiaodou-words

# 7. 克隆代码
git clone https://github.com/morning-we/xiaodou-words.git .

# 8. 安装依赖
pnpm install

# 9. 构建项目
pnpm run build

# 10. 启动服务
pm2 start npm --name "xiaodou-words" -- start

# 11. 设置开机自启
pm2 save
pm2 startup

# 12. 配置防火墙
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

### 步骤 2：等待部署完成

部署过程约 5-10 分钟，会自动完成：
- 安装 Node.js、pnpm、Git、PM2
- 克隆代码
- 安装依赖
- 构建项目
- 启动服务
- 配置防火墙

看到以下信息表示成功：
```
✅ 部署完成！

🌐 访问地址：
   http://123.45.67.89
```

---

## 配置域名（可选）

如果你有域名，可以配置：

### 步骤 1：添加域名解析

1. 登录域名服务商（阿里云、腾讯云等）
2. 添加 A 记录：
   - 主机记录：`@` 或 `www`
   - 记录类型：`A`
   - 记录值：你的公网 IP（123.45.67.89）

### 步骤 2：配置 Nginx（如果需要）

```bash
# 安装 Nginx
apt-get install -y nginx

# 创建配置文件
nano /etc/nginx/sites-available/xiaodou-words
```

粘贴以下内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

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

保存并退出（Ctrl+X, Y, Enter）

```bash
# 启用配置
ln -s /etc/nginx/sites-available/xiaodou-words /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 测试访问

### 步骤 1：使用 IP 访问

在浏览器打开：
```
http://123.45.67.89
```

应该能看到小豆单词应用！

### 步骤 2：测试功能

- ✅ 注册/登录
- ✅ 单词练习
- ✅ 个人中心
- ✅ 后台管理

### 步骤 3：移动端测试

在手机浏览器打开：
```
http://123.45.67.89
```

---

## 日常维护

### 查看服务状态

```bash
pm2 status
```

### 查看日志

```bash
# 查看实时日志
pm2 logs xiaodou-words

# 查看最近日志
pm2 logs xiaodou-words --lines 50
```

### 重启服务

```bash
pm2 restart xiaodou-words
```

### 停止服务

```bash
pm2 stop xiaodou-words
```

### 更新代码

```bash
cd /var/www/xiaodou-words

# 拉取最新代码
git pull

# 重新构建
pnpm run build

# 重启服务
pm2 restart xiaodou-words
```

---

## 🎯 快速参考

### 服务器信息

- **操作系统**：Ubuntu 22.04 LTS
- **Node.js**：20.x
- **包管理器**：pnpm
- **进程管理**：PM2

### 重要目录

- **项目目录**：`/var/www/xiaodou-words`
- **日志目录**：`~/.pm2/logs`

### 访问地址

- **IP 访问**：`http://你的公网IP`
- **域名访问**：`http://你的域名`（如果配置了）

---

## 🔧 故障排查

### 服务无法启动

```bash
# 查看错误日志
pm2 logs xiaodou-words --err

# 检查端口占用
netstat -tlnp | grep 5000
```

### 端口无法访问

```bash
# 检查防火墙
ufw status

# 开放端口
ufw allow 5000/tcp
```

### 更新失败

```bash
# 检查 Git 配置
cd /var/www/xiaodou-words
git remote -v

# 重新配置
git remote set-url origin https://github.com/morning-we/xiaodou-words.git
```

---

## 💡 提示

### 成本控制

- **按量付费**：记得及时释放实例，避免产生费用
- **包年包月**：长期使用更划算
- **学生优惠**：有 9.9 元/月的优惠

### 安全建议

- 定期更新系统和软件
- 使用强密码
- 定期备份数据
- 配置防火墙

### 性能优化

- 如果访问量大，可以升级配置
- 使用 CDN 加速
- 配置 Redis 缓存

---

## 📞 需要帮助？

- 阿里云文档：https://help.aliyun.com/
- PM2 文档：https://pm2.keymetrics.io/
- Node.js 文档：https://nodejs.org/

---

**部署完成后，你的小豆单词应用就可以在国内快速访问了！** 🎉
