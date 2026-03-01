'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { registerUser, loginUser, initSampleData } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 登录表单
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [savePassword, setSavePassword] = useState(false);
  
  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [registerSavePassword, setRegisterSavePassword] = useState(false);

  // 页面加载时检查是否有保存的密码
  useEffect(() => {
    const savedCredentials = localStorage.getItem('xiaodou_saved_credentials');
    if (savedCredentials) {
      const { username, password } = JSON.parse(savedCredentials);
      setLoginForm({ username, password });
      setSavePassword(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = loginUser(loginForm.username, loginForm.password);
      
      if (result.success) {
        // 保存或清除密码
        if (savePassword) {
          localStorage.setItem('xiaodou_saved_credentials', JSON.stringify({
            username: loginForm.username,
            password: loginForm.password
          }));
        } else {
          localStorage.removeItem('xiaodou_saved_credentials');
        }
        router.push('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // 验证密码复杂度
    const hasLetter = /[a-zA-Z]/.test(registerForm.password);
    const hasNumber = /[0-9]/.test(registerForm.password);
    const isLongEnough = registerForm.password.length >= 8;
    
    if (!isLongEnough) {
      setError('密码长度不能少于8位');
      setIsLoading(false);
      return;
    }
    
    if (!hasLetter || !hasNumber) {
      setError('密码必须包含字母和数字');
      setIsLoading(false);
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = registerUser(registerForm.username, registerForm.password);
      
      if (result.success) {
        // 如果选择保存密码
        if (registerSavePassword) {
          localStorage.setItem('xiaodou_saved_credentials', JSON.stringify({
            username: registerForm.username,
            password: registerForm.password
          }));
        }
        router.push('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="text-5xl mb-2">🌱</div>
            <CardTitle className="text-2xl font-bold">小豆单词</CardTitle>
            <CardDescription>欢迎回来，开始你的单词学习之旅</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>
              
              {/* 登录表单 */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">用户名</Label>
                    <Input
                      id="login-username"
                      placeholder="请输入用户名"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="请输入密码"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-password"
                      checked={savePassword}
                      onCheckedChange={(checked) => setSavePassword(checked as boolean)}
                    />
                    <Label htmlFor="save-password" className="text-sm cursor-pointer">
                      自动保存密码（下次自动登录）
                    </Label>
                  </div>
                  
                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '登录中...' : '登录'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* 注册表单 */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">用户名</Label>
                    <Input
                      id="register-username"
                      placeholder="请输入用户名"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="请输入密码（至少8位，包含字母和数字）"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      密码要求：至少8位，必须包含字母和数字
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">确认密码</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="请再次输入密码"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="register-save-password"
                      checked={registerSavePassword}
                      onCheckedChange={(checked) => setRegisterSavePassword(checked as boolean)}
                    />
                    <Label htmlFor="register-save-password" className="text-sm cursor-pointer">
                      自动保存密码（下次自动登录）
                    </Label>
                  </div>
                  
                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '注册中...' : '注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
