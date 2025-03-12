import { RatingIndicator } from "../ui/RatingIndicator";
import { BookOpen, Brain, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type SummaryDashboardProps = {
  summaryData: any;
};

// Render the dashboard summary
export function SummaryDashboard({ summaryData }: SummaryDashboardProps) {
  if (!summaryData) return null;
  
  return (
    <div className="mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-5 text-primary border-b border-slate-200 dark:border-slate-800 pb-3">Analysis Summary</h2>
      
      {/* Simplified Analysis Section */}
      <div className="space-y-6">
        {/* Storytelling Analysis - Simplified */}
        <div className="flex items-start gap-4">
          <BookOpen className="text-primary h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">Storytelling</h3>
            <RatingIndicator 
              rating={summaryData.storytellingRating} 
              size="lg"
              type="storytelling"
            />
          </div>
        </div>
        
        {/* Reasoning Analysis - Simplified */}
        <div className="flex items-start gap-4">
          <Brain className="text-primary h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">Reasoning</h3>
            <RatingIndicator 
              rating={summaryData.reasoningRating} 
              size="lg"
              type="reasoning"
            />
          </div>
        </div>
        
        {/* Priority Focus Section - Simplified */}
        {summaryData.priorityFocus && (
          <div className="flex items-start gap-4">
            <Target className="text-primary h-6 w-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Priority Focus</h3>
              <div className="mt-1">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mr-2">Focus Point</span>
                  <div className="h-px flex-grow bg-blue-100 dark:bg-blue-900"></div>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 pl-1 border-l-2 border-blue-400 dark:border-blue-600 break-words">
                  {summaryData.priorityFocus}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 