import { RatingIndicator } from "../ui/RatingIndicator";
import { BookOpen, Brain, Target, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SummaryDashboardProps = {
  summaryData: any;
};

// Render the dashboard summary
export function SummaryDashboard({ summaryData }: SummaryDashboardProps) {
  if (!summaryData) return null;
  
  return (
    <div className="mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
      <h2 className="text-2xl font-bold mb-5 text-primary border-b border-slate-200 dark:border-slate-800 pb-3">Analysis Summary</h2>
      
      {/* Storytelling and Reasoning Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Storytelling Analysis */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-primary h-5 w-5 flex-shrink-0" />
            <h3 className="text-lg font-medium truncate">Storytelling</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <RatingIndicator 
              rating={summaryData.storytellingRating} 
              size="lg"
              type="storytelling"
            />
            <ArrowUpRight className="text-slate-400 h-5 w-5 hover:text-primary transition-colors duration-200 cursor-pointer flex-shrink-0" />
          </div>
        </div>
        
        {/* Reasoning Analysis */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="text-primary h-5 w-5 flex-shrink-0" />
            <h3 className="text-lg font-medium truncate">Reasoning</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <RatingIndicator 
              rating={summaryData.reasoningRating} 
              size="lg"
              type="reasoning"
            />
            <ArrowUpRight className="text-slate-400 h-5 w-5 hover:text-primary transition-colors duration-200 cursor-pointer flex-shrink-0" />
          </div>
        </div>
      </div>
      
      {/* Priority Focus Section */}
      {summaryData.priorityFocus && (
        <div className="mt-2">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                  <Target className="text-primary h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium mb-2 truncate">Priority Focus</h3>
                <div className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-3 rounded-md border border-blue-100 dark:border-blue-900 break-words">
                  {summaryData.priorityFocus}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 