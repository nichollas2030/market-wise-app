import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const spinnerSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const spinnerVariants = {
  primary: 'border-primary/30 border-t-primary',
  secondary: 'border-secondary/30 border-t-secondary',
  white: 'border-white/30 border-t-white',
};

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  variant = 'primary', 
  className 
}) => {
  return (
    <motion.div
      className={cn(
        'inline-block rounded-full border-2 border-solid',
        spinnerSizes[size],
        spinnerVariants[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// Loading skeleton component
interface SkeletonProps {
  className?: string;
  animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, animated = true }) => {
  const skeletonClasses = cn(
    'bg-muted rounded',
    {
      'animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]': animated,
    },
    className
  );

  return <div className={skeletonClasses} />;
};

// Loading states component
interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  text = 'Loading...', 
  size = 'md',
  className 
}) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Spinner size={spinnerSize} />
      <p className={cn('text-muted-foreground', textSize)}>
        {text}
      </p>
    </div>
  );
};

export { Spinner, Skeleton, LoadingState };