
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

  // Matrix rain animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const columnCount = Math.floor(dimensions.width / fontSize);
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columnCount; i++) {
      drops[i] = Math.random() * -100;
    }
    
    // Characters to display (including Asian characters for authentic Matrix look)
    const matrixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%・ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 / speed})`;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Text color and font
      ctx.fillStyle = characterColor;
      ctx.font = `${fontSize}px monospace`;
      
      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // x coordinate of the drop, y coordinate is drops[i]
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Draw the character
        ctx.fillText(text, x, y);
        
        // Send the drop back to the top randomly after it has crossed the screen
        // Adding randomness to the reset creates a more varied effect
        if (y > dimensions.height && Math.random() > 0.975) {
          drops[i] = 0;
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
  }, [dimensions, fontSize, characterColor, speed, density]);

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
