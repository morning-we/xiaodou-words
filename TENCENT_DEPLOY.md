# 🚀 腾讯云部署指南 - 小豆单词应用

## 📋 目录
1. [购买腾讯云服务器](#购买腾讯云服务器)
2. [连接到服务器](#连接到服务器)
3. [部署应用](#部署应用)
4. [配置域名](#配置域名-可选)
5. [测试访问](#测试访问)
6. [日常维护](#日常维护)

---

## 购买腾讯云服务器

### 步骤 1：注册/登录

访问腾讯云：https://cloud.tencent.com/

### 步骤 2：购买云服务器（CVM）

1. 进入"产品" → "云服务器"
2. 点击"立即购买"或"新建实例"

### 步骤 3：选择配置

**计费模式**：
- **按量付费**：按小时计费，适合测试
- **包年包月**：长期使用更划算

**地域**：
- 选择离你近的区域（如：北京、上海、广州、成都）

**实例类型**：
- **机型**：标准型 S5 或 S6
- **配置**：1核 2GB（最便宜，够用）

**镜像**：
- **操作系统**：Ubuntu 22.04 LTS
- **系统盘**：40GB（免费）

**带宽**：
- **网络计费**：按使用流量付费
- **带宽值**：1-3 Mbps

**安全组**：
- 选择默认安全组
- 确保开放端口：22（SSH）、80（HTTP）、5000（应用）

**设置登录方式**：
- 选择"设置密码"
- 设置 root 用户密码（记住！）

**实例名称**：
- 输入：xiaodou-words

**确认订单**：
- 查看配置
- 确认价格
- 点击"立即购买"

**支付**：
- 支持微信支付、支付宝等
- 学生有优惠

### 步骤 4：等待实例创建

约 1-2 分钟后，实例创建完成。

### 步骤 5：获取连接信息

在腾讯云控制台找到：
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

### 方法 2：使用腾讯云控制台

1. 登录腾讯云控制台
2. 找到云服务器 CVM 实例
3. 点击"登录"
4. 选择"VNC登录"或"SSH密钥登录"
5. 输入密码连接

### 方法 3：使用腾讯云 Web Shell

1. 在腾讯云控制台
2. 找到 CVM 实例
3. 点击"登录"
4. 点击"WebShell登录"

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
ufw allow 5000/tcp
ufw --force enable
```

### 步骤 2：配置安全组（重要！）

**腾讯云需要手动配置安全组**：

1. 登录腾讯云控制台
2. 进入"云服务器 CVM"
3. 找到你的实例
4. 点击"安全组" → "配置规则"
5. 添加入站规则：
   - 类型：自定义
   - 协议：TCP
   - 端口：5000
   - 来源：0.0.0.0/0（所有IP）
   - 策略：允许
6. 确保已开放端口：
   - 22（SSH）
   - 80（HTTP）
   - 443（HTTPS）
   - 5000（应用）

### 步骤 3：等待部署完成

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

1. 登录域名服务商（腾讯云、阿里云、新网等）
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

**检查安全组**：
1. 登录腾讯云控制台
2. 进入"云服务器 CVM"
3. 找到你的实例
4. 点击"安全组" → "配置规则"
5. 确认端口 5000 已开放

**检查防火墙**：
```bash
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
- **学生优惠**：有 9 元/月的优惠

### 安全建议

- 定期更新系统和软件
- 使用强密码
- 定期备份数据
- 配置安全组规则

### 性能优化

- 如果访问量大，可以升级配置
- 使用 CDN 加速
- 配置 Redis 缓存

### 腾讯云特有功能

- **腾讯云 CDN**：加速访问
- **腾讯云数据库**：如果需要数据库
- **腾讯云对象存储**：存储文件

---

## 📞 需要帮助？

- 腾讯云文档：https://cloud.tencent.com/document
- PM2 文档：https://pm2.keymetrics.io/
- Node.js 文档：https://nodejs.org/
- 腾讯云工单：控制台提交工单

---

## 🆚 腾讯云 vs 阿里云

### 优势对比

| 特性 | 腾讯云 | 阿里云 |
|------|--------|--------|
| 价格 | 相近 | 相近 |
| 稳定性 | 高 | 高 |
| 学生优惠 | ✅ 有 | ✅ 有 |
| 控制台 | 简洁 | 功能丰富 |
| CDN | 腾讯 CDN | 阿里云 CDN |
| 国内访问 | 快 | 快 |

### 选择建议

- 如果你已经在用腾讯云其他服务 → 选腾讯云
- 如果你喜欢简洁的界面 → 选腾讯云
- 如果你需要更多功能 → 选阿里云
- 两个都可以，体验相似！

---

**部署完成后，你的小豆单词应用就可以在国内快速访问了！** 🎉
