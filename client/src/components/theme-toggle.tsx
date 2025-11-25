import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full"
      data-testid="button-theme-toggle"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-primary" data-testid="icon-sun" />
      ) : (
        <Moon className="h-5 w-5 text-primary" data-testid="icon-moon" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
