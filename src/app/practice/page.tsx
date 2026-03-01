'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser, getWordsByMenuId, updateUserPractice } from '@/lib/storage';
import { shuffleOptions, speakWord, formatTime } from '@/lib/utils';
import { Word } from '@/types';

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuId = searchParams.get('menuId') || '';
  const menuTitle = decodeURIComponent(searchParams.get('menuTitle') || '');
  const isRetry = searchParams.get('retry') === 'true'; // 是否是重新练习

  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const allWords = getWordsByMenuId(menuId);
    if (allWords.length < 20) {
      alert('单词数量不足，请返回重新选择');
      router.push('/home');
      return;
    }

    // 检查是否是重新练习模式
    const storageKey = `xiaodou_practice_words_${menuId}`;
    
    if (isRetry) {
      // 重新练习：从 localStorage 读取之前保存的单词列表
      const savedWordsJson = localStorage.getItem(storageKey);
      if (savedWordsJson) {
        const savedWords = JSON.parse(savedWordsJson);
        setWords(savedWords);
        setStartTime(Date.now());
        return;
      }
    }
    
    // 首次练习：随机取20个单词并保存到 localStorage
    const shuffledWords = allWords.sort(() => Math.random() - 0.5).slice(0, 20);
    setWords(shuffledWords);
    localStorage.setItem(storageKey, JSON.stringify(shuffledWords));
    setStartTime(Date.now());
  }, [menuId, router, isRetry]);

  // 倒计时逻辑 - 总时间30秒，不会重置
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsFinished(true);
    savePracticeResult(0);
  };

  const handleOptionClick = (optionIndex: number, isCorrect: boolean) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // 立即进入下一题或结束
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      savePracticeResult(score + (isCorrect ? 1 : 0));
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const savePracticeResult = (finalScore: number) => {
    const user = getCurrentUser();
    if (!user) return;

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const correctCount = finalScore;
    
    updateUserPractice(user.id, finalScore, correctCount, menuId, menuTitle, duration);
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  const currentWord = words[currentWordIndex];

  // 使用 useMemo 确保选项只在切换单词时更新，避免每次渲染都重新计算
  // 使用 currentWord.id 作为种子，确保相同单词的选项顺序总是相同的
  // 将字符串 id 转换为数字作为种子
  const wordIdAsNumber = currentWord?.id ? currentWord.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const { shuffledOptions, newCorrectIndex } = useMemo(
    () => currentWord ? shuffleOptions(currentWord.options, currentWord.correctOption, wordIdAsNumber) : { shuffledOptions: [], newCorrectIndex: -1 },
    [currentWord, currentWord?.id, currentWord?.options, currentWord?.correctOption, wordIdAsNumber]
  );

  // 如果单词还没加载完成，显示加载中
  if (!currentWord && !isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">加载单词中...</div>
      </div>
    );
  }

  if (!currentWord || isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">练习完成！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{score}/20</div>
                <div className="text-gray-600">得分</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{Math.round((score / 20) * 100)}%</div>
                <div className="text-gray-600">正确率</div>
              </div>
            </div>
            
            <div className="text-center text-gray-600">
              <p>恭喜你完成了一次单词练习！</p>
              <p>每100分可获得1积分，继续加油！</p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleBackToHome}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
              >
                返回首页
              </Button>
              <Button
                onClick={() => router.push(`/practice?menuId=${menuId}&menuTitle=${encodeURIComponent(menuTitle)}&retry=true`)}
                variant="outline"
                className="flex-1 text-lg py-6"
              >
                再次练习
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
      {/* 顶部状态栏 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🌱</div>
              <div>
                <h1 className="text-xl font-bold text-white">{menuTitle}</h1>
                <p className="text-sm text-white/80">单词练习</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentWordIndex + 1}/{words.length}</div>
                <div className="text-xs text-white/80">题目</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-white/80">剩余时间</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{score}</div>
                <div className="text-xs text-white/80">得分</div>
              </div>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mt-4">
            <Progress value={((currentWordIndex + 1) / words.length) * 100} className="h-2" />
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="text-8xl font-bold text-green-600">{currentWord.word}</div>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-2xl text-gray-600">{currentWord.phonetic}</div>
              <Button
                onClick={() => speakWord(currentWord.word)}
                variant="outline"
                size="sm"
                className="bg-green-100 hover:bg-green-200 text-green-700 border-green-300"
              >
                🔊 播放读音
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 提示信息 */}
            <div className="text-center text-gray-600 font-medium">
              请选择正确的释义（ABC三个选项中有一个是正确的）
            </div>
            
            {/* 选项列表 - 内容稳定，只在切换单词时更新 */}
            <div className="grid gap-4">
              {shuffledOptions.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === newCorrectIndex;
                
                // 基础样式：完全无动画，内容稳定
                let buttonClass = 'w-full text-lg py-6 text-left px-8';
                
                // 未答题时：白色背景，黑色文字，完整显示
                if (!isAnswered) {
                  buttonClass += ' bg-white hover:bg-green-50 border-2 border-gray-300 hover:border-green-500 text-black';
                }
                // 已答题后：正确答案绿色，错误答案红色，其他半透明
                else {
                  if (isCorrect) {
                    buttonClass += ' bg-green-500 text-white border-green-600';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' bg-red-500 text-white border-red-600';
                  } else {
                    buttonClass += ' bg-gray-100 opacity-50 border-gray-300';
                  }
                }
                
                return (
                  <Button
                    key={`${currentWord.id}-${index}`}
                    onClick={() => handleOptionClick(index, isCorrect)}
                    className={buttonClass}
                    disabled={isAnswered}
                  >
                    <span className="font-bold mr-4 text-black">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1 text-black">{option}</span>
                    {isAnswered && isCorrect && <span className="ml-auto text-2xl">✓</span>}
                    {isAnswered && isSelected && !isCorrect && <span className="ml-auto text-2xl">✗</span>}
                  </Button>
                );
              })}
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentWordIndex === 0 || isAnswered}
                className="px-8"
              >
                ← 上一个
              </Button>
              
              <div className="text-gray-600">
                进度: {currentWordIndex + 1} / {words.length}
              </div>
              
              <Button
                onClick={handleNext}
                variant="outline"
                disabled={currentWordIndex === words.length - 1 || isAnswered}
                className="px-8"
              >
                下一个 →
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
