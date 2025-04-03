
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
    };
  }, [controls]);

  // Matrix rain animation effect with quotes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Split quotes into words
    const words: string[] = [];
    quotes.forEach(quote => {
      quote.split(' ').forEach(word => {
        if (word.trim()) words.push(word.trim());
      });
    });
    
    const columnWidth = fontSize * 6; // Width for each column (wider to fit words)
    const columnCount = Math.floor(dimensions.width / columnWidth);
    const drops: number[] = [];
    const currentWords: string[] = [];
    
    // Initialize drops and words
    for (let i = 0; i < columnCount; i++) {
      drops[i] = Math.random() * -100;
      currentWords[i] = words[Math.floor(Math.random() * words.length)];
    }
    
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 / speed})`;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Text color and font
      ctx.fillStyle = characterColor;
      ctx.font = `${fontSize}px monospace`;
      
      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Get current word for this column
        const word = currentWords[i];
        
        // x coordinate of the drop, y coordinate is drops[i]
        const x = i * columnWidth;
        const y = drops[i] * fontSize;
        
        // Draw the word
        ctx.fillText(word, x, y);
        
        // Send the drop back to the top randomly after it has crossed the screen
        // Adding randomness to the reset creates a more varied effect
        if (y > dimensions.height && Math.random() > 0.975) {
          drops[i] = 0;
          // Change the word for variety
          currentWords[i] = words[Math.floor(Math.random() * words.length)];
        }
        
        // Increment y coordinate for the drop
        drops[i] += (speed * 0.1);
      }
    };
    
    // Set up animation loop with proper density
    const interval = setInterval(draw, 33 / (speed * 0.5)); // ~30 fps adjusted by speed
    
    return () => {
      clearInterval(interval);
    };
  }, [dimensions, fontSize, characterColor, speed, density, quotes]);

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

