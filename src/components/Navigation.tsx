import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, LogIn, LogOut, BookOpen, Users, UserPlus, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useIsMobile from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mainNavItems = [
    { name: 'Editor', url: '/editor', icon: BookOpen },
    { name: 'For Authors', url: '/for-authors', icon: BookOpen },
    { name: 'Publishing Support', url: '/publishing-support', icon: BookOpen },
    { name: 'Professional Network', url: '/professional-network', icon: Users }
  ];
  
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Authorify
            </Link>
            
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      location.pathname === item.url
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <>
                <Button 
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-medium hover:shadow-large transition-all duration-200"
                >
                  <Link to="/professional-network/projects" className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>For Freelancers</span>
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border hover:bg-secondary transition-all duration-200"
                >
                  <Link to="/professional-network/apply" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Become a Freelancer</span>
                  </Link>
                </Button>
              </>
            )}
            
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout} 
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {!isMobile && "Logout"}
              </Button>
            ) : (
              <Button 
                asChild
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-medium hover:shadow-large transition-all duration-200 animate-glow"
              >
                <Link to="/auth" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}

            {isMobile && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-muted">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.url}
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-md text-foreground hover:bg-muted transition-all duration-200"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                    
                    <div className="border-t border-border pt-4 space-y-2">
                      <Button 
                        asChild
                        onClick={() => setIsSheetOpen(false)}
                        className="w-full justify-start"
                      >
                        <Link to="/professional-network/projects">
                          <Briefcase className="mr-3 h-4 w-4" />
                          For Freelancers
                        </Link>
                      </Button>
                      
                      <Button 
                        asChild
                        variant="outline"
                        onClick={() => setIsSheetOpen(false)}
                        className="w-full justify-start"
                      >
                        <Link to="/professional-network/apply">
                          <UserPlus className="h-4 w-4 mr-3" />
                          Become a Freelancer
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;