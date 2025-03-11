import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { ModelInfo } from '@/lib/constants/modelInfo';
import { UsageData, CostData } from '@/lib/utils/tokenCalculation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Simple inline Badge component to avoid import issues
function Badge({ 
  children, 
  variant = 'outline', 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'outline' | 'default' }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === 'outline' ? "border border-input bg-background" : "bg-primary text-primary-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}

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
  const jsonDisplayRef = useRef<HTMLDivElement>(null);
  const prettyDisplayRef = useRef<HTMLDivElement>(null);
  const [tokenDetails, setTokenDetails] = useState<{ inputTokens: number; outputTokens: number; totalTokens: number }>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  });
  const [usdCostData, setUsdCostData] = useState<CostData | null>(null);
  const [inrCostData, setInrCostData] = useState<CostData | null>(null);
  const [displayMode, setDisplayMode] = useState<'json' | 'pretty'>('pretty');
  const [parsedContent, setParsedContent] = useState<Record<string, any> | null>(null);
    
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

  // Try to parse the content as JSON for pretty display
  useEffect(() => {
    if (content) {
      try {
        // Only attempt to parse if content looks like JSON
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
          const parsed = JSON.parse(content);
          setParsedContent(parsed);
        }
      } catch (error) {
        // If parsing fails, don't update parsedContent
        // This allows partial JSON to be displayed in the raw view
        // while waiting for the complete JSON to be received
      }
    } else {
      setParsedContent(null);
    }
  }, [content]);

  // Auto-scroll to bottom as content updates
  useEffect(() => {
    if (displayMode === 'json' && jsonDisplayRef.current) {
      jsonDisplayRef.current.scrollTop = jsonDisplayRef.current.scrollHeight;
    } else if (displayMode === 'pretty' && prettyDisplayRef.current) {
      prettyDisplayRef.current.scrollTop = prettyDisplayRef.current.scrollHeight;
    }
  }, [content, displayMode]);
  
  // Render a single key-value pair for the pretty view
  const renderPrettyField = (key: string, value: any, depth = 0): React.ReactNode => {
    // Handle different types of values
    if (value === null || value === undefined) {
      return (
        <div key={key} className="mb-2 pl-4" style={{ marginLeft: `${depth * 12}px` }}>
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-slate-500 italic">{value === null ? 'null' : 'undefined'}</span>
        </div>
      );
    } else if (typeof value === 'string') {
      return (
        <div key={key} className="mb-2 pl-4" style={{ marginLeft: `${depth * 12}px` }}>
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-emerald-600 dark:text-emerald-400">"{value}"</span>
        </div>
      );
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      return (
        <div key={key} className="mb-2 pl-4" style={{ marginLeft: `${depth * 12}px` }}>
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-2" style={{ marginLeft: `${depth * 12}px` }}>
          <div className="pl-4 font-medium">{key}: <Badge variant="outline">{value.length} items</Badge></div>
          <div className="pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 mt-1">
            {value.map((item, index) => 
              typeof item === 'object' && item !== null 
                ? (
                  <div key={index} className="mb-2">
                    <div className="font-medium">[{index}]:</div>
                    <div className="pl-4">
                      {Object.entries(item).map(([itemKey, itemValue]) => 
                        renderPrettyField(itemKey, itemValue, depth + 1)
                      )}
                    </div>
                  </div>
                ) 
                : (
                  <div key={index} className="mb-1">
                    <span className="font-medium">[{index}]:</span>{' '}
                    {typeof item === 'string' 
                      ? <span className="text-emerald-600 dark:text-emerald-400">"{item}"</span>
                      : <span className="text-blue-600 dark:text-blue-400">{String(item)}</span>
                    }
                  </div>
                )
            )}
          </div>
        </div>
      );
    } else if (typeof value === 'object') {
      return (
        <div key={key} className="mb-2" style={{ marginLeft: `${depth * 12}px` }}>
          <div className="pl-4 font-medium">{key}:</div>
          <div className="pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 mt-1">
            {Object.entries(value).map(([objKey, objValue]) => 
              renderPrettyField(objKey, objValue, depth + 1)
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Render the pretty view content
  const renderPrettyContent = () => {
    if (!content) {
      return <div className="text-slate-400 italic">Response will appear here...</div>;
    }
    
    if (!parsedContent) {
      return <div className="text-slate-400 italic">Waiting for complete JSON response...</div>;
    }
    
    return (
      <div className="p-2">
        {Object.entries(parsedContent).map(([key, value]) => 
          renderPrettyField(key, value)
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2">
            <div className="text-sm font-medium">Response</div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-500">Model: {model}</div>
              <div className="inline-flex h-7 items-center rounded-md border p-1 text-xs">
                <button
                  className={`rounded px-2 py-0.5 ${displayMode === 'pretty' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                  onClick={() => setDisplayMode('pretty')}
                >
                  Pretty
                </button>
                <button
                  className={`rounded px-2 py-0.5 ${displayMode === 'json' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                  onClick={() => setDisplayMode('json')}
                >
                  JSON
                </button>
              </div>
            </div>
          </div>
          
          {displayMode === 'json' ? (
            <div 
              ref={jsonDisplayRef}
              className="p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm"
            >
              {content || <div className="text-slate-400 italic">Response will appear here...</div>}
            </div>
          ) : (
            <div 
              ref={prettyDisplayRef}
              className="p-4 max-h-[500px] overflow-y-auto font-sans text-sm"
            >
              {renderPrettyContent()}
            </div>
          )}
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