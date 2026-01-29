import { useState } from 'react';
import { Task, formatDate } from '@/lib/db';
import { cn } from '@/utils/cn';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenTaskModal: () => void;
}

type FilterType = 'all' | 'active' | 'completed' | 'high' | 'medium' | 'low';

export function Tasks({ tasks, onToggleTask, onDeleteTask, onOpenTaskModal }: TasksProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    
    switch (filter) {
      case 'active': return !t.completed;
      case 'completed': return t.completed;
      case 'high': return t.priority === 'high';
      case 'medium': return t.priority === 'medium';
      case 'low': return t.priority === 'low';
      default: return true;
    }
  });

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Tümü' },
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Tamamlanan' },
    { value: 'high', label: '🔴 Yüksek' },
    { value: 'medium', label: '🟡 Orta' },
    { value: 'low', label: '🟢 Düşük' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Görevler</h1>
        <p className="text-slate-400">Yapılacaklar listeni yönet</p>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        {filters.map(f => (
          <button
            key={f.value}
            className={cn(
              "px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-slate-400 cursor-pointer transition-all",
              filter === f.value && "bg-indigo-500 border-indigo-500 text-white"
            )}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-5">
          <div className="relative flex-1 max-w-[300px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Görev ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3.5 pl-12 pr-5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            onClick={onOpenTaskModal}
          >
            + Yeni Görev
          </button>
        </div>

        {filteredTasks.length > 0 ? (
          <ul className="space-y-2.5">
            {filteredTasks.map(task => (
              <li 
                key={task.id} 
                className={cn(
                  "flex items-center gap-4 p-4 bg-slate-900 rounded-xl transition-all hover:bg-slate-700",
                  task.completed && "opacity-60"
                )}
              >
                <div 
                  className={cn(
                    "w-6 h-6 rounded-full border-2 border-slate-600 cursor-pointer flex items-center justify-center transition-all hover:border-indigo-500 shrink-0",
                    task.completed && "bg-emerald-500 border-emerald-500"
                  )}
                  onClick={() => onToggleTask(task.id)}
                >
                  {task.completed && '✓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("font-medium text-slate-100", task.completed && "line-through")}>
                    {task.title}
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                    <span>📅 {formatDate(task.date)}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-semibold",
                      task.priority === 'high' && 'bg-red-500 text-white',
                      task.priority === 'medium' && 'bg-amber-500 text-black',
                      task.priority === 'low' && 'bg-emerald-500 text-white'
                    )}>
                      {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                </div>
                <button 
                  className="p-2 bg-transparent border-none text-slate-400 cursor-pointer rounded-lg hover:bg-slate-800 hover:text-slate-100"
                  onClick={() => {
                    if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                      onDeleteTask(task.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <div className="text-6xl mb-5 opacity-50">📋</div>
            <div className="text-lg font-semibold text-slate-100 mb-2">Görev bulunamadı</div>
            <p>Yeni bir görev ekleyerek başla</p>
          </div>
        )}
      </div>
    </div>
  );
}
