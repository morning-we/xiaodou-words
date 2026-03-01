'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/storage';
import { User } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = getCurrentUser();
      console.log('Admin page - Current user:', currentUser);
      
      if (!currentUser) {
        console.log('Admin page - No user, redirecting to login');
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      console.error('Admin page - Error loading user:', error);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">未登录，跳转到登录页...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900">
      {/* 顶部导航栏 */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/home')}
              className="text-white hover:bg-white/10"
            >
              ← 返回首页
            </Button>
            <h1 className="text-xl font-bold text-white">后台管理系统</h1>
            <div className="text-white/80">管理员：{user.username}</div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>后台管理系统</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">欢迎来到后台管理系统，管理员：{user.username}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-32 text-left"
                  onClick={() => alert('菜单管理功能开发中')}
                >
                  <div>
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-bold">菜单管理</div>
                    <div className="text-sm text-gray-500">管理单词练习菜单</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-32 text-left"
                  onClick={() => alert('单词上传功能开发中')}
                >
                  <div>
                    <div className="text-2xl mb-2">📝</div>
                    <div className="font-bold">单词上传</div>
                    <div className="text-sm text-gray-500">批量上传单词</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-32 text-left"
                  onClick={() => alert('用户管理功能开发中')}
                >
                  <div>
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-bold">用户管理</div>
                    <div className="text-sm text-gray-500">查看和管理用户</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
