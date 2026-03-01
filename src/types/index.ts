// 用户类型
export interface User {
  id: string;
  username: string;
  password: string;
  totalScore: number; // 总得分（单词练习分数）
  points: number; // 积分（从总分换算而来）
  correctRate: number; // 正确率（百分比）
  practiceCount: number; // 练习次数
  checkInDays: number; // 签到天数
  lastCheckInDate: string; // 上次签到日期
  createdAt: string;
  operationLogs: OperationLog[];
}

// 操作记录类型
export interface OperationLog {
  id: string;
  userId: string;
  action: string; // 操作类型
  details: string; // 操作详情
  timestamp: string;
}

// 单词菜单类型
export interface WordMenu {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  createdAt: string;
  wordCount: number;
}

// 单词类型
export interface Word {
  id: string;
  menuId: string;
  word: string;
  phonetic: string; // 音标
  pronunciation?: string; // 读音URL（可选）
  meaning: string;
  options: string[]; // 3个选项
  correctOption: number; // 正确选项索引（0,1,2）
  difficulty: 'easy' | 'medium' | 'hard';
}

// 练习记录类型
export interface PracticeRecord {
  id: string;
  userId: string;
  menuId: string;
  menuTitle: string;
  score: number; // 本次得分（0-20）
  correctCount: number; // 正确数量
  completedAt: string;
  duration: number; // 用时（秒）
}
