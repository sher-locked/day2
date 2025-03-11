import { RatingIndicator } from "../ui/RatingIndicator";

type AnalysisSectionProps = {
  title: string;
  analysisData: any;
};

// Render a visually enhanced analysis section (storytelling or reasoning)
export function AnalysisSection({ title, analysisData }: AnalysisSectionProps) {
  if (!analysisData) return null;
  
  const overallRating = analysisData.overallRating;
  
  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {overallRating && (
          <RatingIndicator rating={overallRating} size="md" />
        )}
      </div>
      
      {Object.entries(analysisData).map(([key, value]) => {
        // Skip rendering overallRating and topSuggestion as they're handled specially
        if (key === 'overallRating' || key === 'topSuggestion') return null;
        
        // Handle nested objects (like setup, conflict, resolution, etc.)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedValue = value as any;
          
          return (
            <div key={key} className="mb-4 border-t pt-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <h4 className="font-medium capitalize">{key}</h4>
                {nestedValue.rating && (
                  <RatingIndicator rating={nestedValue.rating} size="sm" />
                )}
              </div>
              {nestedValue.content && (
                <div className="mb-2 text-slate-700 dark:text-slate-300 text-sm">
                  {nestedValue.content}
                </div>
              )}
              {nestedValue.feedback && (
                <div className="text-xs italic bg-slate-50 dark:bg-slate-900 p-2 rounded">
                  {nestedValue.feedback}
                </div>
              )}
            </div>
          );
        }
        
        return null;
      })}
      
      {analysisData.topSuggestion && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-sm">
          <span className="font-medium">Top suggestion: </span>
          {analysisData.topSuggestion}
        </div>
      )}
    </div>
  );
} 