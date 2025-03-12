import { SummaryDashboard } from './SummaryDashboard';
import { AnalysisSection } from './AnalysisSection';
import { Notes } from './Notes';
import { SuggestedImprovements } from './SuggestedImprovements';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

type EnhancedContentProps = {
  parsedContent: Record<string, any> | null;
  stage?: 'connecting' | 'thinking' | 'streaming' | 'complete' | 'error';
};

// Placeholder skeleton components
function SummarySkeleton() {
  return (
    <div className="mb-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4 shadow-sm animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm h-24">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm h-24">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm h-24">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-4">
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-1" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

function NotesSkeleton() {
  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm animate-pulse">
      <Skeleton className="h-5 w-24 mb-4" />
      <div className="space-y-3">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="pl-5 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-36 mb-2" />
          <div className="pl-5 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImprovementsSkeleton() {
  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm animate-pulse">
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="space-y-3">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-2 mt-0.5"></div>
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-2 mt-0.5"></div>
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-2 mt-0.5"></div>
          <Skeleton className="h-4 w-11/12" />
        </div>
      </div>
    </div>
  );
}

// Main EnhancedContent component
export function EnhancedContent({ parsedContent, stage = 'complete' }: EnhancedContentProps) {
  const [hasSummary, setHasSummary] = useState(false);
  const [hasStorytelling, setHasStorytelling] = useState(false);
  const [hasReasoning, setHasReasoning] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);
  const [hasImprovements, setHasImprovements] = useState(false);
  
  // Reset states when parsedContent changes
  useEffect(() => {
    // Reset all states when parsedContent is null
    if (!parsedContent) {
      setHasSummary(false);
      setHasStorytelling(false);
      setHasReasoning(false);
      setHasNotes(false);
      setHasImprovements(false);
      return;
    }
    
    // Check if each section is available
    if (parsedContent.summaryDashboard) setHasSummary(true);
    if (parsedContent.storytellingAnalysis) setHasStorytelling(true);
    if (parsedContent.reasoningAnalysis) setHasReasoning(true);
    if (parsedContent.notes) setHasNotes(true);
    if (parsedContent.suggestedImprovements) setHasImprovements(true);
  }, [parsedContent]);
  
  // Show loading skeletons when in streaming mode with no parsed content or empty object
  const isEmptyObject = parsedContent && Object.keys(parsedContent).length === 0;
  
  if (!parsedContent || isEmptyObject) {
    if (stage === 'connecting' || stage === 'thinking') {
      // Show initial loading skeleton
      return (
        <div className="p-4 space-y-4 overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">
              Building analysis components...
            </p>
          </div>
          <SummarySkeleton />
          <AnalysisSkeleton />
        </div>
      );
    }
    
    if (stage === 'streaming') {
      // Show progressive skeletons
      return (
        <div className="p-4 space-y-4 overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-4 w-4 bg-purple-500 rounded-full animate-pulse"></div>
            <p className="text-slate-500 dark:text-slate-400">
              Receiving JSON response...
            </p>
          </div>
          <SummarySkeleton />
          <AnalysisSkeleton />
          <NotesSkeleton />
          <ImprovementsSkeleton />
        </div>
      );
    }
    
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px] text-slate-400 italic">
        {stage === 'error' ? (
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  className="h-4 w-4 text-red-500 dark:text-red-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p>Error parsing response. Please try again.</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  className="h-4 w-4 text-blue-500 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p>Waiting for complete JSON response...</p>
          </div>
        )}
      </div>
    );
  }

  // Progressive rendering with fade-in animations for each section
  return (
    <div className="p-4 space-y-4">
      {/* Summary Dashboard - either show component or skeleton */}
      {parsedContent.summaryDashboard ? (
        <div className={`transition-opacity duration-500 ${hasSummary ? 'opacity-100' : 'opacity-0'}`}>
          <SummaryDashboard summaryData={parsedContent.summaryDashboard} />
        </div>
      ) : stage === 'streaming' && !hasSummary ? (
        <SummarySkeleton />
      ) : null}
      
      {/* Storytelling Analysis */}
      {parsedContent.storytellingAnalysis ? (
        <div className={`transition-opacity duration-500 ${hasStorytelling ? 'opacity-100' : 'opacity-0'}`}>
          <AnalysisSection 
            title="Storytelling Analysis" 
            analysisData={parsedContent.storytellingAnalysis} 
          />
        </div>
      ) : stage === 'streaming' && !hasStorytelling && hasSummary ? (
        <AnalysisSkeleton />
      ) : null}
      
      {/* Reasoning Analysis */}
      {parsedContent.reasoningAnalysis ? (
        <div className={`transition-opacity duration-500 ${hasReasoning ? 'opacity-100' : 'opacity-0'}`}>
          <AnalysisSection 
            title="Reasoning Analysis" 
            analysisData={parsedContent.reasoningAnalysis} 
          />
        </div>
      ) : stage === 'streaming' && !hasReasoning && hasStorytelling ? (
        <AnalysisSkeleton />
      ) : null}
      
      {/* Notes */}
      {parsedContent.notes ? (
        <div className={`transition-opacity duration-500 ${hasNotes ? 'opacity-100' : 'opacity-0'}`}>
          <Notes notes={parsedContent.notes} />
        </div>
      ) : stage === 'streaming' && !hasNotes && hasReasoning ? (
        <NotesSkeleton />
      ) : null}
      
      {/* Suggested Improvements */}
      {parsedContent.suggestedImprovements ? (
        <div className={`transition-opacity duration-500 ${hasImprovements ? 'opacity-100' : 'opacity-0'}`}>
          <SuggestedImprovements improvements={parsedContent.suggestedImprovements} />
        </div>
      ) : stage === 'streaming' && !hasImprovements && hasNotes ? (
        <ImprovementsSkeleton />
      ) : null}
      
      {/* If the data is still loading (streaming) but we have some parts, show a loading indicator */}
      {stage === 'streaming' && Object.keys(parsedContent).length > 0 && Object.keys(parsedContent).length < 5 && (
        <div className="flex items-center justify-center p-4 text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="relative h-5 w-5">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
            </div>
            <span>Loading additional analysis components...</span>
          </div>
        </div>
      )}
    </div>
  );
} 