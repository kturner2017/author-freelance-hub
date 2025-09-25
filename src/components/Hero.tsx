import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export const Hero = () => {
  const famousQuotes = [
    {text: "It was the best of times, it was the worst of times", author: "Charles Dickens"},
    {text: "All that we see or seem is but a dream within a dream", author: "Edgar Allan Poe"},
    {text: "Two roads diverged in a wood, and I took the one less traveled by", author: "Robert Frost"},
    {text: "Not all those who wander are lost", author: "J.R.R. Tolkien"},
    {text: "To be or not to be, that is the question", author: "William Shakespeare"},
    {text: "The first draft of anything is garbage", author: "Ernest Hemingway"},
    {text: "If there's a book that you want to read, but it hasn't been written yet, then you must write it", author: "Toni Morrison"},
    {text: "You must stay drunk on writing so reality cannot destroy you", author: "Ray Bradbury"},
    {text: "Write hard and clear about what hurts", author: "Ernest Hemingway"},
    {text: "If you want to be a writer, you must do two things above all others: read a lot and write a lot", author: "Stephen King"},
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent-foreground text-sm font-medium backdrop-blur-sm">
              ✨ The future of book publishing is here
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-foreground leading-tight">
              Write. Connect.{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Publish.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your manuscript into a published masterpiece with our advanced writing tools and network of expert professionals.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animate-slide-up-delay-1">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-large hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 group"
            >
              <Link to="/editor/books" className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Start Writing</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-border hover:bg-secondary shadow-medium hover:shadow-large transition-all duration-300 text-lg px-8 py-6 group backdrop-blur-sm"
            >
              <Link to="/professional-network/find" className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Find Professionals</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 animate-fade-in animate-fade-in-delay-2">
            <p className="text-sm text-muted-foreground mb-4">Trusted by authors worldwide</p>
            <div className="flex justify-center items-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm font-medium">10,000+ Books Published</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm font-medium">500+ Expert Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm font-medium">99% Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sparkles Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          background="transparent"
          characterColor="hsl(var(--accent))"
          fontSize={20}
          speed={0.8}
          density={60}
          className="w-full h-full opacity-60"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
    </section>
  );
};