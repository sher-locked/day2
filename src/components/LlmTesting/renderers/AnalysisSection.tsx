import { RatingIndicator } from "../ui/RatingIndicator";
import { BookOpen, Brain, Zap, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalysisSectionProps = {
  title: string;
  analysisData: any;
};

// Helper function to get the appropriate icon for storytelling components
const getStorytellingIcon = (key: string): React.ReactNode => {
  switch (key.toLowerCase()) {
    case 'setup':
      return <Zap className="h-4 w-4 text-blue-500" />;
    case 'conflict':
      return <Zap className="h-4 w-4 text-amber-500" />;
    case 'resolution':
      return <Zap className="h-4 w-4 text-green-500" />;
    default:
      return <Zap className="h-4 w-4 text-slate-500" />;
  }
};

// Render a visually enhanced analysis section (storytelling or reasoning)
export function AnalysisSection({ title, analysisData }: AnalysisSectionProps) {
  if (!analysisData) return null;
  
  const overallRating = analysisData.overallRating;
  const isStorytelling = title.toLowerCase().includes('storytelling');
  const isReasoning = title.toLowerCase().includes('reasoning');
  
  return (
    <div className="mb-6 border rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      {/* Header with title and rating */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isStorytelling && <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />}
          {isReasoning && <Brain className="h-5 w-5 text-primary flex-shrink-0" />}
          <h3 className="text-lg font-bold truncate">{title}</h3>
        </div>
        {overallRating && (
          <div className="flex-shrink-0 ml-2">
            <RatingIndicator 
              rating={overallRating} 
              size="md" 
              type={isStorytelling ? "storytelling" : isReasoning ? "reasoning" : "default"}
            />
          </div>
        )}
      </div>
      
      <div className="p-4">
        {Object.entries(analysisData).map(([key, value]) => {
          // Skip rendering overallRating and topSuggestion as they're handled specially
          if (key === 'overallRating' || key === 'topSuggestion') return null;
          
          // Handle nested objects (like setup, conflict, resolution, etc.)
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const nestedValue = value as any;
            
            // Special handling for storytelling elements
            if (isStorytelling && ['setup', 'conflict', 'resolution'].includes(key.toLowerCase())) {
              return (
                <div key={key} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {getStorytellingIcon(key)}
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <h4 className="font-medium capitalize truncate">{key}</h4>
                      {nestedValue.rating && (
                        <div className="flex-shrink-0 ml-2">
                          <RatingIndicator rating={nestedValue.rating} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {nestedValue.content && (
                    <div className="ml-10 mb-2 text-slate-700 dark:text-slate-300 text-sm break-words">
                      {nestedValue.content}
                    </div>
                  )}
                  
                  {nestedValue.feedback && (
                    <div className="ml-10 text-xs italic bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800 break-words">
                      {nestedValue.feedback}
                    </div>
                  )}
                </div>
              );
            }
            
            // Default rendering for other nested objects
            return (
              <div key={key} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  {nestedValue.rating && (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <RatingIndicator rating={nestedValue.rating} size="sm" />
                      </div>
                      <h4 className="font-medium capitalize truncate">{key}</h4>
                    </div>
                  )}
                  {!nestedValue.rating && (
                    <h4 className="font-medium capitalize truncate">{key}</h4>
                  )}
                </div>
                
                {nestedValue.content && (
                  <div className="mb-2 text-slate-700 dark:text-slate-300 text-sm break-words">
                    {nestedValue.content}
                  </div>
                )}
                
                {nestedValue.feedback && (
                  <div className="text-xs italic bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800 break-words">
                    {nestedValue.feedback}
                  </div>
                )}
              </div>
            );
          }
          
          return null;
        })}
        
        {analysisData.topSuggestion && (
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-3 rounded-md border border-blue-100 dark:border-blue-900 text-sm break-words">
            <span className="font-medium">Top suggestion: </span>
            {analysisData.topSuggestion}
          </div>
        )}
      </div>
    </div>
  );
} 