import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";

export const Hero = () => {
  const famousQuotes = [
    // Classic Literature Quotes
    "It was the best of times, it was the worst of times",
    "All that we see or seem is but a dream within a dream",
    "Two roads diverged in a wood, and I took the one less traveled by",
    "Not all those who wander are lost",
    "To be or not to be, that is the question",
    "It is a truth universally acknowledged",
    "Call me Ishmael",
    "It was a pleasure to burn",
    "The only way out of the labyrinth of suffering is to forgive",
    "We accept the love we think we deserve",
    "And so we beat on, boats against the current",
    "It does not do to dwell on dreams and forget to live",
    "Happy families are all alike; every unhappy family is unhappy in its own way",
    "The man in black fled across the desert, and the gunslinger followed",
    "All this happened, more or less",
    "Many years later, as he faced the firing squad",
    "It was a bright cold day in April, and the clocks were striking thirteen",
    
    // Inspirational Quotes
    "Be the change you wish to see in the world",
    "I have a dream that one day this nation will rise up",
    "In the beginning God created the heavens and the earth",
    "The greatest glory in living lies not in never falling, but in rising every time we fall",
    "The way to get started is to quit talking and begin doing",
    "Life is what happens when you're busy making other plans",
    "When you reach the end of your rope, tie a knot in it and hang on",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn",
    "In three words I can sum up everything I've learned about life: it goes on",
    "The future belongs to those who believe in the beauty of their dreams",
    "The only impossible journey is the one you never begin",
    "Don't judge each day by the harvest you reap but by the seeds that you plant",
    
    // Contemporary Fiction
    "So we beat on, boats against the current, borne back ceaselessly into the past",
    "The world breaks everyone, and afterward, some are strong at the broken places",
    "There are years that ask questions and years that answer",
    "Tomorrow is always fresh, with no mistakes in it yet",
    "The pieces I am, she gather them and gave them back to me in all the right order",
    "That's the thing about books. They let you travel without moving your feet",
    "I am not afraid of storms, for I am learning how to sail my ship",
    "It matters not what someone is born, but what they grow to be",
    "Time moves slowly, but passes quickly",
    "Whatever our souls are made of, his and mine are the same",
    "Everyone is a moon, and has a dark side which they never show to anybody",
    
    // Writing Wisdom
    "The first draft of anything is garbage",
    "If there's a book that you want to read, but it hasn't been written yet, then you must write it",
    "You must stay drunk on writing so reality cannot destroy you",
    "Write hard and clear about what hurts",
    "There is nothing to writing. All you do is sit down at a typewriter and bleed",
    "The road to hell is paved with adverbs",
    "Writing is a socially acceptable form of schizophrenia",
    "The difference between the right word and the almost right word is the difference between lightning and a lightning bug",
    "If you want to be a writer, you must do two things above all others: read a lot and write a lot",
    "A word after a word after a word is power",
    "A writer is someone for whom writing is more difficult than it is for other people",
    "Write what should not be forgotten",
    "I write to discover what I know",
    "You can always edit a bad page. You can't edit a blank page"
  ];

  return (
    <div className="bg-gradient-to-b from-secondary to-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center -mt-24">
          <div className="h-[24rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-5xl text-2xl lg:text-7xl font-bold text-center text-white relative z-20">
              Write and Publish Your Book
            </h1>
            <div className="w-full h-60 relative">
              <SparklesCore
                background="transparent"
                characterColor="#0CFF0C"
                fontSize={30}
                speed={1.2}
                density={100}
                quotes={famousQuotes}
                className="w-full h-full"
              />
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
