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

export function LlmTestingInterface() {
  // State for form inputs
  const [prompt, setPrompt] = useState('');
  const [systemMessage, setSystemMessage] = useState('You are a helpful assistant.');
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
  
  // Update token estimation when inputs change
  useEffect(() => {
    const totalText = prompt + systemMessage;
    const estimatedTokenCount = estimateTokens(totalText);
    setEstimatedTokensForInput(estimatedTokenCount);
  }, [prompt, systemMessage]);
  
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
        prompt,
        selectedModels: [selectedModel],
        streaming: true,
        systemMessage
      })
    });
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">LLM Testing Platform</h1>
      </div>
      
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Chat Interface</TabsTrigger>
          <TabsTrigger value="raw">Raw Prompt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-6">
          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* System message input */}
                <div className="space-y-2">
                  <Label htmlFor="system-message">System Message</Label>
                  <Textarea
                    id="system-message"
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                    className="h-24"
                    placeholder="System instructions for the assistant..."
                  />
                </div>
                
                {/* User prompt input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">User Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-36"
                    placeholder="Enter your prompt here..."
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
                    disabled={isLoading || !prompt.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Processing...' : 'Generate Response'}
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
        
        <TabsContent value="raw" className="space-y-6">
          {/* Raw prompt interface */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="raw-prompt">Raw Prompt</Label>
                <Textarea
                  id="raw-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-96"
                  placeholder="Enter your raw prompt here..."
                  disabled={isLoading}
                />
                
                {/* Token estimation */}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Estimated tokens: {formatNumber(estimateTokens(prompt))}</span>
                  {modelInfo && (
                    <span className={estimateTokens(prompt) > modelInfo.tokenLimit ? 'text-red-500 font-medium' : ''}>
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
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Processing...' : 'Generate Response'}
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