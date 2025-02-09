
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, LogIn, LogOut } from "lucide-react";
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

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
    <nav className="border-b border-gray-200 bg-[#0F172A] shadow-sm">
      <div className="container mx-auto px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-serif font-bold text-white hover:text-gray-200 transition-colors duration-200"
            >
              Authorify
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-6">
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-white hover:bg-white/10 transition-all duration-200"
            >
              <Link to="/editor">Editor</Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-white hover:bg-white/10 transition-all duration-200"
            >
              <Link to="/for-authors">For Authors</Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-white hover:bg-white/10 transition-all duration-200"
            >
              <Link to="/publishing-support">Publishing Support</Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-white hover:bg-white/10 transition-all duration-200"
            >
              <Link to="/professional-network">Professional Network</Link>
            </Button>
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="font-medium border border-white text-white hover:bg-white/10 transition-colors duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                asChild
                className="bg-white hover:bg-gray-100 text-[#0F172A] font-medium px-5 py-3 transition-colors duration-200"
              >
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden text-white hover:bg-white/10">
                <Briefcase className="h-6 w-6" />
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
