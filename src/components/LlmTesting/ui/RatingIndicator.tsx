import { cn } from '@/lib/utils';

// RatingIndicator component for visual representation of ratings
export function RatingIndicator({ 
  rating,
  size = 'md',
  className
}: { 
  rating: string | undefined; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  if (!rating) return null;
  
  const lowerRating = rating.toLowerCase();
  
  // Determine style based on rating
  let bgColor = '';
  let textColor = '';
  let icon = '';
  let label = rating;
  
  switch (lowerRating) {
    case 'strong':
    case 'great':
      bgColor = 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700';
      textColor = 'text-white';
      icon = '★★★';
      break;
    case 'good':
      bgColor = 'bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600';
      textColor = 'text-gray-800 dark:text-gray-100';
      icon = '★★';
      break;
    case 'weak':
      bgColor = 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700';
      textColor = 'text-white';
      icon = '★';
      break;
    default:
      bgColor = 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800';
      textColor = 'text-gray-700 dark:text-gray-200';
      icon = '';
  }

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4'
  };
  
  return (
    <div 
      className={cn(
        'rounded-md shadow-sm font-medium flex items-center justify-center',
        bgColor,
        textColor,
        sizeClasses[size],
        className
      )}
    >
      <span className="mr-1.5">{icon}</span>
      <span>{label}</span>
    </div>
  );
} 