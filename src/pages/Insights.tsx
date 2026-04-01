import { useStore, Transaction } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function Insights() {
  const { transactions } = useStore();

  const getExpenses = () => transactions.filter((t: Transaction) => t.type === 'expense');

  // Highest Spending Category
  const expenseByCategory = getExpenses().reduce((acc: Record<string, number>, t: Transaction) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = (Object.entries(expenseByCategory) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const highestCategory: [string, number] | undefined = sortedCategories[0];

  // Largest Single Expense
  const largestExpense = [...getExpenses()].sort((a, b) => b.amount - a.amount)[0];

  // Month over month summary mock (simplistic grouping by YYYY-MM)
  const monthlyData = getExpenses().reduce((acc: Record<string, number>, t: Transaction) => {
    const month = t.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(monthlyData).sort().map(month => ({
    month,
    amount: monthlyData[month]
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Financial Insights</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary-foreground/80 flex items-center space-x-2">
              <TrendingDown className="w-5 h-5" />
              <span>Top Spending Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highestCategory ? (
              <>
                <div className="text-3xl font-bold">{highestCategory[0]}</div>
                <div className="text-primary-foreground/80 mt-1">${highestCategory[1].toLocaleString()} total</div>
              </>
            ) : (
              <div className="text-primary-foreground/80">Not enough data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Largest Single Expense</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {largestExpense ? (
               <>
                 <div className="text-3xl font-bold tracking-tight">${largestExpense.amount.toLocaleString()}</div>
                 <div className="text-muted-foreground mt-1 text-sm">{largestExpense.description} ({largestExpense.date})</div>
               </>
            ) : (
              <div className="text-muted-foreground">Not enough data</div>
            )}
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Key Observation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm leading-relaxed text-muted-foreground">
               Your highest spending usually occurs in <strong className="text-foreground">{highestCategory?.[0] || 'N/A'}</strong>. 
               Consider setting a strict budget for this category to maximize your overall savings.
             </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '8px' }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
