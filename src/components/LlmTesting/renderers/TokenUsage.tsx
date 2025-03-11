import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { CostData } from '@/lib/utils/tokenCalculation';

type TokenUsageProps = {
  tokenDetails: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  usdCostData: CostData | null;
  inrCostData: CostData | null;
};

// Render token usage and cost information
export function TokenUsage({ 
  tokenDetails, 
  usdCostData, 
  inrCostData 
}: TokenUsageProps) {
  return (
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
        
        {/* Cost information if available */}
        {(usdCostData || inrCostData) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {usdCostData && (
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Cost (USD)</span>
                <div className="flex flex-col text-sm">
                  <span>Input: {formatCurrency(usdCostData.input, 'USD')}</span>
                  <span>Output: {formatCurrency(usdCostData.output, 'USD')}</span>
                  <span className="text-base font-medium mt-1">
                    Total: {formatCurrency(usdCostData.total, 'USD')}
                  </span>
                </div>
              </div>
            )}
            
            {inrCostData && (
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Cost (INR)</span>
                <div className="flex flex-col text-sm">
                  <span>Input: {formatCurrency(inrCostData.input, 'INR')}</span>
                  <span>Output: {formatCurrency(inrCostData.output, 'INR')}</span>
                  <span className="text-base font-medium mt-1">
                    Total: {formatCurrency(inrCostData.total, 'INR')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 