import { SummaryDashboard } from './SummaryDashboard';
import { AnalysisSection } from './AnalysisSection';
import { Notes } from './Notes';
import { SuggestedImprovements } from './SuggestedImprovements';
import { Skeleton } from '../../../components/ui/skeleton';
import { useEffect, useState } from 'react';

type EnhancedContentProps = {
  parsedContent: Record<string, any> | null;
  stage?: 'connecting' | 'thinking' | 'streaming' | 'complete' | 'error';
  rawContent?: string; // Add raw content for partial parsing
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

// Function to attempt parsing partial JSON content
function tryParsePartialJson(content: string): Record<string, any> | null {
  if (!content || typeof content !== 'string') return null;
  
  try {
    // First try to parse as complete valid JSON
    if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
      try {
        return JSON.parse(content);
      } catch (e) {
        // If complete parsing fails, try partial parsing
      }
    }
    
    // Handle partial JSON by trying to extract valid objects
    const partial: Record<string, any> = {};
    
    // Look for potential complete objects with format: "key": { ... }
    const objectRegex = /"(\w+)":\s*(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
    let match;
    
    while ((match = objectRegex.exec(content)) !== null) {
      try {
        const key = match[1];
        const value = JSON.parse(match[2]);
        partial[key] = value;
      } catch (e) {
        // Skip invalid matches
      }
    }
    
    // Look for simple key-value pairs with string values: "key": "value"
    const stringValueRegex = /"(\w+)":\s*"([^"]*)"/g;
    while ((match = stringValueRegex.exec(content)) !== null) {
      const key = match[1];
      const value = match[2];
      if (!partial[key]) partial[key] = value;
    }
    
    // Look for simple key-value pairs with numeric values: "key": 123
    const numericValueRegex = /"(\w+)":\s*(-?\d+(?:\.\d+)?)/g;
    while ((match = numericValueRegex.exec(content)) !== null) {
      const key = match[1];
      const value = parseFloat(match[2]);
      if (!partial[key]) partial[key] = value;
    }
    
    // Look for simple key-value pairs with boolean values: "key": true|false
    const booleanValueRegex = /"(\w+)":\s*(true|false)/g;
    while ((match = booleanValueRegex.exec(content)) !== null) {
      const key = match[1];
      const value = match[2] === 'true';
      if (!partial[key]) partial[key] = value;
    }
    
    return Object.keys(partial).length > 0 ? partial : null;
  } catch (e) {
    console.error('Error parsing partial JSON:', e);
    return null;
  }
}

// Main EnhancedContent component
export function EnhancedContent({ parsedContent, stage = 'complete', rawContent }: EnhancedContentProps) {
  const [hasSummary, setHasSummary] = useState(false);
  const [hasStorytelling, setHasStorytelling] = useState(false);
  const [hasReasoning, setHasReasoning] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);
  const [hasImprovements, setHasImprovements] = useState(false);
  const [partialContent, setPartialContent] = useState<Record<string, any> | null>(null);
  
  // Try to extract and parse partial content when in streaming mode
  useEffect(() => {
    if (stage !== 'streaming' || parsedContent !== null || !rawContent) return;
    
    const partial = tryParsePartialJson(rawContent);
    setPartialContent(partial);
  }, [rawContent, stage, parsedContent]);
  
  // Use either parsed content or partial content
  const displayContent = parsedContent || partialContent;
  
  // Reset states when parsedContent changes
  useEffect(() => {
    // Reset all states when parsedContent and partialContent are null
    if (!displayContent) {
      setHasSummary(false);
      setHasStorytelling(false);
      setHasReasoning(false);
      setHasNotes(false);
      setHasImprovements(false);
      return;
    }
    
    // Check if each section is available
    if (displayContent.summaryDashboard) setHasSummary(true);
    if (displayContent.storytellingAnalysis) setHasStorytelling(true);
    if (displayContent.reasoningAnalysis) setHasReasoning(true);
    if (displayContent.notes) setHasNotes(true);
    if (displayContent.suggestedImprovements) setHasImprovements(true);
  }, [displayContent]);
  
  // Show loading skeletons when in streaming mode with no parsed content or empty object
  const isEmptyObject = displayContent && Object.keys(displayContent).length === 0;
  
  if (!displayContent || isEmptyObject) {
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

  // Add a simple raw text display for streaming partial content when we have raw content
  // but no structured content has been detected yet
  if (stage === 'streaming' && rawContent && !displayContent.summaryDashboard && 
      !displayContent.storytellingAnalysis && !displayContent.reasoningAnalysis) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Building response progressively...
          </p>
        </div>
        <div className="whitespace-pre-wrap p-2 text-sm">
          {rawContent}
        </div>
      </div>
    );
  }

  // Progressive rendering with fade-in animations for each section
  return (
    <div className="p-4 space-y-4">
      {/* Summary Dashboard - either show component or skeleton */}
      {displayContent.summaryDashboard ? (
        <div className={`transition-opacity duration-500 ${hasSummary ? 'opacity-100' : 'opacity-0'}`}>
          <SummaryDashboard summaryData={displayContent.summaryDashboard} />
        </div>
      ) : stage === 'streaming' && !hasSummary ? (
        <SummarySkeleton />
      ) : null}
      
      {/* Storytelling Analysis */}
      {displayContent.storytellingAnalysis ? (
        <div className={`transition-opacity duration-500 ${hasStorytelling ? 'opacity-100' : 'opacity-0'}`}>
          <AnalysisSection 
            title="Storytelling Analysis" 
            analysisData={displayContent.storytellingAnalysis} 
          />
        </div>
      ) : stage === 'streaming' && !hasStorytelling && hasSummary ? (
        <AnalysisSkeleton />
      ) : null}
      
      {/* Reasoning Analysis */}
      {displayContent.reasoningAnalysis ? (
        <div className={`transition-opacity duration-500 ${hasReasoning ? 'opacity-100' : 'opacity-0'}`}>
          <AnalysisSection 
            title="Reasoning Analysis" 
            analysisData={displayContent.reasoningAnalysis} 
          />
        </div>
      ) : stage === 'streaming' && !hasReasoning && hasStorytelling ? (
        <AnalysisSkeleton />
      ) : null}
      
      {/* Notes */}
      {displayContent.notes ? (
        <div className={`transition-opacity duration-500 ${hasNotes ? 'opacity-100' : 'opacity-0'}`}>
          <Notes notes={displayContent.notes} />
        </div>
      ) : stage === 'streaming' && !hasNotes && (hasReasoning || hasStorytelling) ? (
        <NotesSkeleton />
      ) : null}
      
      {/* Suggested Improvements */}
      {displayContent.suggestedImprovements ? (
        <div className={`transition-opacity duration-500 ${hasImprovements ? 'opacity-100' : 'opacity-0'}`}>
          <SuggestedImprovements improvements={displayContent.suggestedImprovements} />
        </div>
      ) : stage === 'streaming' && !hasImprovements && hasNotes ? (
        <ImprovementsSkeleton />
      ) : null}
      
      {/* Raw JSON for Debug (Dev Mode) */}
      {process.env.NODE_ENV === 'development' && stage === 'streaming' && (
        <div className="mt-8 border-t pt-4">
          <details className="text-xs">
            <summary className="cursor-pointer text-slate-500 mb-2">Debug: Detected Partial Content</summary>
            <pre className="bg-slate-50 dark:bg-slate-900 p-2 rounded overflow-auto max-h-[200px]">
              {JSON.stringify(displayContent, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
} 