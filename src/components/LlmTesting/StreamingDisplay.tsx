import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { ModelInfo } from '@/lib/constants/modelInfo';
import { UsageData, CostData } from '@/lib/utils/tokenCalculation';

type StreamingDisplayProps = {
  content: string;
  model: string;
  response: Record<string, unknown> | null;
  usageData: UsageData | null;
  modelInfo: ModelInfo | null;
};

export function StreamingDisplay({ 
  content, 
  model, 
  response, 
  usageData,
  modelInfo
}: StreamingDisplayProps) {
  const displayRef = useRef<HTMLDivElement>(null);
  const [tokenDetails, setTokenDetails] = useState<{ inputTokens: number; outputTokens: number; totalTokens: number }>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  });
  const [usdCostData, setUsdCostData] = useState<CostData | null>(null);
  const [inrCostData, setInrCostData] = useState<CostData | null>(null);
    
  // Update token information when usage data changes
  useEffect(() => {
    if (usageData) {
      setTokenDetails({
        inputTokens: usageData.prompt_tokens || 0,
        outputTokens: usageData.completion_tokens || 0,
        totalTokens: usageData.total_tokens || 0
      });
      
      // Set cost data from usageData
      setUsdCostData(usageData.cost_usd || null);
      setInrCostData(usageData.cost_inr || null);
    }
  }, [usageData]);

  // Auto-scroll to bottom as content updates
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [content]);
  
  return (
    <div className="flex flex-col space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2">
            <div className="text-sm font-medium">Response</div>
            <div className="text-xs text-slate-500">Model: {model}</div>
          </div>
          <div 
            ref={displayRef}
            className="p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm"
          >
            {content || <div className="text-slate-400 italic">Response will appear here...</div>}
          </div>
        </CardContent>
      </Card>
      
      {/* Token Usage Details */}
      {usageData && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Token Usage & Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Input Tokens</span>
                <span className="text-lg font-medium">{formatNumber(tokenDetails.inputTokens)}</span>
              </div>
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Output Tokens</span>
                <span className="text-lg font-medium">{formatNumber(tokenDetails.outputTokens)}</span>
              </div>
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Tokens</span>
                <span className="text-lg font-medium">{formatNumber(tokenDetails.totalTokens)}</span>
              </div>
            </div>
            
            {usdCostData && inrCostData && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Cost</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                    <span className="text-xs text-slate-500 dark:text-slate-400">USD</span>
                    <span className="text-lg font-medium">{formatCurrency(usdCostData.total, 'USD')}</span>
                  </div>
                  <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                    <span className="text-xs text-slate-500 dark:text-slate-400">INR</span>
                    <span className="text-lg font-medium">{formatCurrency(inrCostData.total, 'INR')}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  <p>Model Token Limits: {modelInfo?.tokenLimit ? `Input: ${formatNumber(modelInfo.tokenLimit)}` : 'Unknown'} | {modelInfo?.outputLimit ? `Output: ${formatNumber(modelInfo.outputLimit)}` : 'Unknown'}</p>
                  <p className="mt-1">Cost calculated based on current OpenAI pricing: Input tokens at {modelInfo?.inputPrice ? `$${modelInfo.inputPrice}/1K tokens` : 'unknown rate'} and Output tokens at {modelInfo?.outputPrice ? `$${modelInfo.outputPrice}/1K tokens` : 'unknown rate'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Raw Response Data (for debugging) */}
      {response && process.env.NODE_ENV === 'development' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Raw Response Data</h3>
            <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded overflow-auto max-h-[200px]">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 