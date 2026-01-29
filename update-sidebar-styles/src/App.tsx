import { useState } from 'react';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { useStore } from '@/hooks/useStore';
import { Sidebar } from '@/components/Sidebar';
import { TaskModal } from '@/components/TaskModal';
import { HabitModal } from '@/components/HabitModal';
import { NoteModal } from '@/components/NoteModal';
import { Dashboard } from '@/pages/Dashboard';
import { Tasks } from '@/pages/Tasks';
import { Budget } from '@/pages/Budget';
import { Habits } from '@/pages/Habits';
import { MoodTracker } from '@/pages/MoodTracker';
import { Notes } from '@/pages/Notes';
import { Pomodoro } from '@/pages/Pomodoro';
import { SettingsPage } from '@/pages/SettingsPage';
import { Note } from '@/lib/db';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const { showToast } = useToast();
  const store = useStore();

  const handleOpenNoteModal = (note?: Note) => {
    setSelectedNote(note || null);
    setNoteModalOpen(true);
  };

  const handleQuickAdd = () => {
    switch (currentPage) {
      case 'tasks':
      case 'dashboard':
        setTaskModalOpen(true);
        break;
      case 'habits':
        setHabitModalOpen(true);
        break;
      case 'notes':
        handleOpenNoteModal();
        break;
      default:
        setTaskModalOpen(true);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            todayTasks={store.todayTasks}
            monthBalance={store.monthBalance}
            maxStreak={store.maxStreak}
            todayPomodoroCount={store.todayPomodoroCount}
            moods={store.moods}
            onToggleTask={store.toggleTask}
            onOpenTaskModal={() => setTaskModalOpen(true)}
          />
        );
      case 'tasks':
        return (
          <Tasks
            tasks={store.tasks}
            onToggleTask={store.toggleTask}
            onDeleteTask={(id) => {
              store.deleteTask(id);
              showToast('Görev silindi');
            }}
            onOpenTaskModal={() => setTaskModalOpen(true)}
          />
        );
      case 'budget':
        return (
          <Budget
            transactions={store.transactions}
            monthIncome={store.monthIncome}
            monthExpense={store.monthExpense}
            monthBalance={store.monthBalance}
            onAddTransaction={(t) => {
              store.addTransaction(t);
              showToast('İşlem eklendi!');
            }}
            onClearTransactions={() => {
              store.clearTransactions();
              showToast('İşlemler temizlendi');
            }}
          />
        );
      case 'habits':
        return (
          <Habits
            habits={store.habits}
            onToggleHabitDay={store.toggleHabitDay}
            onDeleteHabit={(id) => {
              store.deleteHabit(id);
              showToast('Alışkanlık silindi');
            }}
            onOpenHabitModal={() => setHabitModalOpen(true)}
          />
        );
      case 'mood':
        return (
          <MoodTracker
            moods={store.moods}
            onAddMood={store.addMood}
            showToast={showToast}
          />
        );
      case 'notes':
        return (
          <Notes
            notes={store.notes}
            onOpenNoteModal={handleOpenNoteModal}
          />
        );
      case 'pomodoro':
        return (
          <Pomodoro
            settings={store.settings}
            todayPomodoros={store.todayPomodoros}
            totalFocusTime={store.totalFocusTime}
            onAddPomodoro={store.addPomodoro}
            onUpdateSettings={store.updateSettings}
            showToast={showToast}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={store.settings}
            onUpdateSettings={store.updateSettings}
            onExportData={() => {
              store.exportData();
              showToast('Veriler indirildi!');
            }}
            onImportData={store.importData}
            onClearAllData={store.clearAllData}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userName={store.settings.name}
        pendingTasksCount={store.pendingTasksCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="lg:ml-[260px] p-5 lg:p-8 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-4 mb-5">
          <button 
            className="text-2xl p-2"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="text-xl font-bold text-indigo-500">🎯 Hayat Yöneticisi</span>
        </div>
        
        {renderPage()}
      </main>

      {/* Quick Action FAB */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-indigo-500 text-white text-2xl border-none cursor-pointer shadow-lg shadow-indigo-500/40 transition-all hover:scale-110 hover:bg-indigo-600 z-50"
        onClick={handleQuickAdd}
        title="Hızlı Ekle"
      >
        +
      </button>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={(task) => {
          store.addTask(task);
          showToast('Görev eklendi!');
        }}
      />
      
      <HabitModal
        isOpen={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        onSubmit={(habit) => {
          store.addHabit(habit);
          showToast('Alışkanlık eklendi!');
        }}
      />
      
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onSubmit={(note) => {
          store.addNote(note);
          showToast('Not eklendi!');
        }}
        onUpdate={(id, note) => {
          store.updateNote(id, note);
          showToast('Not güncellendi!');
        }}
        onDelete={(id) => {
          store.deleteNote(id);
          showToast('Not silindi');
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
