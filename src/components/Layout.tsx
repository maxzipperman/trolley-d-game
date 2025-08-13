import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <span className="text-lg font-semibold">Trolley'd</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                localStorage.removeItem('userChoices');
                localStorage.removeItem('currentAnswers');
                window.location.href = '/play';
              }}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
};