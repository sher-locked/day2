import { cn } from '@/lib/utils';

// Simple inline Badge component
export function CustomBadge({ 
  children, 
  variant = 'outline', 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLSpanElement> & { 
  variant?: 'outline' | 'default' | 'success' | 'warning' | 'error' 
}) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === 'outline' ? "border border-input bg-background" : "",
        variant === 'default' ? "bg-primary text-primary-foreground" : "",
        variant === 'success' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "",
        variant === 'warning' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : "",
        variant === 'error' ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : "",
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
} 