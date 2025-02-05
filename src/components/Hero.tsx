import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-secondary to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-bold text-primary sm:text-5xl md:text-6xl animate-fade-in">
            Write and Publish Your Book
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in animate-fade-in-delay-1">
            Connect with the best publishing professionals and bring your book to life.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 animate-fade-in animate-fade-in-delay-2">
            <div className="rounded-md shadow">
              <Button asChild className="w-full px-8 py-3 text-lg">
                <Link to="/editor/books">Start Writing</Link>
              </Button>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Button asChild variant="outline" className="w-full px-8 py-3 text-lg">
                <Link to="/professional-network/find">Find Professionals</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};