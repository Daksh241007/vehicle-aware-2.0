import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className, animate = true, ...props }) => {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <Component
      className={cn(
        'glass-card p-6 hover:border-cyan-500/30 transition-all duration-300',
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};