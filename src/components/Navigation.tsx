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
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-serif font-bold text-[#0F172A] hover:text-[#1E293B] transition-colors duration-200"
            >
              Authorify
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-6">
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-[#0F172A] hover:text-[#1E293B] hover:bg-gray-50 transition-all duration-200"
            >
              <Link to="/editor">Editor</Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-[#0F172A] hover:text-[#1E293B] hover:bg-gray-50 transition-all duration-200"
            >
              <Link to="/for-authors">For Authors</Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-[#0F172A] hover:text-[#1E293B] hover:bg-gray-50 transition-all duration-200"
            >
              <Link to="/publishing-support">Publishing Support</Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="text-base font-medium text-[#0F172A] hover:text-[#1E293B] hover:bg-gray-50 transition-all duration-200"
            >
              <Link to="/professional-network">Professional Network</Link>
            </Button>
            <Button 
              asChild
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium px-5 py-3 transition-colors duration-200"
            >
              <Link to="/professional-network/projects">
                <Briefcase className="mr-2 h-4 w-4" />
                For Freelancers
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="font-medium border-2 hover:bg-gray-50 text-[#0F172A] transition-colors duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                asChild
                className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium px-5 py-3 transition-colors duration-200"
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