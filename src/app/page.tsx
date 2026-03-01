'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, initSampleData } from '@/lib/storage';
import { Button } from '@/components/ui/button';

export default function SplashScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(true);

  useEffect(() => {
    // 初始化示例数据
    initSampleData();

    // 检查是否首次访问
    const hasVisited = localStorage.getItem('xiaodou_first_visit');
    
    // 检查是否已登录
    const user = getCurrentUser();
    const targetRoute = user ? '/home' : '/login';

    // 如果不是首次访问，直接跳转
    if (hasVisited) {
      router.push(targetRoute);
      return;
    }

    // 标记为已访问
    localStorage.setItem('xiaodou_first_visit', 'true');

    // 倒计时逻辑
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(targetRoute);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSkip = () => {
    const user = getCurrentUser();
    const targetRoute = user ? '/home' : '/login';
    router.push(targetRoute);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🌱</div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">小豆单词</h1>
          <p className="text-xl text-white/90 font-light">每天进步一点点</p>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-4xl font-bold text-white">{countdown}</span>
          </div>
          <p className="text-white/80 mt-4">即将进入...</p>
        </div>

        <Button
          onClick={handleSkip}
          className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
        >
          跳过
        </Button>
      </div>

      {/* 底部版权 */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-white/60 text-sm">© 2024 小豆单词 - 陪你一起成长</p>
      </div>
    </div>
  );
}
