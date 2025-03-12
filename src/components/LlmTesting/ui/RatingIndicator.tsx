import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

type RatingIndicatorProps = {
  rating: string | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'storytelling' | 'reasoning' | 'default';
};

// RatingIndicator component for visual representation of ratings
export function RatingIndicator({ 
  rating,
  size = 'md',
  className,
  type = 'default'
}: RatingIndicatorProps) {
  if (!rating) return null;
  
  const lowerRating = rating.toLowerCase();
  
  // Determine style based on rating
  let textColor = '';
  let icon = null;
  let label = rating;
  
  switch (lowerRating) {
    case 'strong':
    case 'great':
      textColor = 'text-green-600 dark:text-green-500';
      icon = <CheckCircle className="fill-green-600 dark:fill-green-500 stroke-white dark:stroke-slate-900" />;
      break;
    case 'good':
      textColor = 'text-amber-600 dark:text-amber-500';
      icon = <AlertCircle className="fill-amber-500 dark:fill-amber-500 stroke-white dark:stroke-slate-900" />;
      break;
    case 'weak':
      textColor = 'text-red-600 dark:text-red-500';
      icon = <XCircle className="fill-red-600 dark:fill-red-500 stroke-white dark:stroke-slate-900" />;
      break;
    default:
      textColor = 'text-gray-600 dark:text-gray-400';
      icon = <CheckCircle className="fill-gray-600 dark:fill-gray-400 stroke-white dark:stroke-slate-900" />;
  }

  // Size classes
  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2'
  };

  const iconSizes = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6'
  };
  
  return (
    <div 
      className={cn(
        'flex items-center font-medium',
        textColor,
        sizeClasses[size],
        className
      )}
    >
      <span className={iconSizes[size]}>{icon}</span>
      <span>{label}</span>
    </div>
  );
} 