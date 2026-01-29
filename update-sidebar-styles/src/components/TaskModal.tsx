import { useState } from 'react';
import { Modal } from './Modal';
import { Task, getToday } from '@/lib/db';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

const categories = [
  { value: 'genel', label: '📌 Genel' },
  { value: 'is', label: '💼 İş' },
  { value: 'kisisel', label: '👤 Kişisel' },
  { value: 'alisveris', label: '🛒 Alışveriş' },
  { value: 'saglik', label: '❤️ Sağlık' },
];

export function TaskModal({ isOpen, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [date, setDate] = useState(getToday());
  const [category, setCategory] = useState('genel');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title,
      priority,
      date: date || getToday(),
      category,
      note
    });
    
    // Reset form
    setTitle('');
    setPriority('medium');
    setDate(getToday());
    setCategory('genel');
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Görev">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Görev Adı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ne yapman gerekiyor?"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block mb-2 font-medium text-slate-400">Öncelik</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="low">🟢 Düşük</option>
              <option value="medium">🟡 Orta</option>
              <option value="high">🔴 Yüksek</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium text-slate-400">Tarih</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Not (Opsiyonel)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ek detaylar..."
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 min-h-[100px] resize-y focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-semibold"
        >
          Görevi Ekle
        </button>
      </form>
    </Modal>
  );
}
