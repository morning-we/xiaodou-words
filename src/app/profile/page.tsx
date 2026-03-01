'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUser, getAllUsers, getUserRecords, checkInUser, clearCurrentUser } from '@/lib/storage';
import { formatDate, formatDateTime } from '@/lib/utils';
import { User, PracticeRecord } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userRank, setUserRank] = useState<number>(0);
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [checkInMessage, setCheckInMessage] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    
    // 获取用户排名
    const allUsers = getAllUsers().sort((a, b) => b.points - a.points);
    const rank = allUsers.findIndex(u => u.id === currentUser.id) + 1;
    setUserRank(rank);
    
    // 获取练习记录
    const userRecords = getUserRecords(currentUser.id);
    setRecords(userRecords.slice(0, 10)); // 只显示最近10条
    
    // 检查是否可以签到
    const today = new Date().toISOString().split('T')[0];
    setCanCheckIn(currentUser.lastCheckInDate !== today);
  }, [router]);

  const handleCheckIn = () => {
    if (!user) return;
    
    const result = checkInUser(user.id);
    
    if (result.success) {
      setCheckInMessage('✓ 签到成功！获得1积分');
      setCanCheckIn(false);
      
      // 重新获取用户信息
      setTimeout(() => {
        const updatedUser = getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
          const allUsers = getAllUsers().sort((a, b) => b.points - a.points);
          const rank = allUsers.findIndex(u => u.id === updatedUser.id) + 1;
          setUserRank(rank);
        }
      }, 500);
    } else {
      setCheckInMessage(result.message);
    }
    
    setTimeout(() => setCheckInMessage(''), 3000);
  };

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/');
  };

  const handleContactService = () => {
    // 模拟添加客服
    alert('客服功能：请添加客服微信：xiaodou_service\n\n或扫描二维码添加客服');
  };

  if (!user) {
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
              onClick={() => router.push('/home')}
              className="text-white hover:bg-white/20"
            >
              ← 返回
            </Button>
            <h1 className="text-xl font-bold text-white">个人中心</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 用户信息卡片 */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription>学习天数：{user.checkInDays} 天</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{user.points}</div>
                <div className="text-sm text-gray-600">总积分</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{user.totalScore}</div>
                <div className="text-sm text-gray-600">总得分</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{user.correctRate}%</div>
                <div className="text-sm text-gray-600">正确率</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">#{userRank}</div>
                <div className="text-sm text-gray-600">积分排名</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 签到和客服 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <span className="mr-2">📅</span>
                每日签到
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">连续签到</span>
                  <Badge variant="secondary" className="text-lg">{user.checkInDays} 天</Badge>
                </div>
                <Button
                  onClick={handleCheckIn}
                  disabled={!canCheckIn}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {canCheckIn ? '✓ 立即签到 (+1积分)' : '✓ 今日已签到'}
                </Button>
                {checkInMessage && (
                  <div className="text-sm text-center text-green-600 font-medium">
                    {checkInMessage}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <span className="mr-2">💬</span>
                客服服务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  遇到问题？联系我们的客服获取帮助
                </p>
                <Button
                  onClick={handleContactService}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                >
                  📞 联系客服
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 练习记录 */}
        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <span className="mr-2">📊</span>
              最近练习记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无练习记录，快去开始第一次练习吧！
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>菜单</TableHead>
                    <TableHead>得分</TableHead>
                    <TableHead>用时</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.completedAt)}</TableCell>
                      <TableCell>{record.menuTitle}</TableCell>
                      <TableCell>
                        <Badge variant={record.score >= 15 ? 'default' : record.score >= 10 ? 'secondary' : 'outline'}>
                          {record.score}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{record.duration}秒</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 操作日志 */}
        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <span className="mr-2">📝</span>
              最近操作记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.operationLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无操作记录
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {user.operationLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <Badge variant="outline">{log.action}</Badge>
                    <div className="flex-1">
                      <div className="text-gray-800">{log.details}</div>
                      <div className="text-gray-500 text-xs mt-1">{formatDateTime(log.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 积分规则说明 */}
        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <span className="mr-2">💡</span>
              积分获取规则
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📅</span>
                <span>每日签到可获得 <strong>1 积分</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📚</span>
                <span>单词练习总分每达到 <strong>100 分</strong> 可获得 <strong>1 积分</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span>积分越高，排名越靠前</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 退出登录按钮 */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/50 py-6"
        >
          退出登录
        </Button>
      </main>
    </div>
  );
}
