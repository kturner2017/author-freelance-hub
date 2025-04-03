
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";

export const Hero = () => {
  const famousQuotes = [
    "It was the best of times, it was the worst of times",
    "All that we see or seem is but a dream within a dream",
    "Two roads diverged in a wood, and I took the one less traveled by",
    "Be the change you wish to see in the world",
    "Not all those who wander are lost",
    "To be or not to be, that is the question",
    "I have a dream that one day this nation will rise up",
    "It is a truth universally acknowledged",
    "Call me Ishmael",
    "It was a pleasure to burn",
    "The only way out of the labyrinth of suffering is to forgive",
    "We accept the love we think we deserve",
    "And so we beat on, boats against the current",
    "It does not do to dwell on dreams and forget to live",
    "In the beginning God created the heavens and the earth",
    "Happy families are all alike; every unhappy family is unhappy in its own way",
    "The man in black fled across the desert, and the gunslinger followed",
    "All this happened, more or less",
    "Many years later, as he faced the firing squad",
    "It was a bright cold day in April, and the clocks were striking thirteen",
  ];

  return (
    <div className="bg-gradient-to-b from-secondary to-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center -mt-24">
          <div className="h-[20rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-5xl text-2xl lg:text-7xl font-bold text-center text-white relative z-20">
              Write and Publish Your Book
            </h1>
            <div className="w-full h-40 relative">
              {/* Literary quotes Matrix digital rain effect */}
              <SparklesCore
                background="transparent"
                characterColor="#0CFF0C"
                fontSize={30}
                speed={1.2}
                density={100}
                quotes={famousQuotes}
                className="w-full h-full"
              />

              {/* Remove the masking gradient that was covering quotes */}
              {/* <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_50px_at_top,transparent_50%,white)]"></div> */}
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
