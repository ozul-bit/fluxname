import { useState } from 'react';
import { Transaction, formatDate, formatMoney } from '@/lib/db';
import { cn } from '@/utils/cn';

interface BudgetProps {
  transactions: Transaction[];
  monthIncome: number;
  monthExpense: number;
  monthBalance: number;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onClearTransactions: () => void;
}

const categories = [
  { value: 'genel', label: 'Genel' },
  { value: 'yemek', label: 'Yemek' },
  { value: 'ulasim', label: 'Ulaşım' },
  { value: 'alisveris', label: 'Alışveriş' },
  { value: 'fatura', label: 'Fatura' },
  { value: 'eglence', label: 'Eğlence' },
  { value: 'saglik', label: 'Sağlık' },
  { value: 'egitim', label: 'Eğitim' },
  { value: 'maas', label: 'Maaş' },
  { value: 'yatirim', label: 'Yatırım' },
];

export function Budget({ 
  transactions, 
  monthIncome, 
  monthExpense, 
  monthBalance,
  onAddTransaction,
  onClearTransactions
}: BudgetProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('genel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    onAddTransaction({
      type,
      description,
      amount: parseFloat(amount),
      category
    });
    
    setDescription('');
    setAmount('');
    setCategory('genel');
  };

  // Weekly chart data
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const today = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    
    const dayExpense = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(dayStr))
      .reduce((sum, t) => sum + t.amount, 0);
    
    weekData.push({
      day: days[date.getDay()],
      amount: dayExpense
    });
  }
  
  const maxAmount = Math.max(...weekData.map(d => d.amount), 100);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-slate-100">Bütçe Takibi</h1>
        <p className="text-slate-400">Gelir ve giderlerini takip et</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <div className="text-slate-400 mb-1">Toplam Gelir</div>
          <div className="text-4xl font-bold text-emerald-500">{formatMoney(monthIncome)}</div>
        </div>
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <div className="text-slate-400 mb-1">Toplam Gider</div>
          <div className="text-4xl font-bold text-red-500">{formatMoney(monthExpense)}</div>
        </div>
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <div className="text-slate-400 mb-1">Bakiye</div>
          <div className="text-4xl font-bold text-indigo-500">{formatMoney(monthBalance)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-5">Hızlı Ekle</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2.5 mb-5 border-b border-slate-700 pb-2.5">
              <button
                type="button"
                className={cn(
                  "px-5 py-2.5 rounded-lg cursor-pointer text-slate-400 transition-all",
                  type === 'income' && "bg-indigo-500 text-white"
                )}
                onClick={() => setType('income')}
              >
                Gelir
              </button>
              <button
                type="button"
                className={cn(
                  "px-5 py-2.5 rounded-lg cursor-pointer text-slate-400 transition-all",
                  type === 'expense' && "bg-indigo-500 text-white"
                )}
                onClick={() => setType('expense')}
              >
                Gider
              </button>
            </div>
            
            <div className="mb-5">
              <label className="block mb-2 font-medium text-slate-400">Açıklama</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Maaş"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="mb-5">
              <label className="block mb-2 font-medium text-slate-400">Tutar (₺)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
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
            
            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-semibold">
              Ekle
            </button>
          </form>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-slate-100">Son İşlemler</h3>
            <button 
              className="text-slate-400 hover:text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-700"
              onClick={() => {
                if (confirm('Tüm işlemleri silmek istediğinize emin misiniz?')) {
                  onClearTransactions();
                }
              }}
            >
              Temizle
            </button>
          </div>
          
          {transactions.length > 0 ? (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
              {transactions.slice(0, 10).map(t => (
                <div key={t.id} className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                    t.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  )}>
                    {t.type === 'income' ? '📥' : '📤'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-100">{t.description}</div>
                    <div className="text-xs text-slate-400">{formatDate(t.date)}</div>
                  </div>
                  <div className={cn(
                    "font-bold text-lg",
                    t.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <div className="text-6xl mb-5 opacity-50">💳</div>
              <div className="text-lg font-semibold text-slate-100 mb-2">Henüz işlem yok</div>
              <p>Gelir veya gider ekleyerek başla</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mt-5">
        <h3 className="text-lg font-semibold text-slate-100 mb-5">Haftalık Harcama</h3>
        <div className="h-[200px] flex items-end gap-2.5 py-5">
          {weekData.map((d, i) => (
            <div 
              key={i}
              className="flex-1 bg-indigo-500 rounded-t-lg min-h-[20px] relative transition-all hover:bg-indigo-600"
              style={{ height: `${Math.max((d.amount / maxAmount) * 100, 5)}%` }}
            >
              {d.amount > 0 && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-100 whitespace-nowrap">
                  {formatMoney(d.amount)}
                </span>
              )}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
