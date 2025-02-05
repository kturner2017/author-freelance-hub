import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Briefcase } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useIsMobile from "@/hooks/use-mobile";

const Navigation = () => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                Lovable
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;