'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStreamingResponse } from '@/hooks/useStreamingResponse';
import { availableModels, getModelInfo } from '@/lib/constants/modelInfo';
import { estimateTokens } from '@/lib/utils/tokenCalculation';
import { formatNumber } from '@/lib/utils/formatters';

// Import extracted components
import { ThinkingIndicator } from '@/components/LlmTesting/ThinkingIndicator';
import { StreamingDisplay } from '@/components/LlmTesting/StreamingDisplay';
import { ModelSelector } from '@/components/LlmTesting/ModelSelector';

const DEFAULT_PRODUCT_PROMPT = `# Communication Enhancement Analyzer

**Role**:  
"You're an expert editor. Analyze the user's text below and provide structured feedback in JSON format using this framework:"

### **User Input**  
"[PASTE USER'S TEXT HERE]"  

---

### **Output Format**  
Return a valid JSON object with the following structure:

\`\`\`json
{
  "summaryDashboard": {
    "storytellingRating": "Strong|Good|Weak",
    "reasoningRating": "Strong|Good|Weak",
    "priorityFocus": "string"
  },
  "storytellingAnalysis": {
    "setup": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "conflict": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "resolution": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "overallRating": "Great|Good|Weak",
    "topSuggestion": "string"
  },
  "reasoningAnalysis": {
    "premise": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "evidence": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "conclusion": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "overallRating": "Great|Good|Weak",
    "topSuggestion": "string"
  },
  "notes": {
    "grammarErrors": ["string"],
    "biases": ["string"],
    "jargonComplexity": ["string"]
  },
  "suggestedImprovements": ["string", "string", "string"]
}
\`\`\`

**Rules**:  
- Return valid, properly formatted JSON
- Start with strengths
- Link feedback to specific text quotes
- For Weak ratings, provide concrete examples`;

