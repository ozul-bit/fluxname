import { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, PomodoroSession } from '@/lib/db';

interface PomodoroProps {
  settings: Settings;
  todayPomodoros: PomodoroSession[];
  totalFocusTime: number;
  onAddPomodoro: (duration: number) => void;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export function Pomodoro({ 
  settings, 
  todayPomodoros, 
  totalFocusTime,
  onAddPomodoro,
  onUpdateSettings,
  showToast 
}: PomodoroProps) {
  const [timerSeconds, setTimerSeconds] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  
  const intervalRef = useRef<number | null>(null);

  const playNotificationSound = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleAtQq+PqpzwCOqrl8pYIW7nu8Y4EhODi7X0XqsXF3Wk+wJaWxFRRw4GDszY=');
    audio.play().catch(() => {});
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (isWorkSession) {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      onAddPomodoro(settings.workDuration);
      
      if (settings.sound) {
        playNotificationSound();
      }
      
      showToast('Pomodoro tamamlandı! Mola zamanı 🎉');
      
      setIsWorkSession(false);
      const breakDuration = newCount % 4 === 0 ? settings.longBreak : settings.shortBreak;
      setTimerSeconds(breakDuration * 60);
    } else {
      showToast('Mola bitti! Çalışmaya devam 💪');
      setIsWorkSession(true);
      setTimerSeconds(settings.workDuration * 60);
    }
    setIsRunning(false);
  }, [isWorkSession, pomodoroCount, settings, onAddPomodoro, showToast, playNotificationSound]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimerSeconds(settings.workDuration * 60);
  };

  const saveSettings = () => {
    onUpdateSettings({
      workDuration,
      shortBreak,
      longBreak
    });
    if (!isRunning && isWorkSession) {
      setTimerSeconds(workDuration * 60);
    }
    showToast('Ayarlar kaydedildi!');
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Pomodoro Timer</h1>
        <p className="text-slate-400">Odaklanarak çalış</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-5">
        <div className="text-center py-10">
          <div className="text-7xl font-bold font-mono text-slate-100 mb-2.5">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-slate-400 mb-8">
            {isWorkSession ? 'Çalışma Zamanı' : 'Mola Zamanı'}
          </div>
          <div className="flex gap-4 justify-center">
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              onClick={toggleTimer}
            >
              {isRunning ? '⏸️ Duraklat' : '▶️ Başla'}
            </button>
            <button 
              className="text-slate-400 hover:text-slate-100 px-6 py-3 rounded-lg hover:bg-slate-700 flex items-center gap-2"
              onClick={resetTimer}
            >
              🔄 Sıfırla
            </button>
          </div>
          <div className="flex justify-center gap-10 mt-8 pt-8 border-t border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-500">{todayPomodoros.length}</div>
              <div className="text-xs text-slate-400">Pomodoro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-500">{totalFocusTime} dk</div>
              <div className="text-xs text-slate-400">Toplam Odak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-5">Ayarlar</h3>
          
          <div className="mb-5">
            <label className="block mb-2 font-medium text-slate-400">Çalışma Süresi (dakika)</label>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
              min={1}
              max={60}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-5">
            <label className="block mb-2 font-medium text-slate-400">Kısa Mola (dakika)</label>
            <input
              type="number"
              value={shortBreak}
              onChange={(e) => setShortBreak(parseInt(e.target.value) || 5)}
              min={1}
              max={30}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-5">
            <label className="block mb-2 font-medium text-slate-400">Uzun Mola (dakika)</label>
            <input
              type="number"
              value={longBreak}
              onChange={(e) => setLongBreak(parseInt(e.target.value) || 15)}
              min={1}
              max={60}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-semibold"
            onClick={saveSettings}
          >
            Kaydet
          </button>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-5">Bugünkü Oturumlar</h3>
          
          {todayPomodoros.length > 0 ? (
            <div className="space-y-2">
              {todayPomodoros.slice(0, 8).map(s => (
                <div key={s.id} className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                  <span className="text-slate-100">🍅 Pomodoro</span>
                  <span className="text-slate-400">
                    {new Date(s.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 text-slate-400">
              Henüz oturum yok
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
