import { Habit, calculateStreak } from '@/lib/db';

interface HabitsProps {
  habits: Habit[];
  onToggleHabitDay: (habitId: string, date: string) => void;
  onDeleteHabit: (id: string) => void;
  onOpenHabitModal: () => void;
}

export function Habits({ habits, onToggleHabitDay, onDeleteHabit, onOpenHabitModal }: HabitsProps) {
  // Get last 7 days
  const days: { date: string; name: string; num: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      name: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][date.getDay()],
      num: date.getDate()
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Alışkanlık Takibi</h1>
        <p className="text-slate-400">Günlük alışkanlıklarını takip et</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-slate-100">Alışkanlıkların</h3>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
            onClick={onOpenHabitModal}
          >
            + Yeni Alışkanlık
          </button>
        </div>

        {habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map(habit => {
              const streak = calculateStreak(habit);
              return (
                <div key={habit.id} className="bg-slate-900 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-base font-semibold text-slate-100">
                      {habit.icon} {habit.title}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        🔥 {streak} gün
                      </div>
                      <button 
                        className="text-slate-400 hover:text-slate-100 px-3 py-1 rounded-lg hover:bg-slate-800"
                        onClick={() => {
                          if (confirm('Bu alışkanlığı silmek istediğinize emin misiniz?')) {
                            onDeleteHabit(habit.id);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {days.map(day => {
                      const isCompleted = habit.completedDays && habit.completedDays[day.date];
                      return (
                        <div
                          key={day.date}
                          className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isCompleted ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                          onClick={() => onToggleHabitDay(habit.id, day.date)}
                        >
                          <span className={`text-[10px] ${isCompleted ? 'text-white' : 'text-slate-400'}`}>
                            {day.name}
                          </span>
                          <span className={`text-sm font-semibold ${isCompleted ? 'text-white' : 'text-slate-100'}`}>
                            {day.num}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <div className="text-6xl mb-5 opacity-50">🎯</div>
            <div className="text-lg font-semibold text-slate-100 mb-2">Henüz alışkanlık yok</div>
            <p>Takip etmek istediğin bir alışkanlık ekle</p>
          </div>
        )}
      </div>
    </div>
  );
}
