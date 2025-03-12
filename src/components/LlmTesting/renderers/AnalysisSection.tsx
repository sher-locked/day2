import { RatingIndicator } from "../ui/RatingIndicator";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

type AnalysisSectionProps = {
  title: string;
  analysisData: any;
};

// Render a visually enhanced analysis section (storytelling or reasoning)
export function AnalysisSection({ title, analysisData }: AnalysisSectionProps) {
  if (!analysisData) return null;
  
  const overallRating = analysisData.overallRating;
  const isStorytelling = title.toLowerCase().includes('storytelling');
  const isReasoning = title.toLowerCase().includes('reasoning');
  
  return (
    <div className="mb-6 border rounded-lg bg-white dark:bg-slate-950 shadow-sm">
      {/* Header with title and rating */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2 min-w-0 flex-1">
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
            
            // Handle both storytelling and reasoning sections with the same layout
            // This makes storytelling consistent with reasoning
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
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded mr-2 uppercase tracking-wide">Content</span>
                      <div className="h-px flex-grow bg-slate-100 dark:bg-slate-800"></div>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 text-sm break-words">
                      {nestedValue.content}
                    </div>
                  </div>
                )}
                
                {nestedValue.feedback && (
                  <div className="mt-3">
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded mr-2 uppercase tracking-wide">Feedback</span>
                      <div className="h-px flex-grow bg-slate-100 dark:bg-slate-800"></div>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 pl-1 border-l-2 border-slate-300 dark:border-slate-700 break-words">
                      {nestedValue.feedback}
                    </div>
                  </div>
                )}
              </div>
            );
          }
          
          return null;
        })}
        
        {analysisData.topSuggestion && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded mr-2">
                <Lightbulb className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs font-medium uppercase tracking-wide">Suggestion</span>
              </div>
              <div className="h-px flex-grow bg-blue-100 dark:bg-blue-900"></div>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 pl-1 border-l-2 border-blue-400 dark:border-blue-600 break-words">
              {analysisData.topSuggestion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 