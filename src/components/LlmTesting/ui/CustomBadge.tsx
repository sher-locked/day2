import { cn } from '@/lib/utils';

export type CustomBadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export function CustomBadge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className, 
  ...props 
}: CustomBadgeProps) {
  // Determine variant styles
  const variantStyles = {
    default: "bg-primary/10 text-primary border-primary/20",
    outline: "border border-input bg-background",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
  };
  
  // Determine size styles
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1"
  };
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
} 