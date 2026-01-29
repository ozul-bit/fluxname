import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Note } from '@/lib/db';
import { cn } from '@/utils/cn';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  onSubmit: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, note: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function NoteModal({ isOpen, onClose, note, onSubmit, onUpdate, onDelete }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setColor('#6366f1');
    }
  }, [note, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    if (note) {
      onUpdate(note.id, { title, content, color });
    } else {
      onSubmit({ title, content, color });
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (note && confirm('Bu notu silmek istediğinize emin misiniz?')) {
      onDelete(note.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={note ? 'Notu Düzenle' : 'Yeni Not'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Not başlığı"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">İçerik</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notunu yaz..."
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 min-h-[200px] resize-y focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-400">Renk</label>
          <div className="flex gap-2.5">
            {colors.map(c => (
              <div
                key={c}
                className={cn(
                  "w-8 h-8 rounded-full cursor-pointer border-3 border-transparent transition-all hover:scale-110",
                  color === c && "border-white scale-110"
                )}
                style={{ background: c, borderWidth: color === c ? 3 : 0 }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex gap-2.5">
          <button 
            type="submit" 
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-semibold"
          >
            Kaydet
          </button>
          {note && (
            <button 
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
              onClick={handleDelete}
            >
              Sil
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
