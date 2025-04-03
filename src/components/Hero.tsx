
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";

export const Hero = () => {
  const famousQuotes = [
    // Classic Literature Quotes
    {text: "It was the best of times, it was the worst of times", author: "Charles Dickens"},
    {text: "All that we see or seem is but a dream within a dream", author: "Edgar Allan Poe"},
    {text: "Two roads diverged in a wood, and I took the one less traveled by", author: "Robert Frost"},
    {text: "Not all those who wander are lost", author: "J.R.R. Tolkien"},
    {text: "To be or not to be, that is the question", author: "William Shakespeare"},
    {text: "It is a truth universally acknowledged", author: "Jane Austen"},
    {text: "Call me Ishmael", author: "Herman Melville"},
    {text: "It was a pleasure to burn", author: "Ray Bradbury"},
    {text: "The only way out of the labyrinth of suffering is to forgive", author: "John Green"},
    {text: "We accept the love we think we deserve", author: "Stephen Chbosky"},
    {text: "And so we beat on, boats against the current", author: "F. Scott Fitzgerald"},
    {text: "It does not do to dwell on dreams and forget to live", author: "J.K. Rowling"},
    {text: "Happy families are all alike; every unhappy family is unhappy in its own way", author: "Leo Tolstoy"},
    {text: "The man in black fled across the desert, and the gunslinger followed", author: "Stephen King"},
    {text: "All this happened, more or less", author: "Kurt Vonnegut"},
    {text: "Many years later, as he faced the firing squad", author: "Gabriel García Márquez"},
    {text: "It was a bright cold day in April, and the clocks were striking thirteen", author: "George Orwell"},
    
    // Inspirational Quotes
    {text: "Be the change you wish to see in the world", author: "Mahatma Gandhi"},
    {text: "I have a dream that one day this nation will rise up", author: "Martin Luther King Jr."},
    {text: "In the beginning God created the heavens and the earth", author: "The Bible"},
    {text: "The greatest glory in living lies not in never falling, but in rising every time we fall", author: "Nelson Mandela"},
    {text: "The way to get started is to quit talking and begin doing", author: "Walt Disney"},
    {text: "Life is what happens when you're busy making other plans", author: "John Lennon"},
    {text: "When you reach the end of your rope, tie a knot in it and hang on", author: "Franklin D. Roosevelt"},
    {text: "Tell me and I forget. Teach me and I remember. Involve me and I learn", author: "Benjamin Franklin"},
    {text: "In three words I can sum up everything I've learned about life: it goes on", author: "Robert Frost"},
    {text: "The future belongs to those who believe in the beauty of their dreams", author: "Eleanor Roosevelt"},
    {text: "The only impossible journey is the one you never begin", author: "Tony Robbins"},
    {text: "Don't judge each day by the harvest you reap but by the seeds that you plant", author: "Robert Louis Stevenson"},
    
    // Contemporary Fiction
    {text: "So we beat on, boats against the current, borne back ceaselessly into the past", author: "F. Scott Fitzgerald"},
    {text: "The world breaks everyone, and afterward, some are strong at the broken places", author: "Ernest Hemingway"},
    {text: "There are years that ask questions and years that answer", author: "Zora Neale Hurston"},
    {text: "Tomorrow is always fresh, with no mistakes in it yet", author: "L.M. Montgomery"},
    {text: "The pieces I am, she gather them and gave them back to me in all the right order", author: "Toni Morrison"},
    {text: "That's the thing about books. They let you travel without moving your feet", author: "Jhumpa Lahiri"},
    {text: "I am not afraid of storms, for I am learning how to sail my ship", author: "Louisa May Alcott"},
    {text: "It matters not what someone is born, but what they grow to be", author: "J.K. Rowling"},
    {text: "Time moves slowly, but passes quickly", author: "Alice Walker"},
    {text: "Whatever our souls are made of, his and mine are the same", author: "Emily Brontë"},
    {text: "Everyone is a moon, and has a dark side which they never show to anybody", author: "Mark Twain"},
    
    // Writing Wisdom
    {text: "The first draft of anything is garbage", author: "Ernest Hemingway"},
    {text: "If there's a book that you want to read, but it hasn't been written yet, then you must write it", author: "Toni Morrison"},
    {text: "You must stay drunk on writing so reality cannot destroy you", author: "Ray Bradbury"},
    {text: "Write hard and clear about what hurts", author: "Ernest Hemingway"},
    {text: "There is nothing to writing. All you do is sit down at a typewriter and bleed", author: "Ernest Hemingway"},
    {text: "The road to hell is paved with adverbs", author: "Stephen King"},
    {text: "Writing is a socially acceptable form of schizophrenia", author: "E.L. Doctorow"},
    {text: "The difference between the right word and the almost right word is the difference between lightning and a lightning bug", author: "Mark Twain"},
    {text: "If you want to be a writer, you must do two things above all others: read a lot and write a lot", author: "Stephen King"},
    {text: "A word after a word after a word is power", author: "Margaret Atwood"},
    {text: "A writer is someone for whom writing is more difficult than it is for other people", author: "Thomas Mann"},
    {text: "Write what should not be forgotten", author: "Isabel Allende"},
    {text: "I write to discover what I know", author: "Flannery O'Connor"},
    {text: "You can always edit a bad page. You can't edit a blank page", author: "Jodi Picoult"}
  ];

  return (
    <div className="bg-gradient-to-b from-secondary to-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center -mt-24">
          {/* Make the black box 20% bigger */}
          <div className="h-[28.8rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-5xl text-2xl lg:text-7xl font-bold text-center text-white relative z-20">
              Write and Publish Your Book
            </h1>
            {/* Increase the height of the sparkles container to match */}
            <div className="w-full h-72 relative">
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
