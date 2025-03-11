import { useState, useEffect } from 'react';
import { formatTime, formatNumber } from '@/lib/utils/formatters';
import { ModelInfo } from '@/lib/constants/modelInfo';
import { UsageData } from '@/lib/utils/tokenCalculation';

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
    <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Model: {model}</h3>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-4">
          <div>Time: {formatTime(elapsedTime)}</div>
          {(stage === 'thinking' || stage === 'streaming' || stage === 'complete') && (
            <div className="flex items-center gap-1">
              <span>Tokens: </span> 
              <span className={usageData ? 'font-medium' : 'opacity-70'}>
                {usageData ? formatNumber(usageData.total_tokens) : `~${formatNumber(approximateTokens)}`}
                {!usageData && stage !== 'complete' && <span className="animate-pulse">...</span>}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage === 'connecting' || stage === 'thinking' || stage === 'streaming' || stage === 'complete' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
          <div className="text-sm">Connecting to API</div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage === 'thinking' || stage === 'streaming' || stage === 'complete' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
          <div className="flex items-center gap-2 text-sm">
            Model thinking
            {stage === 'thinking' && (
              <div className="flex">
                <span className="animate-pulse ml-1">.</span>
                <span className="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '600ms' }}>.</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage === 'streaming' || stage === 'complete' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
          <div className="flex items-center gap-2 text-sm">
            Receiving response
            {stage === 'streaming' && (
              <div className="flex">
                <span className="animate-pulse ml-1">.</span>
                <span className="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '600ms' }}>.</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage === 'complete' ? 'bg-green-500' : stage === 'error' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
          <div className="text-sm">
            {stage === 'complete' ? 'Completed' : stage === 'error' ? 'Error' : 'Waiting for completion'}
          </div>
        </div>
      </div>
      
      {/* Add token usage summary during streaming/thinking */}
      {stage === 'streaming' && (
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded">
          <p>Streaming response in real-time. Token usage and cost will be calculated when complete.</p>
        </div>
      )}
    </div>
  );
} 