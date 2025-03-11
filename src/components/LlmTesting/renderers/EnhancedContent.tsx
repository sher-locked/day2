import { SummaryDashboard } from './SummaryDashboard';
import { AnalysisSection } from './AnalysisSection';
import { Notes } from './Notes';
import { SuggestedImprovements } from './SuggestedImprovements';

type EnhancedContentProps = {
  parsedContent: Record<string, any> | null;
};

// Render the enhanced pretty content by combining all renderers
export function EnhancedContent({ parsedContent }: EnhancedContentProps) {
  if (!parsedContent) {
    return <div className="text-slate-400 italic">Waiting for complete JSON response...</div>;
  }
  
  return (
    <div className="p-4 space-y-4">
      {/* Summary Dashboard */}
      {parsedContent.summaryDashboard && (
        <SummaryDashboard summaryData={parsedContent.summaryDashboard} />
      )}
      
      {/* Storytelling Analysis */}
      {parsedContent.storytellingAnalysis && (
        <AnalysisSection 
          title="Storytelling Analysis" 
          analysisData={parsedContent.storytellingAnalysis} 
        />
      )}
      
      {/* Reasoning Analysis */}
      {parsedContent.reasoningAnalysis && (
        <AnalysisSection 
          title="Reasoning Analysis" 
          analysisData={parsedContent.reasoningAnalysis} 
        />
      )}
      
      {/* Notes */}
      {parsedContent.notes && (
        <Notes notes={parsedContent.notes} />
      )}
      
      {/* Suggested Improvements */}
      {parsedContent.suggestedImprovements && (
        <SuggestedImprovements improvements={parsedContent.suggestedImprovements} />
      )}
    </div>
  );
} 