import { useState } from 'react';
import { Note, formatDate } from '@/lib/db';

interface NotesProps {
  notes: Note[];
  onOpenNoteModal: (note?: Note) => void;
}

export function Notes({ notes, onOpenNoteModal }: NotesProps) {
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Notlar</h1>
        <p className="text-slate-400">Düşüncelerini kaydet</p>
      </div>

      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Not ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3.5 pl-12 pr-5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="bg-slate-900 rounded-xl p-5 cursor-pointer transition-all border border-transparent hover:border-indigo-500 hover:-translate-y-0.5"
              style={{ borderLeftWidth: 4, borderLeftColor: note.color }}
              onClick={() => onOpenNoteModal(note)}
            >
              <div className="font-semibold text-base text-slate-100 mb-2.5">{note.title}</div>
              <div 
                className="text-slate-400 text-sm leading-relaxed overflow-hidden"
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {note.content}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
                <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ background: note.color }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <div className="text-6xl mb-5 opacity-50">📝</div>
          <div className="text-lg font-semibold text-slate-100 mb-2">Henüz not yok</div>
          <p>Sağ alttaki + butonuna tıklayarak not ekle</p>
        </div>
      )}
    </div>
  );
}
