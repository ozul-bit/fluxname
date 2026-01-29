import { useState } from 'react';
import { Modal } from './Modal';
import { Habit } from '@/lib/db';
import { cn } from '@/utils/cn';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'completedDays' | 'createdAt'>) => void;
}

const icons = ['📚', '🏃', '💧', '🧘', '💪', '🎸', '✍️', '🌱'];

export function HabitModal({ isOpen, onClose, onSubmit }: HabitModalProps) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📚');
  const [goal, setGoal] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title,
      icon,
      goal
    });
    
    // Reset form
    setTitle('');
    setIcon('📚');
    setGoal(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Alışkanlık">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Alışkanlık Adı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Kitap oku"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">İkon</label>
          <div className="flex gap-2.5 text-2xl">
            {icons.map(i => (
              <span
                key={i}
                className={cn(
                  "cursor-pointer p-2 rounded-lg border-2 border-transparent transition-all hover:scale-110",
                  icon === i && "border-white scale-110"
                )}
                onClick={() => setIcon(i)}
              >
                {i}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Hedef (günde kaç kez)</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value) || 1)}
            min={1}
            max={10}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-semibold"
        >
          Alışkanlığı Ekle
        </button>
      </form>
    </Modal>
  );
}
