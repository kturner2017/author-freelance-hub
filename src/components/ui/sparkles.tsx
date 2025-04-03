
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
  const animationRef = useRef<number | null>(null);

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
    const wordChars: { char: string; x: number; y: number; speed: number; jumble: boolean; finalX: number; finalY: number; opacity: number; }[] = [];
    
    const initializeWordChars = () => {
      wordChars.length = 0; // Clear previous characters
      setDisplayedQuote(false);
      
      // Use a significantly larger font size for much better readability
      const largerFontSize = Math.max(fontSize * 2.5, 32); // Increased from 1.5x to 2.5x, min 32px
      const bottomY = dimensions.height - 20; // Position higher from the bottom
      const centerX = dimensions.width / 2;
      
      // Create characters for the quote
      activeQuote.split('').forEach((char, index) => {
        // Random starting position at the top
        const startX = Math.random() * dimensions.width;
        
        // Calculate final position (assembled quote at bottom)
        const totalWidth = activeQuote.length * (largerFontSize * 0.6);
        const startOffset = centerX - (totalWidth / 2);
        const finalX = startOffset + (index * largerFontSize * 0.6);
        
        wordChars.push({
          char,
          x: startX,
          y: -100 - (Math.random() * 100), // Stagger the start
          speed: 0.5 + (Math.random() * speed),
          jumble: true,
          finalX,
          finalY: bottomY,
          opacity: 1 // Full opacity
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
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      initializeWordChars();
    };
    
    const draw = () => {
      // Semi-transparent black to create fade effect without completely erasing characters
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 / speed})`;
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
          ctx.font = `bold ${Math.max(fontSize * 2.5, 32)}px monospace`; // Larger font for assembled quote
          ctx.shadowColor = characterColor;
          ctx.shadowBlur = 8; // Increased glow
        } else {
          // Falling characters use the specified character color
          ctx.fillStyle = characterColor;
          ctx.font = `${fontSize}px monospace`;
          ctx.shadowBlur = 0;
        }
        
        // Draw the character with full opacity
        ctx.globalAlpha = charObj.opacity;
        ctx.fillText(displayChar, charObj.x, charObj.y);
        ctx.globalAlpha = 1;
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
        
        // Clear the entire bottom area to remove any overlapping elements
        ctx.clearRect(0, dimensions.height - 60, dimensions.width, 60);
        
        // Use a significantly larger font size
        const largerFontSize = Math.max(fontSize * 2.5, 32);
        
        // Add a more visible background behind the quote
        ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Fully opaque black
        ctx.fillRect(
          0,  // Start at the left edge
          dimensions.height - 50, 
          dimensions.width,  // Cover full width
          50  // Taller background
        );
        
        // Redraw the characters with enhanced visibility
        wordChars.forEach(charObj => {
          ctx.fillStyle = "#FFFFFF"; // Bright white for final assembled quote
          ctx.font = `bold ${largerFontSize}px monospace`; // Larger font for better visibility
          ctx.shadowColor = "#00ff00"; // Green glow
          ctx.shadowBlur = 8; // Stronger glow effect
          ctx.fillText(charObj.char, charObj.finalX, charObj.finalY);
        });
        ctx.shadowBlur = 0;
        
        // Set timer to restart animation after 5 seconds of displaying the quote
        quoteTimerRef.current = window.setTimeout(() => {
          selectQuote(); // Select a new quote
          restartAnimation();
        }, 5000);
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
