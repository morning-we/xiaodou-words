'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, clearCurrentUser, getAllMenus, getWordsByMenuId } from '@/lib/storage';
import { User, WordMenu } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menus, setMenus] = useState<WordMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    const allMenus = getAllMenus();
    setMenus(allMenus);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/');
  };

  const handleStartPractice = (menuId: string, menuTitle: string) => {
    const words = getWordsByMenuId(menuId);
    
    if (words.length < 20) {
      alert(`该菜单下单词不足20个，当前只有${words.length}个单词，请联系管理员添加更多单词`);
      return;
    }
    
    router.push(`/practice?menuId=${menuId}&menuTitle=${encodeURIComponent(menuTitle)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
      {/* 顶部导航栏 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🌱</div>
              <div>
                <h1 className="text-xl font-bold text-white">小豆单词</h1>
                <p className="text-sm text-white/80">欢迎，{user?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                onClick={() => router.push('/profile')}
              >
                我的
              </Button>
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                onClick={() => router.push('/admin')}
              >
                后台管理
              </Button>
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                onClick={handleLogout}
              >
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">选择单词练习</h2>
          <p className="text-white/80">选择一个菜单开始你的单词学习之旅</p>
        </div>

        {/* 菜单卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl">{menu.icon}</div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {menu.category}
                  </div>
                </div>
                <CardTitle className="text-xl">{menu.title}</CardTitle>
                <CardDescription>{menu.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    单词数量: <span className="font-bold text-green-600">{menu.wordCount}</span>
                  </div>
                  <Button
                    onClick={() => handleStartPractice(menu.id, menu.title)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    disabled={menu.wordCount < 20}
                  >
                    开始练习
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {menus.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-white mb-2">暂无单词菜单</h3>
            <p className="text-white/80 mb-6">请联系管理员添加单词菜单</p>
            <Button
              onClick={() => router.push('/admin')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/50"
            >
              前往后台管理
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
