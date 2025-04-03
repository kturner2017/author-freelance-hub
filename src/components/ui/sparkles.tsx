
"use client";
import React, { useEffect, useState, useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type MatrixProps = {
  id?: string;
  className?: string;
  background?: string;
  characterColor?: string;
  fontSize?: number;
  speed?: number;
  density?: number;
  quotes?: string[];
};

export const SparklesCore = (props: MatrixProps) => {
  const {
    id,
    className,
    background = "#000000",
    characterColor = "#00ff00",
    fontSize = 14,
    speed = 1,
    density = 100,
    quotes = [
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
      "So we beat on, boats against the current",
    ],
  } = props;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const controls = useAnimation();
  const generatedId = useId();
  const [currentQuote, setCurrentQuote] = useState("");
  const [displayedQuote, setDisplayedQuote] = useState(false);
  const quoteTimerRef = useRef<number | null>(null);

  // Set up the canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const updateDimensions = () => {
      const { width, height } = container.getBoundingClientRect();
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    controls.start({
      opacity: 1,
      transition: {
        duration: 1
      }
    });
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (quoteTimerRef.current) {
        clearTimeout(quoteTimerRef.current);
      }
    };
  }, [controls]);

  // Matrix rain animation effect with quotes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Choose a random quote to display
    const selectQuote = () => {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(quote);
      return quote;
    };
    
    // Initial quote
    const activeQuote = selectQuote();
    
    // Split quotes into words and characters
    const wordChars: { char: string; x: number; y: number; speed: number; jumble: boolean; finalX: number; finalY: number; }[] = [];
    
    const initializeWordChars = () => {
      wordChars.length = 0; // Clear previous characters
      setDisplayedQuote(false);
      
      let startY = -100;
      const centerX = dimensions.width / 2;
      const bottomY = dimensions.height - 50;
      
      // Create characters for the quote
      activeQuote.split('').forEach((char, index) => {
        // Random starting position at the top
        const startX = Math.random() * dimensions.width;
        
        // Calculate final position (assembled quote at bottom)
        const totalWidth = activeQuote.length * (fontSize * 0.7);
        const startOffset = centerX - (totalWidth / 2);
        const finalX = startOffset + (index * fontSize * 0.7);
        
        wordChars.push({
          char,
          x: startX,
          y: startY - (Math.random() * 100), // Stagger the start
          speed: 0.5 + (Math.random() * speed),
          jumble: true,
          finalX,
          finalY: bottomY
        });
      });
    };
    
    // Initialize the animation
    initializeWordChars();
    
    // Function to restart animation with a new quote
    const restartAnimation = () => {
      if (quoteTimerRef.current) {
        clearTimeout(quoteTimerRef.current);
      }
      initializeWordChars();
    };
    
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 / speed})`;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      let allAssembled = true;
      
      // Loop through all characters
      wordChars.forEach(charObj => {
        // Generate a jumbled character if still falling
        const displayChar = charObj.jumble ? 
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?!.,"[Math.floor(Math.random() * 56)] : 
          charObj.char;
        
        // Set text properties - using a brighter color and bold font when assembled
        if (!charObj.jumble && Math.abs(charObj.y - charObj.finalY) < 5) {
          // Assembled characters are brighter and clearer
          ctx.fillStyle = "#FFFFFF"; // Bright white for assembled characters
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.shadowColor = characterColor;
          ctx.shadowBlur = 4;
        } else {
          // Falling characters use the specified character color
          ctx.fillStyle = characterColor;
          ctx.font = `${fontSize}px monospace`;
          ctx.shadowBlur = 0;
        }
        
        // Draw the character
        ctx.fillText(displayChar, charObj.x, charObj.y);
        ctx.shadowBlur = 0; // Reset shadow for next character
        
        // If character is not at final position, update position
        if (charObj.y < charObj.finalY || Math.abs(charObj.x - charObj.finalX) > 2) {
          allAssembled = false;
          
          // Move toward final position
          if (charObj.y < charObj.finalY) {
            charObj.y += charObj.speed;
          }
          
          // When near the bottom, start moving horizontally to final position
          if (charObj.y > dimensions.height * 0.7) {
            const distX = charObj.finalX - charObj.x;
            charObj.x += distX * 0.05; // Gradual horizontal movement
            
            // When close enough to final position, stop jumbling
            if (Math.abs(distX) < 5 && Math.abs(charObj.finalY - charObj.y) < 20) {
              charObj.jumble = false;
            }
          }
        } else {
          charObj.jumble = false; // Stop jumbling when at final position
        }
      });
      
      // If all characters have assembled and we haven't set the timer yet
      if (allAssembled && !displayedQuote) {
        setDisplayedQuote(true);
        
        // Add an overlay behind the final quote to make it more visible
        const totalWidth = activeQuote.length * (fontSize * 0.7);
        const centerX = dimensions.width / 2;
        const startOffset = centerX - (totalWidth / 2);
        const lineHeight = fontSize * 1.2;
        
        // Semi-transparent background behind the quote
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(
          startOffset - 10, 
          dimensions.height - 50 - lineHeight + 5, 
          totalWidth + 20, 
          lineHeight
        );
        
        // Redraw the characters with enhanced visibility
        wordChars.forEach(charObj => {
          ctx.fillStyle = "#FFFFFF"; // Bright white for final assembled quote
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.shadowColor = "#00ff00"; // Green glow
          ctx.shadowBlur = 3;
          ctx.fillText(charObj.char, charObj.finalX, charObj.finalY);
        });
        ctx.shadowBlur = 0;
        
        // Set timer to restart animation after 5 seconds of displaying the quote
        quoteTimerRef.current = window.setTimeout(() => {
          selectQuote(); // Select a new quote
          restartAnimation();
        }, 5000);
      }
    };
    
    // Set up animation loop
    const interval = setInterval(draw, 33); // ~30 fps
    
    return () => {
      clearInterval(interval);
      if (quoteTimerRef.current) {
        clearTimeout(quoteTimerRef.current);
      }
    };
  }, [dimensions, fontSize, characterColor, speed, quotes, currentQuote]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={controls} 
      className={cn("relative", className)}
      id={id || generatedId}
      style={{ background }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
    </motion.div>
  );
};
