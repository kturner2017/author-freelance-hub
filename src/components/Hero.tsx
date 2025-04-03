
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-secondary to-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center -mt-24">
          <div className="h-[20rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-5xl text-2xl lg:text-7xl font-bold text-center text-white relative z-20">
              Write and Publish Your Book
            </h1>
            <div className="w-full h-40 relative">
              {/* Matrix digital rain effect */}
              <SparklesCore
                background="transparent"
                characterColor="#0CFF0C"
                fontSize={16}
                speed={1.5}
                density={120}
                className="w-full h-full"
              />

              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </div>
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
