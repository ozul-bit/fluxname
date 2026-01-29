import { useState, useCallback } from 'react';
import { DB, Task, Transaction, Habit, Mood, Note, PomodoroSession, Settings, generateId, getToday, calculateStreak } from '@/lib/db';

export function useStore() {
  const [tasks, setTasks] = useState<Task[]>(DB.getTasks());
  const [transactions, setTransactions] = useState<Transaction[]>(DB.getTransactions());
  const [habits, setHabits] = useState<Habit[]>(DB.getHabits());
  const [moods, setMoods] = useState<Mood[]>(DB.getMoods());
  const [notes, setNotes] = useState<Note[]>(DB.getNotes());
  const [pomodoros, setPomodoros] = useState<PomodoroSession[]>(DB.getPomodoros());
  const [settings, setSettings] = useState<Settings>(DB.getSettings());

  // Tasks
  const addTask = useCallback((task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updated = [newTask, ...tasks];
    DB.set('tasks', updated);
    setTasks(updated);
    return newTask;
  }, [tasks]);

  const toggleTask = useCallback((id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    DB.set('tasks', updated);
    setTasks(updated);
  }, [tasks]);

  const deleteTask = useCallback((id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    DB.set('tasks', updated);
    setTasks(updated);
  }, [tasks]);

  // Transactions
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      date: new Date().toISOString()
    };
    const updated = [newTransaction, ...transactions];
    DB.set('transactions', updated);
    setTransactions(updated);
    return newTransaction;
  }, [transactions]);

  const clearTransactions = useCallback(() => {
    DB.set('transactions', []);
    setTransactions([]);
  }, []);

  // Habits
  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'completedDays' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      completedDays: {},
      createdAt: new Date().toISOString()
    };
    const updated = [...habits, newHabit];
    DB.set('habits', updated);
    setHabits(updated);
    return newHabit;
  }, [habits]);

  const toggleHabitDay = useCallback((habitId: string, date: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const completedDays = { ...h.completedDays };
        completedDays[date] = !completedDays[date];
        return { ...h, completedDays };
      }
      return h;
    });
    DB.set('habits', updated);
    setHabits(updated);
  }, [habits]);

  const deleteHabit = useCallback((id: string) => {
    const updated = habits.filter(h => h.id !== id);
    DB.set('habits', updated);
    setHabits(updated);
  }, [habits]);

  // Moods
  const addMood = useCallback((mood: Omit<Mood, 'id' | 'date'>) => {
    const newMood: Mood = {
      ...mood,
      id: generateId(),
      date: new Date().toISOString()
    };
    const updated = [newMood, ...moods];
    DB.set('moods', updated);
    setMoods(updated);
    return newMood;
  }, [moods]);

  // Notes
  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    const updated = [newNote, ...notes];
    DB.set('notes', updated);
    setNotes(updated);
    return newNote;
  }, [notes]);

  const updateNote = useCallback((id: string, data: Partial<Note>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n);
    DB.set('notes', updated);
    setNotes(updated);
  }, [notes]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter(n => n.id !== id);
    DB.set('notes', updated);
    setNotes(updated);
  }, [notes]);

  // Pomodoros
  const addPomodoro = useCallback((duration: number) => {
    const session: PomodoroSession = {
      id: generateId(),
      date: new Date().toISOString(),
      duration
    };
    const updated = [...pomodoros, session];
    DB.set('pomodoros', updated);
    setPomodoros(updated);
    return session;
  }, [pomodoros]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    DB.set('settings', updated);
    setSettings(updated);
  }, [settings]);

  // Data management
  const exportData = useCallback(() => {
    const data = DB.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hayat-yoneticisi-yedek-${getToday()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((data: any) => {
    DB.importData(data);
    setTasks(DB.getTasks());
    setTransactions(DB.getTransactions());
    setHabits(DB.getHabits());
    setMoods(DB.getMoods());
    setNotes(DB.getNotes());
    setPomodoros(DB.getPomodoros());
    setSettings(DB.getSettings());
  }, []);

  const clearAllData = useCallback(() => {
    DB.clearAll();
    setTasks([]);
    setTransactions([]);
    setHabits([]);
    setMoods([]);
    setNotes([]);
    setPomodoros([]);
    setSettings(DB.getSettings());
  }, []);

  // Computed values
  const todayTasks = tasks.filter(t => t.date === getToday() && !t.completed);
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  
  const now = new Date();
  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthBalance = monthIncome - monthExpense;

  const maxStreak = habits.reduce((max, h) => Math.max(max, calculateStreak(h)), 0);

  const todayPomodoros = pomodoros.filter(p => p.date.startsWith(getToday()));
  const todayPomodoroCount = todayPomodoros.length;
  const totalFocusTime = todayPomodoros.reduce((sum, p) => sum + p.duration, 0);

  return {
    // Data
    tasks,
    transactions,
    habits,
    moods,
    notes,
    pomodoros,
    settings,
    
    // Task actions
    addTask,
    toggleTask,
    deleteTask,
    
    // Transaction actions
    addTransaction,
    clearTransactions,
    
    // Habit actions
    addHabit,
    toggleHabitDay,
    deleteHabit,
    
    // Mood actions
    addMood,
    
    // Note actions
    addNote,
    updateNote,
    deleteNote,
    
    // Pomodoro actions
    addPomodoro,
    
    // Settings actions
    updateSettings,
    
    // Data management
    exportData,
    importData,
    clearAllData,
    
    // Computed
    todayTasks,
    pendingTasksCount,
    monthIncome,
    monthExpense,
    monthBalance,
    maxStreak,
    todayPomodoroCount,
    totalFocusTime,
    todayPomodoros
  };
}
