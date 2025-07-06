import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const badgeVariants = {
  default: 'bg-muted text-muted-foreground border-border',
  success: 'bg-success/10 text-success border-success/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  outline: 'bg-transparent text-foreground border-border',
};

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'sm',
    animated = false,
    pulse = false,
    children, 
    ...props 
  }, ref) => {
    const badgeClasses = cn(
      'inline-flex items-center gap-1 rounded-full border font-medium transition-smooth',
      badgeVariants[variant],
      badgeSizes[size],
      {
        'animate-pulse': pulse,
      },
      className
    );

    if (animated) {
      return (
        <motion.span
          ref={ref}
          className={badgeClasses}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <span {...props}>
            {children}
          </span>
        </motion.span>
      );
    }

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };