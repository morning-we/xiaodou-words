import { User, WordMenu, Word, PracticeRecord, OperationLog } from '@/types';

// ===== 用户相关 =====
const USER_KEY = 'xiaodou_user';
const USERS_KEY = 'xiaodou_users';

// 获取当前登录用户
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// 保存当前用户
export function saveCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// 清除当前用户（登出）
export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

// 获取所有用户
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// 保存所有用户
export function saveAllUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 注册新用户
export function registerUser(username: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getAllUsers();
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    return { success: false, message: '用户名已存在' };
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    totalScore: 0,
    points: 0,
    correctRate: 0,
    practiceCount: 0,
    checkInDays: 0,
    lastCheckInDate: '',
    practicedMenus: [],
    createdAt: new Date().toISOString(),
    operationLogs: []
  };
  
  users.push(newUser);
  saveAllUsers(users);
  
  // 自动登录
  saveCurrentUser(newUser);
  
  return { success: true, message: '注册成功', user: newUser };
}

// 登录用户
export function loginUser(username: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getAllUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return { success: false, message: '用户名或密码错误' };
  }
  
  saveCurrentUser(user);
  
  return { success: true, message: '登录成功', user };
}

// 更新用户信息
export function updateUser(updatedUser: User): void {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  
  if (index !== -1) {
    users[index] = updatedUser;
    saveAllUsers(users);
    saveCurrentUser(updatedUser);
  }
}

