import { cn } from '@/lib/utils';
import { Star, Stars, AlertTriangle, BookOpen, Brain } from 'lucide-react';

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
      icon = <Stars className="stroke-green-600 dark:stroke-green-500" />;
      break;
    case 'good':
      textColor = 'text-yellow-600 dark:text-yellow-500';
      icon = <Star className="stroke-yellow-600 dark:stroke-yellow-500" />;
      break;
    case 'weak':
      textColor = 'text-red-600 dark:text-red-500';
      icon = <AlertTriangle className="stroke-red-600 dark:stroke-red-500" />;
      break;
    default:
      textColor = 'text-gray-600 dark:text-gray-400';
      icon = <Star className="stroke-gray-600 dark:stroke-gray-400" />;
  }

  // Type-specific icons for storytelling and reasoning
  if (type === 'storytelling') {
    icon = <BookOpen className={cn("mr-1.5", 
      lowerRating === 'strong' || lowerRating === 'great' ? "stroke-green-600 dark:stroke-green-500" :
      lowerRating === 'good' ? "stroke-yellow-600 dark:stroke-yellow-500" :
      lowerRating === 'weak' ? "stroke-red-600 dark:stroke-red-500" :
      "stroke-gray-600 dark:stroke-gray-400"
    )} />;
  } else if (type === 'reasoning') {
    icon = <Brain className={cn("mr-1.5", 
      lowerRating === 'strong' || lowerRating === 'great' ? "stroke-green-600 dark:stroke-green-500" :
      lowerRating === 'good' ? "stroke-yellow-600 dark:stroke-yellow-500" :
      lowerRating === 'weak' ? "stroke-red-600 dark:stroke-red-500" :
      "stroke-gray-600 dark:stroke-gray-400"
    )} />;
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