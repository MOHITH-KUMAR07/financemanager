import { useState, FormEvent } from 'react';
import { useStore, TransactionType, Transaction } from '@/store/useStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Plus, ArrowUpDown, Edit, Trash2 } from 'lucide-react';

export function Transactions() {
  const { transactions, role, deleteTransaction, addTransaction } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) return;
    
    addTransaction({
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    });
    
    setIsModalOpen(false);
    setFormData({
      description: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const filtered = transactions.filter((t: Transaction) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a: Transaction, b: Transaction) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by description or category..." 
              className="w-full pl-9 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="p-2 border rounded-md bg-background text-sm flex-1 md:w-[150px] appearance-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button 
              onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
              className="px-3 border rounded-md bg-background hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground"
              title="Sort by date"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  {role === 'admin' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'admin' ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  sorted.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{t.date}</td>
                      <td className="px-4 py-3 font-medium">{t.description}</td>
                      <td className="px-4 py-3">
                        <span className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">{t.category}</span>
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-success' : ''}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      {role === 'admin' && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1 text-muted-foreground hover:text-primary transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteTransaction(t.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card p-6 rounded-xl shadow-lg border">
            <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="e.g., Grocery Shopping" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input required type="number" min="0" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full border rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="0.00" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Date</label>
                   <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="e.g. Food" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType })} className="w-full border rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
