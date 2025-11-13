import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Utensils className="h-6 w-6 text-primary" />
          <span className="text-foreground">FoodShare</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.username}
              </span>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
