import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, LogIn, LogOut, BookOpen, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
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

  const mainNavItems = [
    { name: 'Editor', url: '/editor', icon: BookOpen },
    { name: 'For Authors', url: '/for-authors', icon: BookOpen },
    { name: 'Publishing Support', url: '/publishing-support', icon: BookOpen },
    { name: 'Professional Network', url: '/professional-network', icon: Users }
  ];
  
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-serif font-bold text-[#0F172A] hover:text-gray-700 transition-colors duration-200"
            >
              Authorify
            </Link>
            <div className="hidden sm:block ml-8">
              <TubelightNavbar 
                items={mainNavItems} 
                className="static transform-none mx-4 mb-0 sm:pt-0" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              asChild
              className="bg-primary hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow transition-all"
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
                className="text-primary border-primary hover:bg-primary/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
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
              <Button variant="ghost" size="icon" className="sm:hidden text-[#0F172A] hover:bg-gray-100 border border-[#0F172A]">
                <Briefcase className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-4">
                <TubelightNavbar 
                  items={mainNavItems}
                  className="static transform-none" 
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
