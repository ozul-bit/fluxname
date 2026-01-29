import { useState } from 'react';
import { Mood, formatDate, getMoodEmoji } from '@/lib/db';
import { cn } from '@/utils/cn';

interface MoodTrackerProps {
  moods: Mood[];
  onAddMood: (mood: Omit<Mood, 'id' | 'date'>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const moodOptions = [
  { level: 5, emoji: '😄' },
  { level: 4, emoji: '🙂' },
  { level: 3, emoji: '😐' },
  { level: 2, emoji: '😔' },
  { level: 1, emoji: '😢' },
];

export function MoodTracker({ moods, onAddMood, showToast }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const handleSaveMood = () => {
    if (!selectedMood) {
      showToast('Lütfen bir ruh hali seçin', 'warning');
      return;
    }
    
    onAddMood({
      level: selectedMood,
      note
    });
    
    setSelectedMood(null);
    setNote('');
    showToast('Ruh halin kaydedildi!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Ruh Hali Takibi</h1>
        <p className="text-slate-400">Bugün nasıl hissediyorsun?</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-5">
        <h3 className="text-lg font-semibold text-slate-100 mb-5">Şu anki ruh halin</h3>
        
        <div className="flex gap-4 justify-center my-8">
          {moodOptions.map(opt => (
            <span
              key={opt.level}
              className={cn(
                "text-5xl cursor-pointer transition-all opacity-50 hover:scale-125 hover:opacity-100",
                selectedMood === opt.level && "scale-130 opacity-100"
              )}
              style={{ transform: selectedMood === opt.level ? 'scale(1.3)' : undefined }}
              onClick={() => setSelectedMood(opt.level)}
            >
              {opt.emoji}
            </span>
          ))}
        </div>
        
        <div className="max-w-lg mx-auto mb-5">
          <label className="block mb-2 font-medium text-slate-400">Not ekle (opsiyonel)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bugün neler oldu?"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 min-h-[100px] resize-y focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="text-center">
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
            onClick={handleSaveMood}
          >
            Kaydet
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-5">Geçmiş</h3>
        
        {moods.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
            {moods.slice(0, 14).map(m => (
              <div key={m.id} className="text-center p-4 bg-slate-900 rounded-xl">
                <div className="text-3xl mb-1">{getMoodEmoji(m.level)}</div>
                <div className="text-xs text-slate-400">{formatDate(m.date)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            Henüz kayıt yok
          </div>
        )}
      </div>
    </div>
  );
}
