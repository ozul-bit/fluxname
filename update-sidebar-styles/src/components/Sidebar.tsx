import { cn } from '@/utils/cn';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'tasks', icon: '✅', label: 'Görevler' },
  { id: 'budget', icon: '💰', label: 'Bütçe' },
  { id: 'habits', icon: '🔄', label: 'Alışkanlıklar' },
  { id: 'mood', icon: '😊', label: 'Ruh Hali' },
  { id: 'notes', icon: '📝', label: 'Notlar' },
  { id: 'pomodoro', icon: '⏱️', label: 'Pomodoro' },
  { id: 'settings', icon: '⚙️', label: 'Ayarlar' },
];

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userName: string;
  pendingTasksCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onPageChange, userName, pendingTasksCount, isOpen, onClose }: SidebarProps) {
  const hour = new Date().getHours();
  let greeting = 'Merhaba';
  if (hour < 12) greeting = 'Günaydın';
  else if (hour < 18) greeting = 'İyi günler';
  else greeting = 'İyi akşamlar';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 w-[260px] h-screen bg-slate-800 border-r border-slate-700 p-5 flex flex-col z-50 transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="text-2xl font-bold text-indigo-500 mb-2.5 flex items-center gap-2.5">
          <span>🎯</span>
          <span>Hayat Yöneticisi</span>
        </div>
        <div className="text-slate-400 text-sm mb-7 pb-5 border-b border-slate-700">
          {userName ? `${greeting}, ${userName}!` : `${greeting}!`}
        </div>
        
        <ul className="list-none flex-1 space-y-1">
          {navItems.map(item => (
            <li
              key={item.id}
              className={cn(
                "px-4 py-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all text-slate-400",
                "hover:bg-slate-700 hover:text-slate-100",
                currentPage === item.id && "bg-indigo-500 text-white hover:bg-indigo-600"
              )}
              onClick={() => {
                onPageChange(item.id);
                onClose();
              }}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'tasks' && pendingTasksCount > 0 && (
                <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-lg text-xs">
                  {pendingTasksCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
