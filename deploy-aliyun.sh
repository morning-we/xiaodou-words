#!/bin/bash

# 阿里云部署脚本 - 小豆单词应用
# 在阿里云服务器上运行此脚本

set -e

echo "🚀 开始部署小豆单词应用到阿里云..."

# 更新系统
echo "📦 更新系统..."
apt-get update && apt-get upgrade -y

# 安装 Node.js 20
echo "📦 安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 pnpm
echo "📦 安装 pnpm..."
npm install -g pnpm

# 安装 Git
echo "📦 安装 Git..."
apt-get install -y git

# 安装 PM2（进程管理）
echo "📦 安装 PM2..."
npm install -g pm2

# 创建项目目录
echo "📦 创建项目目录..."
mkdir -p /var/www/xiaodou-words
cd /var/www/xiaodou-words

# 克隆代码
echo "📦 克隆代码..."
git clone https://github.com/morning-we/xiaodou-words.git .

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "📦 构建项目..."
pnpm run build

# 启动服务（使用 PM2）
echo "📦 启动服务..."
pm2 start npm --name "xiaodou-words" -- start

# 设置 PM2 开机自启
echo "📦 设置开机自启..."
pm2 save
pm2 startup

# 配置防火墙
echo "📦 配置防火墙..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
echo "   http://$(curl -s ifconfig.me)"
echo ""
echo "📊 查看日志："
echo "   pm2 logs xiaodou-words"
echo ""
echo "🔧 管理命令："
echo "   pm2 status          # 查看状态"
echo "   pm2 restart         # 重启服务"
echo "   pm2 stop            # 停止服务"
echo "   pm2 logs            # 查看日志"
echo ""
