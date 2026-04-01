import { useEffect, useState } from 'react';
import { Moon, Sun, Shield } from 'lucide-react';
import { useStore, Role } from '@/store/useStore';

export function Topbar() {
  const { role, setRole } = useStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center md:hidden">
        <span className="text-xl font-bold tracking-tight">FinanceDash</span>
      </div>
      <div className="hidden md:flex flex-1" />
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-muted rounded-lg p-1">
          {(['viewer', 'admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                role === r ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === 'admin' && <Shield className="w-4 h-4 mr-1" />}
              <span className="capitalize">{r}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
