import { useState, useRef } from 'react';
import { Settings } from '@/lib/db';
import { cn } from '@/utils/cn';

interface SettingsPageProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onExportData: () => void;
  onImportData: (data: unknown) => void;
  onClearAllData: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export function SettingsPage({ 
  settings, 
  onUpdateSettings, 
  onExportData, 
  onImportData, 
  onClearAllData,
  showToast 
}: SettingsPageProps) {
  const [name, setName] = useState(settings.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    onUpdateSettings({ name });
    showToast('İsim kaydedildi!');
  };

  const toggleNotifications = () => {
    const newValue = !settings.notifications;
    onUpdateSettings({ notifications: newValue });
    if (newValue) {
      Notification.requestPermission();
    }
  };

  const toggleSound = () => {
    onUpdateSettings({ sound: !settings.sound });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImportData(data);
        showToast('Veriler yüklendi!');
      } catch {
        showToast('Dosya okunamadı', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('TÜM VERİLER SİLİNECEK! Bu işlem geri alınamaz. Emin misiniz?')) {
      onClearAllData();
      showToast('Tüm veriler silindi');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Ayarlar</h1>
        <p className="text-slate-400">Uygulamayı özelleştir</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        {/* Profile Section */}
        <div className="mb-8">
          <h4 className="text-xs uppercase text-slate-400 mb-4 tracking-wider">Profil</h4>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-slate-400">İsmin</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="İsmini gir"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
            onClick={handleSaveName}
          >
            Kaydet
          </button>
        </div>

        {/* Notifications Section */}
        <div className="mb-8">
          <h4 className="text-xs uppercase text-slate-400 mb-4 tracking-wider">Bildirimler</h4>
          
          <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl mb-2.5">
            <div>
              <div className="font-medium text-slate-100 mb-1">Pomodoro Bildirimleri</div>
              <div className="text-sm text-slate-400">Timer bittiğinde bildirim al</div>
            </div>
            <div 
              className={cn(
                "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                settings.notifications ? "bg-indigo-500" : "bg-slate-700"
              )}
              onClick={toggleNotifications}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all",
                settings.notifications ? "left-6" : "left-0.5"
              )} />
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl">
            <div>
              <div className="font-medium text-slate-100 mb-1">Sesli Uyarı</div>
              <div className="text-sm text-slate-400">Timer bittiğinde ses çal</div>
            </div>
            <div 
              className={cn(
                "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                settings.sound ? "bg-indigo-500" : "bg-slate-700"
              )}
              onClick={toggleSound}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all",
                settings.sound ? "left-6" : "left-0.5"
              )} />
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div>
          <h4 className="text-xs uppercase text-slate-400 mb-4 tracking-wider">Veri Yönetimi</h4>
          
          <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl mb-2.5">
            <div>
              <div className="font-medium text-slate-100 mb-1">Verileri Dışa Aktar</div>
              <div className="text-sm text-slate-400">Tüm verilerini JSON olarak indir</div>
            </div>
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={onExportData}
            >
              İndir
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl mb-2.5">
            <div>
              <div className="font-medium text-slate-100 mb-1">Verileri İçe Aktar</div>
              <div className="text-sm text-slate-400">JSON dosyasından yükle</div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={() => fileInputRef.current?.click()}
            >
              Yükle
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl">
            <div>
              <div className="font-medium text-slate-100 mb-1">Tüm Verileri Sil</div>
              <div className="text-sm text-slate-400">Dikkat: Bu işlem geri alınamaz!</div>
            </div>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={handleClearAll}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
