import { Task, formatDate, formatMoney, getMoodEmoji, Mood } from '@/lib/db';

interface DashboardProps {
  todayTasks: Task[];
  monthBalance: number;
  maxStreak: number;
  todayPomodoroCount: number;
  moods: Mood[];
  onToggleTask: (id: string) => void;
  onOpenTaskModal: () => void;
}

export function Dashboard({
  todayTasks,
  monthBalance,
  maxStreak,
  todayPomodoroCount,
  moods,
  onToggleTask,
  onOpenTaskModal
}: DashboardProps) {
  const weekMoods = moods.slice(0, 7);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Dashboard</h1>
        <p className="text-slate-400">{formatDate(new Date())}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="✅" value={todayTasks.length.toString()} label="Bugünkü Görevler" variant="primary" />
        <StatCard icon="💰" value={formatMoney(monthBalance)} label="Bu Ay Bakiye" variant="success" />
        <StatCard icon="🔥" value={maxStreak.toString()} label="En Uzun Seri" variant="warning" />
        <StatCard icon="⏱️" value={todayPomodoroCount.toString()} label="Pomodoro (Bugün)" variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-slate-100">Bugünkü Görevler</h3>
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={onOpenTaskModal}
            >
              + Ekle
            </button>
          </div>
          
          {todayTasks.length > 0 ? (
            <ul className="space-y-2.5">
              {todayTasks.slice(0, 5).map(task => (
                <li key={task.id} className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-slate-600 cursor-pointer flex items-center justify-center hover:border-indigo-500"
                    onClick={() => onToggleTask(task.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-100">{task.title}</div>
                    <div className="text-xs text-slate-400">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        task.priority === 'high' ? 'bg-red-500 text-white' :
                        task.priority === 'medium' ? 'bg-amber-500 text-black' :
                        'bg-emerald-500 text-white'
                      }`}>
                        {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <div className="text-5xl mb-4">🎉</div>
              <p>Bugün için görev yok!</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-5">Bu Haftaki Ruh Halin</h3>
          <div className="grid grid-cols-4 lg:grid-cols-7 gap-2.5">
            {weekMoods.length > 0 ? weekMoods.map(m => (
              <div key={m.id} className="text-center p-3 bg-slate-900 rounded-xl">
                <div className="text-2xl mb-1">{getMoodEmoji(m.level)}</div>
                <div className="text-xs text-slate-400">
                  {new Date(m.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-slate-400 py-4">Kayıt yok</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, variant }: { 
  icon: string; 
  value: string; 
  label: string; 
  variant: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const borderColors = {
    primary: 'border-l-indigo-500',
    success: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    danger: 'border-l-red-500'
  };

  return (
    <div className={`bg-slate-800 rounded-2xl p-6 border border-slate-700 border-l-4 ${borderColors[variant]}`}>
      <div className="text-3xl mb-2.5">{icon}</div>
      <div className="text-3xl font-bold text-slate-100">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}
