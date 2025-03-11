'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStreamingResponse } from '@/hooks/useStreamingResponse';
import { availableModels, MODEL_INFO } from '@/lib/constants/modelInfo';
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
  const [selectedModel, setSelectedModel] = useState(availableModels[0]?.value || 'gpt-4');
  const [startTime, setStartTime] = useState(Date.now());
  const [estimatedTokensForInput, setEstimatedTokensForInput] = useState(0);
  
  // Get selected model info
  const modelInfo = MODEL_INFO[selectedModel];
  
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartTime(Date.now());
    resetStream();
    
    // Start the streaming process
    await startStreaming('/api/llm-test', {
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
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Communication Enhancement Analyzer</h1>
      </div>
      
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="final-prompt">Final Prompt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-6">
          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Hero User Prompt input */}
                <div className="space-y-2">
                  <Label htmlFor="user-prompt" className="text-lg font-medium">Enter Your Text</Label>
                  <Textarea
                    id="user-prompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="h-60 text-base"
                    placeholder="Paste your text here for feedback and analysis..."
                    disabled={isLoading}
                  />
                  
                  {/* Token estimation */}
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Estimated tokens: {formatNumber(estimatedTokensForInput)}</span>
                    {modelInfo && (
                      <span className={estimatedTokensForInput > modelInfo.tokenLimit ? 'text-red-500 font-medium' : ''}>
                        Max input tokens: {formatNumber(modelInfo.tokenLimit)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Product Prompt (collapsed by default) */}
                <details className="text-sm border rounded-md p-2">
                  <summary className="cursor-pointer font-medium text-slate-600">Advanced: Edit Product Prompt</summary>
                  <div className="mt-3 space-y-2">
                    <Label htmlFor="product-prompt" className="text-xs">Product Prompt</Label>
                    <Textarea
                      id="product-prompt"
                      value={productPrompt}
                      onChange={(e) => setProductPrompt(e.target.value)}
                      className="h-32 text-xs font-mono"
                    />
                    <p className="text-xs text-slate-500">
                      This is the system instruction that guides the AI's response. Edit with caution.
                    </p>
                  </div>
                </details>
                
                {/* Model selector */}
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
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Text'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
          
          {/* Results section */}
          {(isLoading || content) && (
            <div className="space-y-4">
              {/* Thinking/streaming indicator */}
              <ThinkingIndicator 
                stage={stage} 
                model={selectedModel} 
                startTime={startTime}
                usageData={usageData}
                modelInfo={modelInfo}
              />
              
              {/* Streaming display */}
              <StreamingDisplay 
                content={content}
                model={selectedModel}
                response={responseData}
                usageData={usageData}
                modelInfo={modelInfo}
              />
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <Card className="border-red-300 dark:border-red-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="final-prompt" className="space-y-6">
          {/* Final combined prompt (read-only) */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="final-prompt">Final Prompt (sent to the LLM)</Label>
                <Textarea
                  id="final-prompt"
                  value={combinedPrompt}
                  className="h-96 font-mono text-sm"
                  readOnly
                />
                
                {/* Token estimation */}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Estimated tokens: {formatNumber(estimatedTokensForInput)}</span>
                  {modelInfo && (
                    <span className={estimatedTokensForInput > modelInfo.tokenLimit ? 'text-red-500 font-medium' : ''}>
                      Max input tokens: {formatNumber(modelInfo.tokenLimit)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Model selector */}
              <ModelSelector 
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                disabled={isLoading}
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !userPrompt.trim()}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Text'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Results section for raw tab */}
          {(isLoading || content) && (
            <div className="space-y-4">
              {/* Thinking/streaming indicator */}
              <ThinkingIndicator 
                stage={stage} 
                model={selectedModel} 
                startTime={startTime}
                usageData={usageData}
                modelInfo={modelInfo}
              />
              
              {/* Streaming display */}
              <StreamingDisplay 
                content={content}
                model={selectedModel}
                response={responseData}
                usageData={usageData}
                modelInfo={modelInfo}
              />
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <Card className="border-red-300 dark:border-red-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 