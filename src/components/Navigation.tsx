import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Briefcase, LogIn, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useIsMobile from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
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
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                Authorify
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Button asChild variant="ghost">
              <Link to="/editor">Editor</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/for-authors">For Authors</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/publishing-support">Publishing Support</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/professional-network">Professional Network</Link>
            </Button>
            <Button asChild>
              <Link to="/professional-network/projects">
                <Briefcase className="mr-2 h-4 w-4" />
                For Freelancers
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="secondary">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-4">
                <Button asChild variant="ghost">
                  <Link to="/editor">Editor</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/for-authors">For Authors</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/publishing-support">Publishing Support</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/professional-network">Professional Network</Link>
                </Button>
                <Button asChild>
                  <Link to="/professional-network/projects">
                    <Briefcase className="mr-2 h-4 w-4" />
                    For Freelancers
                  </Link>
                </Button>
                {isAuthenticated ? (
                  <Button onClick={handleLogout} variant="secondary">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;