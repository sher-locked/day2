type SuggestedImprovementsProps = {
  improvements: string[];
};

// Render suggested improvements
export function SuggestedImprovements({ improvements }: SuggestedImprovementsProps) {
  if (!improvements || improvements.length === 0) return null;
  
  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
      <h3 className="text-lg font-bold mb-3">Suggested Improvements</h3>
      <div className="space-y-2">
        {improvements.map((improvement, index) => (
          <div key={`improvement-${index}`} className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-0.5">
              <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">{index + 1}</span>
            </div>
            <p className="text-sm">{improvement}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 