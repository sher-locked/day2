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

export function ThinkingIndicator({ 
  stage, 
  model, 
  startTime, 
  usageData = null,
  modelInfo = null
}: ThinkingIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [approximateTokens, setApproximateTokens] = useState(0);

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
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <Card className="shadow-md bg-slate-50 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div 
          className={`absolute h-full transition-all duration-500 ${
            stage === 'connecting' ? 'w-[15%] bg-blue-500' :
            stage === 'thinking' ? 'w-[45%] bg-amber-500' :
            stage === 'streaming' ? 'w-[75%] bg-purple-500' :
            stage === 'complete' ? 'w-full bg-green-500' :
            'w-full bg-red-500'
          }`}
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <span>Model:</span> 
            <Badge variant="outline" className="font-mono text-xs py-1">
              {model}
            </Badge>
          </h3>
          
          <div className="flex gap-4">
            {/* Time Metric with Enhanced Visual */}
            <div className={`flex flex-col items-center border rounded-lg p-2 ${
              elapsedTime > 10 ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' : 
              'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Time</span>
              <span className={`font-bold ${
                elapsedTime > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {formatTime(elapsedTime)}
              </span>
            </div>
            
            {/* Token Metric with Enhanced Visual */}
            {(stage === 'thinking' || stage === 'streaming' || stage === 'complete') && (
              <div className={`flex flex-col items-center border rounded-lg p-2 ${
                usageData ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 
                'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
              }`}>
                <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tokens</span>
                <span className={`font-bold ${
                  usageData ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {usageData ? formatNumber(usageData.total_tokens) : `~${formatNumber(approximateTokens)}`}
                  {!usageData && stage !== 'complete' && (
                    <span className="inline-flex ml-1">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                      <span className="animate-pulse" style={{ animationDelay: '600ms' }}>.</span>
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              stage === 'connecting' || stage === 'thinking' || stage === 'streaming' || stage === 'complete' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-300 dark:bg-slate-700'
            }`}>
              {(stage === 'connecting' || stage === 'thinking' || stage === 'streaming' || stage === 'complete') && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            </div>
            <div className="text-sm font-medium">API Connection Established</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              stage === 'thinking' || stage === 'streaming' || stage === 'complete' 
                ? 'bg-green-500 text-white' 
                : stage === 'connecting' 
                  ? 'bg-blue-500 text-white relative' 
                  : 'bg-slate-300 dark:bg-slate-700'
            }`}>
              {stage === 'connecting' && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-ping absolute w-3 h-3 rounded-full bg-blue-300 opacity-75"></span>
                  <span className="relative block w-2 h-2 rounded-full bg-blue-500"></span>
                </span>
              )}
              {(stage === 'thinking' || stage === 'streaming' || stage === 'complete') && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              Model Thinking
              {stage === 'thinking' && (
                <div className="relative h-5 w-5">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              stage === 'streaming' || stage === 'complete' 
                ? 'bg-green-500 text-white' 
                : stage === 'thinking' 
                  ? 'bg-amber-500 text-white relative' 
                  : 'bg-slate-300 dark:bg-slate-700'
            }`}>
              {stage === 'thinking' && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-ping absolute w-3 h-3 rounded-full bg-amber-300 opacity-75"></span>
                  <span className="relative block w-2 h-2 rounded-full bg-amber-500"></span>
                </span>
              )}
              {(stage === 'streaming' || stage === 'complete') && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              Receiving Response
              {stage === 'streaming' && (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              stage === 'complete' 
                ? 'bg-green-500 text-white' 
                : stage === 'error' 
                  ? 'bg-red-500 text-white' 
                  : stage === 'streaming' 
                    ? 'bg-purple-500 text-white relative' 
                    : 'bg-slate-300 dark:bg-slate-700'
            }`}>
              {stage === 'streaming' && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-ping absolute w-3 h-3 rounded-full bg-purple-300 opacity-75"></span>
                  <span className="relative block w-2 h-2 rounded-full bg-purple-500"></span>
                </span>
              )}
              {stage === 'complete' && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              {stage === 'error' && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            </div>
            <div className="text-sm font-medium">
              {stage === 'complete' ? 'Response Complete' : stage === 'error' ? 'Error Encountered' : 'Awaiting Completion'}
            </div>
          </div>
        </div>
        
        {/* Add token usage summary during streaming/thinking */}
        {stage === 'streaming' && (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Streaming response in real-time. Token usage and cost will be calculated when complete.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 