// 添加操作日志
export function addOperationLog(userId: string, action: string, details: string): void {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;
  
  const log: OperationLog = {
    id: Date.now().toString(),
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  
  user.operationLogs.unshift(log);
  updateUser(user);
}

// ===== 单词菜单相关 =====
const MENUS_KEY = 'xiaodou_menus';

// 获取所有菜单
export function getAllMenus(): WordMenu[] {
  if (typeof window === 'undefined') return [];
  const menusJson = localStorage.getItem(MENUS_KEY);
  return menusJson ? JSON.parse(menusJson) : [];
}

// 保存所有菜单
export function saveAllMenus(menus: WordMenu[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
}

// 添加菜单
export function addMenu(menu: Omit<WordMenu, 'id' | 'createdAt' | 'wordCount'>): WordMenu {
  const menus = getAllMenus();
  const newMenu: WordMenu = {
    ...menu,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    wordCount: 0
  };
  
  menus.push(newMenu);
  saveAllMenus(menus);
  
  return newMenu;
}

// 删除菜单
export function deleteMenu(menuId: string): void {
  const menus = getAllMenus().filter(m => m.id !== menuId);
  saveAllMenus(menus);
}

// 更新菜单
export function updateMenu(menuId: string, updates: Partial<WordMenu>): void {
  const menus = getAllMenus();
  const index = menus.findIndex(m => m.id === menuId);
  
  if (index !== -1) {
    menus[index] = { ...menus[index], ...updates };
    saveAllMenus(menus);
  }
}

// ===== 子菜单相关 =====
const SUBMENUS_KEY = 'xiaodou_submenus';

// 获取所有子菜单
export function getAllSubMenus() {
  if (typeof window === 'undefined') return [];
  const subMenusJson = localStorage.getItem(SUBMENUS_KEY);
  return subMenusJson ? JSON.parse(subMenusJson) : [];
}

// 保存所有子菜单
export function saveAllSubMenus(subMenus: any[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUBMENUS_KEY, JSON.stringify(subMenus));
}

// 根据菜单ID获取子菜单
export function getSubMenusByMenuId(menuId: string) {
  return getAllSubMenus().filter((s: any) => s.menuId === menuId);
}

// 添加子菜单
export function addSubMenu(subMenu: any) {
  const subMenus = getAllSubMenus();
  const newSubMenu = {
    ...subMenu,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    wordCount: 0
  };
  
  subMenus.push(newSubMenu);
  saveAllSubMenus(subMenus);
  
  // 更新主菜单的 hasSubMenus 标记
  const menus = getAllMenus();
  const menuIndex = menus.findIndex(m => m.id === subMenu.menuId);
  if (menuIndex !== -1) {
    menus[menuIndex].hasSubMenus = true;
    saveAllMenus(menus);
  }
  
  return newSubMenu;
}

// 删除子菜单
export function deleteSubMenu(subMenuId: string): void {
  const subMenus = getAllSubMenus().filter((s: any) => s.id !== subMenuId);
  saveAllSubMenus(subMenus);
}

// 更新子菜单
export function updateSubMenu(subMenuId: string, updates: any): void {
  const subMenus = getAllSubMenus();
  const index = subMenus.findIndex((s: any) => s.id === subMenuId);
  
  if (index !== -1) {
    subMenus[index] = { ...subMenus[index], ...updates };
    saveAllSubMenus(subMenus);
  }
}

// ===== 单词相关 =====
const WORDS_KEY = 'xiaodou_words';

// 获取所有单词
export function getAllWords(): Word[] {
  if (typeof window === 'undefined') return [];
  const wordsJson = localStorage.getItem(WORDS_KEY);
  return wordsJson ? JSON.parse(wordsJson) : [];
}

// 保存所有单词
export function saveAllWords(words: Word[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
}

// 根据菜单ID获取单词（包括子菜单的单词）
export function getWordsByMenuId(menuId: string): Word[] {
  // 获取主菜单的单词
  const mainMenuWords = getAllWords().filter(w => w.menuId === menuId);
  
  // 获取该菜单下所有子菜单的单词
  const subMenus = getSubMenusByMenuId(menuId);
  const subMenuIds = subMenus.map((s: any) => s.id);
  const subMenuWords = getAllWords().filter(w => subMenuIds.includes(w.menuId));
  
  return [...mainMenuWords, ...subMenuWords];
}

// 添加单词
export function addWord(word: Omit<Word, 'id'>): Word {
  const words = getAllWords();
  const newWord: Word = {
    ...word,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  
  words.push(newWord);
  saveAllWords(words);
  
  // 更新菜单的单词数量
  const menuWords = getWordsByMenuId(word.menuId);
  updateMenu(word.menuId, { wordCount: menuWords.length });
  
  return newWord;
}

// 批量添加单词
export function addWordsBulk(wordsData: Omit<Word, 'id'>[]): void {
  const words = getAllWords();
  const newWords = wordsData.map(data => ({
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }));
  
  words.push(...newWords);
  saveAllWords(words);
  
  // 更新各菜单的单词数量
  const menuIds = [...new Set(newWords.map(w => w.menuId))];
  menuIds.forEach(menuId => {
    const count = getWordsByMenuId(menuId).length;
    updateMenu(menuId, { wordCount: count });
  });
}

// 删除单词
export function deleteWord(wordId: string): void {
  const words = getAllWords().filter(w => w.id !== wordId);
  saveAllWords(words);
}

// 清空菜单的所有单词
export function clearWordsByMenuId(menuId: string): void {
  const words = getAllWords().filter(w => w.menuId !== menuId);
  saveAllWords(words);
  updateMenu(menuId, { wordCount: 0 });
}

// ===== 练习记录相关 =====
const RECORDS_KEY = 'xiaodou_records';

// 获取所有练习记录
export function getAllRecords(): PracticeRecord[] {
  if (typeof window === 'undefined') return [];
  const recordsJson = localStorage.getItem(RECORDS_KEY);
  return recordsJson ? JSON.parse(recordsJson) : [];
}

// 保存所有练习记录
export function saveAllRecords(records: PracticeRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// 添加练习记录
export function addRecord(record: PracticeRecord): void {
  const records = getAllRecords();
  records.unshift(record);
  saveAllRecords(records);
}

// 获取用户的练习记录
export function getUserRecords(userId: string): PracticeRecord[] {
  return getAllRecords().filter(r => r.userId === userId);
}

// ===== 积分计算 =====
export function calculatePoints(totalScore: number): number {
  return Math.floor(totalScore / 100);
}

// 签到逻辑
export function checkInUser(userId: string): { success: boolean; message: string; newPoints?: number } {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return { success: false, message: '用户不存在' };
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  if (user.lastCheckInDate === today) {
    return { success: false, message: '今天已经签到过了' };
  }
  
  // 更新签到信息
  user.checkInDays += 1;
  user.lastCheckInDate = today;
  user.points += 1;
  
  updateUser(user);
  addOperationLog(userId, '签到', `完成第${user.checkInDays}次签到，获得1积分`);
  
  return { success: true, message: '签到成功，获得1积分', newPoints: user.points };
}

// 更新用户练习数据
export function updateUserPractice(userId: string, score: number, correctCount: number, menuId: string, menuTitle: string, duration: number): void {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;
  
  // 初始化 practicedMenus 数组（如果不存在）
  if (!user.practicedMenus) {
    user.practicedMenus = [];
  }
  
  // 检查是否是第一次练习这个词表
  const isFirstPractice = !user.practicedMenus.includes(menuId);
  
  // 更新总分和练习次数（得分始终增加）
  user.totalScore += score;
  user.practiceCount += 1;
  
  // 计算正确率（所有练习的平均正确率）
  const totalQuestions = user.practiceCount * 20;
  const userRecords = getUserRecords(userId);
  const totalCorrect = userRecords.reduce((sum, r) => sum + r.correctCount, 0) + correctCount;
  user.correctRate = Math.round((totalCorrect / totalQuestions) * 100);
  
  // 如果是第一次练习这个词表，则增加积分
  if (isFirstPractice) {
    user.practicedMenus.push(menuId);
    // 计算积分（每100分1积分 + 签到积分）
    const practicePoints = calculatePoints(user.totalScore);
    const checkInPoints = user.checkInDays;
    user.points = practicePoints + checkInPoints;
  }
  // 如果不是第一次练习，积分保持不变（只增加得分）
  
  updateUser(user);
  
  // 添加练习记录
  const logDetails = isFirstPractice 
    ? `完成${menuTitle}练习，得分${score}/20，用时${duration}秒（首次练习获得积分）`
    : `完成${menuTitle}练习，得分${score}/20，用时${duration}秒（重复练习，不获得积分）`;
  addOperationLog(userId, '单词练习', logDetails);
  
  addRecord({
    id: Date.now().toString(),
    userId,
    menuId,
    menuTitle,
    score,
    correctCount,
    completedAt: new Date().toISOString(),
    duration
  });
}

// 获取用户排名
export function getUserRank(userId: string): number {
  const users = getAllUsers().sort((a, b) => b.points - a.points);
  return users.findIndex(u => u.id === userId) + 1;
}

// 初始化示例数据
export function initSampleData(): void {
  const menus = getAllMenus();
  
  // 如果已有数据，不重复初始化
  if (menus.length > 0) return;
  
  // 创建示例菜单
  const sampleMenus: Omit<WordMenu, 'id' | 'createdAt' | 'wordCount'>[] = [
    {
      title: '四级核心词汇',
      description: '大学英语四级考试必备词汇',
      icon: '📚',
      category: '英语',
      hasSubMenus: false
    },
    {
      title: '六级高频词汇',
      description: '大学英语六级考试高频词汇',
      icon: '🎯',
      category: '英语',
      hasSubMenus: false
    },
    {
      title: '雅思基础词汇',
      description: '雅思考试基础词汇集合',
      icon: '🌍',
      category: '英语',
      hasSubMenus: false
    },
    {
      title: '托福核心词汇',
      description: '托福考试核心词汇',
      icon: '✈️',
      category: '英语',
      hasSubMenus: false
    },
    {
      title: '商务英语词汇',
      description: '职场商务必备词汇',
      icon: '💼',
      category: '英语',
      hasSubMenus: false
    }
  ];
  
  const createdMenus = sampleMenus.map(menu => addMenu(menu));
  
  // 为每个菜单添加示例单词
  const sampleWords: Omit<Word, 'id'>[] = [];
  
  // 四级词汇
  const cet4Words = [
    { word: 'abandon', phonetic: '/əˈbændən/', meaning: '放弃；抛弃', options: ['放弃；抛弃', '继续；保持', '开始；启动'], correctOption: 0 },
    { word: 'ability', phonetic: '/əˈbɪləti/', meaning: '能力；本领', options: ['能力；本领', '残疾；缺陷', '可能性；可能'], correctOption: 0 },
    { word: 'abnormal', phonetic: '/æbˈnɔːml/', meaning: '不正常的；反常的', options: ['正常的；常规的', '不正常的；反常的', '抽象的；理论的'], correctOption: 1 },
    { word: 'aboard', phonetic: '/əˈbɔːd/', meaning: '在船（车、飞机）上', options: ['在船（车、飞机）上', '在船（车、飞机）下', '在船（车、飞机）旁边'], correctOption: 0 },
    { word: 'absence', phonetic: '/ˈæbsəns/', meaning: '缺席；不在', options: ['出席；在场', '缺席；不在', '存在；生存'], correctOption: 1 }
  ];
  
  // 六级词汇
  const cet6Words = [
    { word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: '丰富的；充裕的', options: ['稀少的；不足的', '丰富的；充裕的', '充足的；足够的'], correctOption: 1 },
    { word: 'accelerate', phonetic: '/əkˈseləreɪt/', meaning: '加速；促进', options: ['减速；延缓', '加速；促进', '停止；终止'], correctOption: 1 },
    { word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: '完成；实现', options: ['放弃；抛弃', '完成；实现', '计划；安排'], correctOption: 1 },
    { word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: '承认；致谢', options: ['否认；抵赖', '承认；致谢', '忽略；忽视'], correctOption: 1 },
    { word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: '获得；取得', options: ['获得；取得', '丢失；遗失', '询问；查询'], correctOption: 0 }
  ];
  
  // 添加单词（重复到20个）
  createdMenus.forEach((menu, index) => {
    const baseWords = index === 0 ? cet4Words : cet6Words;
    for (let i = 0; i < 20; i++) {
      const baseWord = baseWords[i % baseWords.length];
      sampleWords.push({
        menuId: menu.id,
        word: baseWord.word,
        phonetic: baseWord.phonetic,
        meaning: baseWord.meaning,
        options: [...baseWord.options],
        correctOption: baseWord.correctOption,
        difficulty: 'easy'
      });
    }
  });
  
  addWordsBulk(sampleWords);
}