export function LlmTestingInterface() {
  // State for form inputs
  const [userPrompt, setUserPrompt] = useState('');
  const [productPrompt, setProductPrompt] = useState(DEFAULT_PRODUCT_PROMPT);
  const [selectedModel, setSelectedModel] = useState(
    // Try to get the GPT-4o model first, otherwise fall back to the first available model
    availableModels.find(model => model.value === 'gpt-4o')?.value || 
    availableModels.find(model => model.provider === 'openai')?.value || 
    availableModels[0]?.value || 
    'claude-3-haiku-20240307'
  );
  const [startTime, setStartTime] = useState(Date.now());
  const [estimatedTokensForInput, setEstimatedTokensForInput] = useState(0);
  
  // Get selected model info
  const modelInfo = getModelInfo(selectedModel);
  
  // Streaming state from custom hook
  const {
    content,
    isLoading,
    error,
    stage,
    reset: resetStream,
    startStreaming,
    usageData,
    responseData
  } = useStreamingResponse({
    onComplete: () => {
      // Completion callback if needed
    }
  });

  // Generate the combined prompt (product prompt + user input)
  const combinedPrompt = productPrompt.replace('[PASTE USER\'S TEXT HERE]', userPrompt);
  
  // Update token estimation when inputs change
  useEffect(() => {
    const estimatedTokenCount = estimateTokens(combinedPrompt);
    setEstimatedTokensForInput(estimatedTokenCount);
  }, [userPrompt, productPrompt, combinedPrompt]);
  
  // Add state for API key errors
  const [apiKeyError, setApiKeyError] = useState<{providers: string[], models: string[]} | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartTime(Date.now());
    resetStream();
    // Reset API key error
    setApiKeyError(null);
    
    try {
      // Start the streaming process
      const response = await startStreaming('/api/llm-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userPrompt,
          selectedModels: [selectedModel],
          streaming: true,
          systemMessage: productPrompt
        })
      });
      
      // Check if response contains API key error
      if (response && response.status === 401) {
        try {
          const errorData = await response.clone().json();
          if (errorData.missingProviders) {
            setApiKeyError({
              providers: errorData.missingProviders,
              models: selectedModel ? [selectedModel] : []
            });
          }
        } catch (jsonErr) {
          console.error('Error parsing error response:', jsonErr);
        }
      }
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };
  
  return (
    <div className="px-4 py-6 space-y-6">
      <Tabs defaultValue="user-mode" className="w-full">
        <TabsList className="mb-4 bg-slate-200/70 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
          <TabsTrigger value="user-mode" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">User Mode</TabsTrigger>
          <TabsTrigger value="dev-mode" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Dev Mode</TabsTrigger>
        </TabsList>
        
        {/* User Mode - Focused on usability and user experience */}
        <TabsContent value="user-mode" className="space-y-6">
          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white dark:bg-white/5 border-slate-200/70 dark:border-white/10 shadow-lg">
              <CardContent className="pt-5 space-y-5">
                {/* Hero User Prompt input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="user-prompt" className="text-base font-medium text-slate-900 dark:text-white">Enter Your Text</Label>
                    <div className="text-xs text-slate-700 dark:text-white/70 font-medium bg-blue-100/70 dark:bg-blue-900/30 px-3 py-1.5 rounded-md border border-blue-200/60 dark:border-blue-800/30">
                      Using Model: <span className="font-bold">{selectedModel}</span>
                    </div>
                  </div>
                  <Textarea
                    id="user-prompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="h-60 text-base bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40"
                    placeholder="Paste your text here for feedback and analysis..."
                    disabled={isLoading}
                  />
                  
                  {/* Token estimation */}
                  <div className="flex justify-between text-xs text-slate-500 dark:text-white/60">
                    <span>Estimated tokens: <span className="font-mono">{formatNumber(estimatedTokensForInput)}</span></span>
                    {modelInfo && (
                      <span className={estimatedTokensForInput > modelInfo.tokenLimit ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                        Max input tokens: <span className="font-mono">{formatNumber(modelInfo.tokenLimit)}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Model selector - styling will be handled in component */}
                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading}
                />
                
                {/* Submit button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !userPrompt.trim()}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 text-base"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Text'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
          
          {/* Results section - with a visual separator if results are showing */}
          {(isLoading || content) && (
            <>
              {/* Visual separator between input and results */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-[#0a0a0a] px-3 text-xs text-slate-600 dark:text-white/60">
                    Results
                  </span>
                </div>
              </div>
              
              <div className="space-y-5">
                {/* Thinking/streaming indicator - styling will be handled in component */}
                <ThinkingIndicator 
                  stage={stage} 
                  model={selectedModel} 
                  startTime={startTime}
                  usageData={usageData}
                  modelInfo={modelInfo}
                />
                
                {/* Streaming display - with user mode - styling will be handled in component */}
                <StreamingDisplay 
                  content={content}
                  model={selectedModel}
                  response={responseData}
                  usageData={usageData}
                  modelInfo={modelInfo}
                  mode="user"
                />
              </div>
            </>
          )}
          
          {/* Error display */}
          {error && (
            <Card className="border-red-500/50 bg-white dark:bg-white/5">
              <CardContent className="pt-5">
                <h3 className="text-base font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                <p className="text-sm text-slate-700 dark:text-white/80">{error}</p>
              </CardContent>
            </Card>
          )}
          
          {apiKeyError && (
            <Card className="border-amber-500/50 bg-white dark:bg-white/5">
              <CardContent className="pt-5">
                <h3 className="text-base font-medium text-amber-600 dark:text-amber-400 mb-2">API Key Missing</h3>
                <div className="space-y-2">
                  <p className="text-sm text-slate-700 dark:text-white/80">
                    <strong>Missing API key for {apiKeyError.providers.join(' and ')}.</strong> Unable to use model{apiKeyError.models.length > 1 ? 's' : ''}: {apiKeyError.models.join(', ')}.
                  </p>
                  <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded text-sm border border-amber-200/60 dark:border-amber-800/30">
                    <p className="font-medium mb-1 text-amber-700 dark:text-amber-300">To fix this issue:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-white/80">
                      <li>Create an API key from the provider's website.</li>
                      <li>Add it to your .env.local file.</li>
                      <li>Restart the application.</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Dev Mode - Focused on technical details and development information */}
        <TabsContent value="dev-mode" className="space-y-6">
          <div className="space-y-6">
            {/* System Prompt (formerly Product Prompt) */}
            <Card className="bg-white dark:bg-white/5 border-slate-200/70 dark:border-white/10 shadow-lg">
              <CardContent className="pt-5 space-y-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">System Prompt</h3>
                <div className="space-y-2">
                  <Label htmlFor="product-prompt" className="text-slate-700 dark:text-white/80">Edit the system instructions:</Label>
                  <Textarea
                    id="product-prompt"
                    value={productPrompt}
                    onChange={(e) => setProductPrompt(e.target.value)}
                    className="h-60 text-sm font-mono bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Final Call with Prompt (API with request JSON) */}
            <Card className="bg-white dark:bg-white/5 border-slate-200/70 dark:border-white/10 shadow-lg">
              <CardContent className="pt-5 space-y-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">API Request</h3>
                <div className="space-y-2">
                  <Label htmlFor="final-prompt" className="text-slate-700 dark:text-white/80">Complete prompt sent to the LLM:</Label>
                  <Textarea
                    id="final-prompt"
                    value={combinedPrompt}
                    className="h-60 font-mono text-sm bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    readOnly
                  />
                  
                  {/* Token estimation */}
                  <div className="flex justify-between text-xs text-slate-500 dark:text-white/60">
                    <span>Estimated tokens: <span className="font-mono">{formatNumber(estimatedTokensForInput)}</span></span>
                    {modelInfo && (
                      <span className={estimatedTokensForInput > modelInfo.tokenLimit ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                        Max input tokens: <span className="font-mono">{formatNumber(modelInfo.tokenLimit)}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 text-slate-700 dark:text-white/80">Request Details:</h4>
                  <pre className="text-xs bg-slate-50 dark:bg-black/40 p-3 rounded overflow-auto max-h-[200px] text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10">
                    {JSON.stringify({
                      endpoint: '/api/llm-test',
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: {
                        prompt: userPrompt ? '(user text from User Mode)' : '',
                        selectedModels: [selectedModel],
                        streaming: true,
                        systemMessage: '(system prompt)'
                      }
                    }, null, 2)}
                  </pre>
                </div>
                
                {/* Submit button - Hidden in Dev Mode, since we want users to use User Mode for testing */}
                <div className="flex items-center mt-4 p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded border border-amber-200/60 dark:border-amber-800/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Dev Mode is for configuration only</p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">Please use User Mode to test with the current model ({selectedModel})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Response Sections - with a visual separator if results are showing */}
            {(isLoading || content) && (
              <>
                {/* Visual separator between configuration and results */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-[#0a0a0a] px-3 text-xs text-slate-600 dark:text-white/60">
                      Response Data
                    </span>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {/* Streamed API Response Data */}
                  <Card className="bg-white dark:bg-white/5 border-slate-200/70 dark:border-white/10 shadow-lg">
                    <CardContent className="pt-5 space-y-4">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">API Response</h3>
                      <pre className="text-xs bg-slate-50 dark:bg-black/40 p-3 rounded overflow-auto max-h-[300px] text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10">
                        {content ? content : "Waiting for response..."}
                      </pre>
                    </CardContent>
                  </Card>
                  
                  {/* Response metadata */}
                  {responseData && (
                    <Card className="bg-white dark:bg-white/5 border-slate-200/70 dark:border-white/10 shadow-lg">
                      <CardContent className="pt-5 space-y-4">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Response Metadata</h3>
                        <pre className="text-xs bg-slate-50 dark:bg-black/40 p-3 rounded overflow-auto max-h-[200px] text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10">
                          {JSON.stringify(responseData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Usage data */}
                  {usageData && (
                    <Card className="bg-white dark:bg-white/5 border-slate-200/70 dark:border-white/10 shadow-lg">
                      <CardContent className="pt-5 space-y-4">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Usage Data</h3>
                        <pre className="text-xs bg-slate-50 dark:bg-black/40 p-3 rounded overflow-auto max-h-[200px] text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10">
                          {JSON.stringify(usageData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
            
            {/* Error display */}
            {error && (
              <Card className="border-red-500/50 bg-white dark:bg-white/5">
                <CardContent className="pt-5">
                  <h3 className="text-base font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                  <pre className="text-xs bg-red-50/80 dark:bg-red-950/30 p-3 rounded overflow-auto text-slate-700 dark:text-white/80 border border-red-200/60 dark:border-red-800/30">
                    {error}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 