import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  hover?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-card border border-border shadow-card',
  glass: 'glass border border-white/10 shadow-card backdrop-blur-md',
  gradient: 'bg-gradient-card border border-white/20 shadow-card',
  outline: 'bg-transparent border-2 border-border hover:border-primary/50',
};

const cardSizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    animated = true,
    hover = true,
    children, 
    ...props 
  }, ref) => {
    const cardClasses = cn(
      'transition-smooth',
      cardVariants[variant],
      cardSizes[size],
      {
        'hover-scale hover:shadow-primary/20': hover && animated,
        'cursor-pointer': hover,
      },
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
        >
          <div {...props}>
            {children}
          </div>
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle: React.FC<CardTitleProps> = ({ 
  className, 
  children, 
  as: Component = 'h3',
  ...props 
}) => (
  <Component 
    className={cn('text-lg font-semibold text-card-foreground', className)} 
    {...props}
  >
    {children}
  </Component>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={cn('text-card-foreground', className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={cn('mt-4 pt-4 border-t border-border', className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };