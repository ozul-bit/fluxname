// Database utility for localStorage management
export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  category: string;
  note: string;
  completed: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  goal: number;
  completedDays: Record<string, boolean>;
  createdAt: string;
}

export interface Mood {
  id: string;
  level: number;
  note: string;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSession {
  id: string;
  date: string;
  duration: number;
}

export interface Settings {
  name: string;
  notifications: boolean;
  sound: boolean;
  workDuration: number;
  shortBreak: number;
  longBreak: number;
}

export interface AppData {
  tasks: Task[];
  transactions: Transaction[];
  habits: Habit[];
  moods: Mood[];
  notes: Note[];
  pomodoros: PomodoroSession[];
  settings: Settings;
}

const defaultSettings: Settings = {
  name: '',
  notifications: false,
  sound: true,
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15
};

export const DB = {
  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  init(): void {
    if (!this.get('tasks')) this.set('tasks', []);
    if (!this.get('transactions')) this.set('transactions', []);
    if (!this.get('habits')) this.set('habits', []);
    if (!this.get('moods')) this.set('moods', []);
    if (!this.get('notes')) this.set('notes', []);
    if (!this.get('pomodoros')) this.set('pomodoros', []);
    if (!this.get('settings')) this.set('settings', defaultSettings);
  },

  getTasks(): Task[] {
    return this.get<Task[]>('tasks') || [];
  },

  getTransactions(): Transaction[] {
    return this.get<Transaction[]>('transactions') || [];
  },

  getHabits(): Habit[] {
    return this.get<Habit[]>('habits') || [];
  },

  getMoods(): Mood[] {
    return this.get<Mood[]>('moods') || [];
  },

  getNotes(): Note[] {
    return this.get<Note[]>('notes') || [];
  },

  getPomodoros(): PomodoroSession[] {
    return this.get<PomodoroSession[]>('pomodoros') || [];
  },

  getSettings(): Settings {
    return this.get<Settings>('settings') || defaultSettings;
  },

  clearAll(): void {
    localStorage.clear();
    this.init();
  },

  exportData(): AppData {
    return {
      tasks: this.getTasks(),
      transactions: this.getTransactions(),
      habits: this.getHabits(),
      moods: this.getMoods(),
      notes: this.getNotes(),
      pomodoros: this.getPomodoros(),
      settings: this.getSettings()
    };
  },

  importData(data: Partial<AppData>): void {
    if (data.tasks) this.set('tasks', data.tasks);
    if (data.transactions) this.set('transactions', data.transactions);
    if (data.habits) this.set('habits', data.habits);
    if (data.moods) this.set('moods', data.moods);
    if (data.notes) this.set('notes', data.notes);
    if (data.pomodoros) this.set('pomodoros', data.pomodoros);
    if (data.settings) this.set('settings', data.settings);
  }
};

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatMoney(amount: number): string {
  return '₺' + amount.toLocaleString('tr-TR');
}

export function calculateStreak(habit: Habit): number {
  if (!habit.completedDays) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (habit.completedDays[dateStr]) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

export function getMoodEmoji(level: number): string {
  const emojis: Record<number, string> = { 5: '😄', 4: '🙂', 3: '😐', 2: '😔', 1: '😢' };
  return emojis[level] || '😐';
}

// Initialize DB on load
DB.init();
