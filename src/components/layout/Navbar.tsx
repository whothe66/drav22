
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Sliders, 
  Building, 
  ShieldAlert, 
  Activity,
  Menu,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Critical IT Services', path: '/critical-it-services', icon: Layers },
  { name: 'DR Parameters', path: '/dr-parameters', icon: Sliders },
  { name: 'Office Sites', path: '/office-sites', icon: Building },
  { name: 'Risk & Issue Register', path: '/risk-issue-register', icon: ShieldAlert },
  { name: 'Maturity Assessment', path: '/maturity-assessment', icon: Activity }
];

export function Navbar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-medium text-lg">IT Disaster Recovery</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {mainNavItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center justify-start h-10 px-4 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex items-center justify-start h-10 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </nav>
        
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] p-0">
              <div className="py-4 px-2">
                <div className="flex items-center mb-6 px-4">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-2">
                    <ShieldAlert className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-medium">IT Disaster Recovery</span>
                </div>
                <nav className="flex flex-col space-y-1 px-2">
                  {mainNavItems.map((item) => (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          location.pathname === item.path
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        size="sm"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
