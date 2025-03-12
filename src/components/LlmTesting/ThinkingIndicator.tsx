import { useState, useEffect } from 'react';
import { formatTime, formatNumber } from '@/lib/utils/formatters';
import { ModelInfo } from '@/app/api/llm-test/types';
import { UsageData } from '@/lib/utils/tokenCalculation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ThinkingIndicatorProps = { 
  stage: 'connecting' | 'thinking' | 'streaming' | 'complete' | 'error'; 
  model: string; 
  startTime: number;
  usageData?: UsageData | null;
  modelInfo?: ModelInfo | null;
};

// Helper function to abbreviate large numbers with K/M suffix
function abbreviateNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return formatNumber(num);
  }
}

export function ThinkingIndicator({ 
  stage, 
  model, 
  startTime, 
  usageData = null,
  modelInfo = null
}: ThinkingIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [approximateTokens, setApproximateTokens] = useState(0);
  const [finalElapsedTime, setFinalElapsedTime] = useState<number | null>(null);

  // Increment tokens roughly by 5-15 tokens every second during thinking/streaming
  useEffect(() => {
    if (usageData) {
      // If we have actual usage data, use that instead of estimates
      setApproximateTokens(usageData.total_tokens || 0);
      return;
    }
    
    // Only increment during thinking and streaming
    if (stage !== 'thinking' && stage !== 'streaming') return;
    
    const tokenTimer = setInterval(() => {
      setApproximateTokens(prev => {
        // Rate varies by model family
        const incrementAmount = modelInfo?.family === 'GPT-4' ? 
          Math.floor(Math.random() * 10) + 5 : // 5-15 tokens for GPT-4 (slower)
          Math.floor(Math.random() * 15) + 10; // 10-25 tokens for GPT-3.5 (faster)
        return prev + incrementAmount;
      });
    }, 1000);
    
    return () => clearInterval(tokenTimer);
  }, [stage, usageData, modelInfo]);

  // Track elapsed time
  useEffect(() => {
    // If we're in 'complete' stage and don't have a final time yet, set it
    if ((stage === 'complete' || stage === 'error') && finalElapsedTime === null) {
      setFinalElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      return;
    }
    
    // Don't update elapsed time if we're complete or have an error
    if (stage === 'complete' || stage === 'error') {
      return;
    }
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, stage, finalElapsedTime]);

  // Determine the appropriate icon, color, and message based on stage
  let icon = null;
  let statusColor = '';
  let cardBorderColor = '';
  let statusMessage = '';
  let pulseAnimation = '';
  
  switch(stage) {
    case 'connecting':
      icon = (
        <svg className="animate-spin mr-2 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
      statusColor = 'text-primary';
      cardBorderColor = 'border-primary/30';
      statusMessage = 'Connecting to model...';
      pulseAnimation = 'animate-pulse';
      break;
    case 'thinking':
      icon = (
        <svg className="mr-2 h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
        </svg>
      );
      statusColor = 'text-amber-500';
      cardBorderColor = 'border-amber-200 dark:border-amber-800';
      statusMessage = 'Model is thinking...';
      pulseAnimation = 'animate-pulse';
      break;
    case 'streaming':
      icon = (
        <svg className="mr-2 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
      statusColor = 'text-green-500';
      cardBorderColor = 'border-green-200 dark:border-green-800';
      statusMessage = 'Receiving response...';
      break;
    case 'complete':
      icon = (
        <svg className="mr-2 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
      statusColor = 'text-green-600';
      cardBorderColor = 'border-green-200 dark:border-green-800';
      statusMessage = 'Analysis complete';
      break;
    case 'error':
      icon = (
        <svg className="mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      );
      statusColor = 'text-red-500';
      cardBorderColor = 'border-red-200 dark:border-red-800';
      statusMessage = 'Error processing request';
      break;
  }

  return (
    <Card className={`overflow-hidden border ${cardBorderColor}`}>
      <CardContent className="p-0">
        <div className={`bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 ${pulseAnimation}`}>
          <div className="flex items-center">
            {icon}
            <h3 className={`text-lg font-medium ${statusColor}`}>{statusMessage}</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm mr-2">Model:</span>
              <Badge variant="outline" className="font-semibold">
                {model}
              </Badge>
            </div>
            
            <div className="flex items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm mr-2">Processing time:</span>
              <span className="font-medium text-sm">
                {finalElapsedTime !== null ? formatTime(finalElapsedTime) : formatTime(elapsedTime)}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm mr-2">Tokens:</span>
              <span className="font-medium text-sm">
                {usageData ? abbreviateNumber(usageData.total_tokens || 0) : abbreviateNumber(approximateTokens)}
              </span>
            </div>
            
            {modelInfo && 'costPer1000Tokens' in modelInfo && (
              <div className="flex items-center">
                <span className="text-slate-500 dark:text-slate-400 text-sm mr-2">Est. cost:</span>
                <span className="font-medium text-sm">
                  ${((usageData?.total_tokens || approximateTokens) * ((modelInfo as any).costPer1000Tokens / 1000)).toFixed(4)}
                </span>
              </div>
            )}
          </div>
          
          {/* Token usage details when complete */}
          {stage === 'complete' && usageData && (
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                <div className="text-xs text-slate-500 mb-1">Prompt Tokens</div>
                <div className="font-medium">{formatNumber(usageData.prompt_tokens || 0)}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                <div className="text-xs text-slate-500 mb-1">Completion Tokens</div>
                <div className="font-medium">{formatNumber(usageData.completion_tokens || 0)}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                <div className="text-xs text-slate-500 mb-1">Total Tokens</div>
                <div className="font-medium">{formatNumber(usageData.total_tokens || 0)}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 