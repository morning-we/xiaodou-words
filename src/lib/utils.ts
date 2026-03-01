import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 简单的伪随机数生成器（使用固定种子）
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 随机排列数组（使用种子确保相同输入产生相同输出）
export function shuffleArray<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array];
  const randomSeed = seed || Date.now();
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(randomSeed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 随机排列选项并返回正确的选项索引（使用种子确保稳定性）
export function shuffleOptions(options: string[], correctOption: number, seed?: number, avoidPosition?: number): {
  shuffledOptions: string[];
  newCorrectIndex: number;
} {
  const optionsWithIndex = options.map((opt, idx) => ({
    option: opt,
    originalIndex: idx
  }));
  
  const shuffled = shuffleArray(optionsWithIndex, seed);
  
  let newCorrectIndex = shuffled.findIndex(item => item.originalIndex === correctOption);
  
  // 如果指定了要避免的位置，并且正确答案在该位置，则交换位置
  if (avoidPosition !== undefined && newCorrectIndex === avoidPosition) {
    // 找一个不同的位置进行交换
    const swapPositions = [0, 1, 2].filter(pos => pos !== avoidPosition);
    const swapPosition = swapPositions[0]; // 选择第一个可用的位置
    
    // 交换两个位置
    [shuffled[newCorrectIndex], shuffled[swapPosition]] = [shuffled[swapPosition], shuffled[newCorrectIndex]];
    
    // 更新正确答案索引
    newCorrectIndex = swapPosition;
  }
  
  const shuffledOptions = shuffled.map(item => item.option);
  
  return { shuffledOptions, newCorrectIndex };
}

// 播放语音
export function speakWord(word: string): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
}

// 格式化时间
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 格式化日期时间
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
