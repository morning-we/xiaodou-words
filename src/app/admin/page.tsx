'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, getAllMenus, getAllUsers, getAllWords, getAllRecords, addMenu, deleteMenu, updateMenu, addWordsBulk, clearWordsByMenuId } from '@/lib/storage';
import { formatDateTime } from '@/lib/utils';
import { User, WordMenu, Word, PracticeRecord } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menus, setMenus] = useState<WordMenu[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<PracticeRecord[]>([]);

  // 菜单管理状态
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<WordMenu | null>(null);
  const [menuForm, setMenuForm] = useState({
    title: '',
    description: '',
    icon: '📚',
    category: '英语'
  });

  // 单词上传状态
  const [isWordDialogOpen, setIsWordDialogOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [wordFileContent, setWordFileContent] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    loadData();
  }, [router]);

  const loadData = () => {
    setMenus(getAllMenus());
    setWords(getAllWords());
    setUsers(getAllUsers().sort((a, b) => b.points - a.points));
    setRecords(getAllRecords().slice(0, 50));
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  // 菜单管理函数
  const handleAddMenu = () => {
    setEditingMenu(null);
    setMenuForm({ title: '', description: '', icon: '📚', category: '英语' });
    setIsMenuDialogOpen(true);
  };

  const handleEditMenu = (menu: WordMenu) => {
    setEditingMenu(menu);
    setMenuForm({
      title: menu.title,
      description: menu.description,
      icon: menu.icon,
      category: menu.category
    });
    setIsMenuDialogOpen(true);
  };

  const handleSaveMenu = () => {
    if (!menuForm.title.trim()) {
      alert('请输入菜单标题');
      return;
    }

    if (editingMenu) {
      updateMenu(editingMenu.id, menuForm);
    } else {
      addMenu(menuForm);
    }

    setIsMenuDialogOpen(false);
    loadData();
  };

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('确定要删除这个菜单及其所有单词吗？')) {
      deleteMenu(menuId);
      clearWordsByMenuId(menuId);
      loadData();
    }
  };

  // 单词上传函数
  const handleOpenWordDialog = (menuId: string) => {
    setSelectedMenuId(menuId);
    setWordFileContent('');
    setIsWordDialogOpen(true);
  };

  const handleUploadWords = () => {
    if (!wordFileContent.trim()) {
      alert('请输入单词内容');
      return;
    }

    try {
      const lines = wordFileContent.trim().split('\n');
      const newWords: Omit<Word, 'id'>[] = [];
      
      lines.forEach((line, index) => {
        const parts = line.split('\t').map(p => p.trim());
        if (parts.length >= 4) {
          const [word, phonetic, meaning, correctAnswer, ...options] = parts;
          newWords.push({
            menuId: selectedMenuId,
            word,
            phonetic,
            meaning,
            options: options.length >= 2 ? options.slice(0, 2).concat([correctAnswer]) : [meaning, '选项B', '选项C'],
            correctOption: 2, // 默认第三个选项为正确答案
            difficulty: 'easy'
          });
        }
      });

      if (newWords.length === 0) {
        alert('请按正确格式输入单词内容');
        return;
      }

      if (confirm(`即将添加 ${newWords.length} 个单词，确定吗？`)) {
        addWordsBulk(newWords);
        setIsWordDialogOpen(false);
        loadData();
        alert(`成功添加 ${newWords.length} 个单词！`);
      }
    } catch (error) {
      alert('解析单词内容失败，请检查格式');
    }
  };

  const handleClearWords = (menuId: string) => {
    if (confirm('确定要清空该菜单下的所有单词吗？')) {
      clearWordsByMenuId(menuId);
      loadData();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
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
              onClick={handleBackToHome}
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
        <Tabs defaultValue="menus" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="menus" className="data-[state=active]:bg-green-600">菜单管理</TabsTrigger>
            <TabsTrigger value="words" className="data-[state=active]:bg-green-600">单词上传</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-600">用户管理</TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-green-600">操作记录</TabsTrigger>
          </TabsList>

          {/* 菜单管理 */}
          <TabsContent value="menus">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>菜单管理</CardTitle>
                    <CardDescription>管理单词练习菜单</CardDescription>
                  </div>
                  <Button onClick={handleAddMenu} className="bg-green-600 hover:bg-green-700">
                    + 添加菜单
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {menus.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">暂无菜单</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>图标</TableHead>
                        <TableHead>标题</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>单词数</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menus.map((menu) => (
                        <TableRow key={menu.id}>
                          <TableCell className="text-2xl">{menu.icon}</TableCell>
                          <TableCell className="font-medium">{menu.title}</TableCell>
                          <TableCell>{menu.description}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {menu.category}
                            </span>
                          </TableCell>
                          <TableCell>{menu.wordCount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditMenu(menu)}
                              >
                                编辑
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteMenu(menu.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                删除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 单词上传 */}
          <TabsContent value="words">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>单词上传</CardTitle>
                <CardDescription>选择菜单并批量上传单词</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {menus.map((menu) => (
                    <Card key={menu.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{menu.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{menu.title}</CardTitle>
                              <CardDescription>当前单词数：{menu.wordCount}</CardDescription>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleOpenWordDialog(menu.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              上传单词
                            </Button>
                            {menu.wordCount > 0 && (
                              <Button
                                variant="outline"
                                onClick={() => handleClearWords(menu.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                清空
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}

                  {menus.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      暂无菜单，请先创建菜单
                    </div>
                  )}

                  {/* 单词格式说明 */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">单词文件格式说明</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <p className="mb-3">每行一个单词，使用制表符（Tab）分隔，格式如下：</p>
                      <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`单词	音标	释义	正确答案	选项A	选项B	选项C

示例：
abandon	/əˈbændən/	放弃；抛弃	放弃	继续	开始
ability	/əˈbɪləti/	能力；本领	能力	残疾	可能性
abnormal	/æbˈnɔːml/	不正常的；反常的	正常的	不正常的	抽象的`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户管理 */}
          <TabsContent value="users">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>用户管理</CardTitle>
                <CardDescription>查看所有用户信息</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>排名</TableHead>
                      <TableHead>用户名</TableHead>
                      <TableHead>积分</TableHead>
                      <TableHead>总得分</TableHead>
                      <TableHead>正确率</TableHead>
                      <TableHead>练习次数</TableHead>
                      <TableHead>签到天数</TableHead>
                      <TableHead>注册时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u, index) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <span className={`font-bold ${index < 3 ? 'text-2xl' : ''}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{u.username}</TableCell>
                        <TableCell className="font-bold text-yellow-600">{u.points}</TableCell>
                        <TableCell>{u.totalScore}</TableCell>
                        <TableCell>{u.correctRate}%</TableCell>
                        <TableCell>{u.practiceCount}</TableCell>
                        <TableCell>{u.checkInDays}</TableCell>
                        <TableCell>{formatDate(u.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 操作记录 */}
          <TabsContent value="records">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>操作记录</CardTitle>
                <CardDescription>查看所有用户的操作记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {records.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">暂无记录</div>
                  ) : (
                    records.map((record) => (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{record.menuTitle}</span>
                          <span className="text-sm text-gray-500">{formatDateTime(record.completedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">用户：{users.find(u => u.id === record.userId)?.username || '未知'}</span>
                          <span className="text-green-600 font-medium">得分：{record.score}/20</span>
                          <span className="text-blue-600">用时：{record.duration}秒</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* 菜单编辑对话框 */}
      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMenu ? '编辑菜单' : '添加菜单'}</DialogTitle>
            <DialogDescription>
              {editingMenu ? '修改菜单信息' : '创建新的单词练习菜单'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="menu-title">菜单标题 *</Label>
              <Input
                id="menu-title"
                value={menuForm.title}
                onChange={(e) => setMenuForm({ ...menuForm, title: e.target.value })}
                placeholder="例如：四级核心词汇"
              />
            </div>
            <div>
              <Label htmlFor="menu-description">描述</Label>
              <Input
                id="menu-description"
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                placeholder="例如：大学英语四级考试必备词汇"
              />
            </div>
            <div>
              <Label htmlFor="menu-icon">图标</Label>
              <Input
                id="menu-icon"
                value={menuForm.icon}
                onChange={(e) => setMenuForm({ ...menuForm, icon: e.target.value })}
                placeholder="选择一个表情符号"
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="menu-category">分类</Label>
              <Select
                value={menuForm.category}
                onValueChange={(value) => setMenuForm({ ...menuForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="英语">英语</SelectItem>
                  <SelectItem value="日语">日语</SelectItem>
                  <SelectItem value="法语">法语</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsMenuDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveMenu} className="bg-green-600 hover:bg-green-700">
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 单词上传对话框 */}
      <Dialog open={isWordDialogOpen} onOpenChange={setIsWordDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>上传单词</DialogTitle>
            <DialogDescription>粘贴单词内容，每行一个单词，使用制表符分隔</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="word-content">单词内容 *</Label>
              <Textarea
                id="word-content"
                value={wordFileContent}
                onChange={(e) => setWordFileContent(e.target.value)}
                placeholder={`单词	音标	释义	正确答案	选项A	选项B	选项C\n\n示例：\nabandon	/əˈbændən/	放弃；抛弃	放弃	继续	开始\nability	/əˈbɪləti/	能力；本领	能力	残疾	可能性`}
                className="font-mono text-sm"
                rows={10}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsWordDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleUploadWords} className="bg-green-600 hover:bg-green-700">
                上传
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
