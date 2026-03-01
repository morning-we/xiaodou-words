'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser, getAllMenus, getSubMenusByMenuId, getWordsByMenuId } from '@/lib/storage';
import { WordMenu } from '@/types';

function MenuDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuId = searchParams.get('menuId') || '';

  const [user, setUser] = useState<any>(null);
  const [menu, setMenu] = useState<WordMenu | null>(null);
  const [subMenus, setSubMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    
    const menus = getAllMenus();
    const currentMenu = menus.find(m => m.id === menuId);
    
    if (!currentMenu) {
      router.push('/home');
      return;
    }
    
    setMenu(currentMenu);
    
    // 获取子菜单
    const menuSubMenus = getSubMenusByMenuId(menuId);
    setSubMenus(menuSubMenus);
    
    setIsLoading(false);
  }, [menuId, router]);

  const handleBackToHome = () => {
    router.push('/home');
  };

  const handleStartPractice = (targetId: string, targetTitle: string) => {
    const words = getWordsByMenuId(targetId);
    
    if (words.length < 20) {
      alert(`该菜单下单词不足20个，当前只有${words.length}个单词，请联系管理员添加更多单词`);
      return;
    }
    
    router.push(`/practice?menuId=${targetId}&menuTitle=${encodeURIComponent(targetTitle)}`);
  };

  const handleStartAllPractice = () => {
    const allWords = getWordsByMenuId(menuId!);
    
    if (allWords.length < 20) {
      alert(`该菜单下单词不足20个，当前只有${allWords.length}个单词，请联系管理员添加更多单词`);
      return;
    }
    
    router.push(`/practice?menuId=${menuId}&menuTitle=${encodeURIComponent(menu?.title || '')}`);
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
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-white hover:bg-white/20"
            >
              ← 返回
            </Button>
            <div className="text-white">
              <h1 className="text-xl font-bold">{menu?.title}</h1>
              <p className="text-sm text-white/80">选择练习内容</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 全部练习卡片 */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-green-300">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{menu?.icon}</div>
              <div className="flex-1">
                <CardTitle className="text-2xl">全部练习</CardTitle>
                <CardDescription>
                  练习该菜单下的所有单词（包括子菜单）
                </CardDescription>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold">{getWordsByMenuId(menuId!).length}</div>
                <div className="text-xs text-gray-600">总单词数</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleStartAllPractice}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
              disabled={getWordsByMenuId(menuId!).length < 20}
            >
              开始全部练习
            </Button>
          </CardContent>
        </Card>

        {/* 子菜单列表 */}
        {subMenus.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">📂</span>
              子菜单分类
            </h2>
            <div className="grid gap-6">
              {subMenus.map((subMenu) => (
                <Card key={subMenu.id} className="bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl">{subMenu.icon}</div>
                      <Badge variant="secondary" className="text-sm">
                        {subMenu.wordCount} 个单词
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{subMenu.title}</CardTitle>
                    <CardDescription>{subMenu.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleStartPractice(subMenu.id, subMenu.title)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      disabled={getWordsByMenuId(subMenu.id).length < 20}
                    >
                      开始练习
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {subMenus.length === 0 && (
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">暂无子菜单</h3>
              <p className="text-gray-600 mb-6">
                该菜单下没有子菜单分类，您可以直接开始全部练习
              </p>
              <Button
                onClick={handleStartAllPractice}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                开始全部练习
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function MenuDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center">
        <div className="text-gray-600 text-xl">加载中...</div>
      </div>
    }>
      <MenuDetailContent />
    </Suspense>
  );
}
