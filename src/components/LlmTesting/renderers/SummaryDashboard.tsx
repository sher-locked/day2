import { RatingIndicator } from "../ui/RatingIndicator";

type SummaryDashboardProps = {
  summaryData: any;
};

// Render the dashboard summary
export function SummaryDashboard({ summaryData }: SummaryDashboardProps) {
  if (!summaryData) return null;
  
  return (
    <div className="mb-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Summary Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Storytelling</div>
          <div className="flex items-center">
            <RatingIndicator 
              rating={summaryData.storytellingRating} 
              size="lg"
              className="w-full justify-center"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Reasoning</div>
          <div className="flex items-center">
            <RatingIndicator 
              rating={summaryData.reasoningRating} 
              size="lg"
              className="w-full justify-center"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Priority Focus</div>
          <div className="text-sm font-medium p-2 bg-blue-50 dark:bg-blue-900 dark:text-blue-50 rounded-md">
            {summaryData.priorityFocus || 'None specified'}
          </div>
        </div>
      </div>
    </div>
  );
} 