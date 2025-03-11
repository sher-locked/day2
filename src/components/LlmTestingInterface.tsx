'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useStreamingResponse } from '@/hooks/useStreamingResponse';

// Define a new module for ThinkingIndicator component
function ThinkingIndicator({ 
  stage, 
  model, 
  startTime 
}: { 
  stage: 'connecting' | 'thinking' | 'streaming' | 'complete' | 'error'; 
  model: string; 
  startTime: number 
}) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Model: {model}</h3>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Time: {formatTime(elapsedTime)}
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
    </div>
  );
}

// Define a new module for StreamingDisplay component
function StreamingDisplay({ 
  content, 
  model, 
  isComplete 
}: { 
  content: string; 
  model: string; 
  isComplete: boolean 
}) {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [parsedJson, setParsedJson] = useState<any>(null);
  
  // Try to parse the JSON content when streaming is complete
  useEffect(() => {
    if (isComplete && content) {
      try {
        const parsed = JSON.parse(content);
        setParsedJson(parsed);
        setJsonError(null);
      } catch (e) {
        setJsonError('Response is not valid JSON');
        setParsedJson(null);
      }
    }
  }, [isComplete, content]);
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-medium mb-2">Streaming Response from {model}:</h3>
        <div className="relative">
          <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto max-h-96 text-sm whitespace-pre-wrap">
            {content || (
              <span className="text-slate-400">Waiting for response...</span>
            )}
            {!isComplete && (
              <span className="animate-pulse">▌</span>
            )}
          </pre>
          {isComplete && (
            <div className="absolute top-2 right-2">
              {jsonError ? (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Invalid JSON</span>
              ) : (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Valid JSON</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isComplete && parsedJson && (
        <div>
          <h3 className="text-md font-medium mb-2">Parsed JSON:</h3>
          <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto max-h-96 text-sm">
            {JSON.stringify(parsedJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const formSchema = z.object({
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
});

// Define the types for model information
type ModelInfo = {
  tokenLimit: number;
  outputLimit: number;
  family: string;
};

type TokenUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type TestResult = {
  model: string;
  modelInfo?: ModelInfo;
  response: any;
  raw: string;
  usage?: TokenUsage;
  finish_reason?: string;
  success: boolean;
  error?: string;
};

// Updated availableModels array with correct OpenAI model identifiers
const availableModels = [
  // GPT-4 models
  { label: 'GPT-4o', value: 'gpt-4o', category: 'GPT-4' },
  { label: 'GPT-4o Mini', value: 'gpt-4o-mini', category: 'GPT-4' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo', category: 'GPT-4' },
  { label: 'GPT-4', value: 'gpt-4', category: 'GPT-4' },
  { label: 'GPT-4 0613', value: 'gpt-4-0613', category: 'GPT-4' },
  { label: 'GPT-4 0314', value: 'gpt-4-0314', category: 'GPT-4' },
  { label: 'GPT-4 32k', value: 'gpt-4-32k', category: 'GPT-4' },
  { label: 'GPT-4 32k 0613', value: 'gpt-4-32k-0613', category: 'GPT-4' },
  
  // GPT-3.5 models
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 0125', value: 'gpt-3.5-turbo-0125', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 1106', value: 'gpt-3.5-turbo-1106', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 0613', value: 'gpt-3.5-turbo-0613', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 16k', value: 'gpt-3.5-turbo-16k', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo Instruct', value: 'gpt-3.5-turbo-instruct', category: 'GPT-3.5' },
];

export default function LlmTestingInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('prompt');
  const [modelError, setModelError] = useState<string | null>(null);
  
  // Streaming mode states
  const [streamingMode, setStreamingMode] = useState(false);
  const [streamingStage, setStreamingStage] = useState<'connecting' | 'thinking' | 'streaming' | 'complete' | 'error'>('connecting');
  const [streamingStartTime, setStreamingStartTime] = useState(Date.now());
  
  // Use the streaming hook
  const { 
    content: streamingContent, 
    isLoading: isStreaming, 
    error: streamingError,
    startStreaming
  } = useStreamingResponse();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const handleModelSelection = (model: string) => {
    setSelectedModels([model]);
    setModelError(null);
  };

  const toggleStreamingMode = () => {
    setStreamingMode(!streamingMode);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // For streaming mode, handle differently
    if (streamingMode) {
      try {
        if (selectedModels.length === 0) {
          setModelError('Please select a model');
          return;
        }
        
        if (selectedModels.length > 1) {
          setModelError('Streaming mode only supports one model at a time');
          return;
        }
        
        setActiveTab('results');
        setStreamingStage('connecting');
        setStreamingStartTime(Date.now());
        
        // Start streaming with a slight delay to allow UI updates
        setTimeout(() => {
          setStreamingStage('thinking');
          
          startStreaming({
            prompt: values.prompt,
            selectedModels: selectedModels,
            streaming: true
          }, () => {
            // When streaming starts
            setStreamingStage('streaming');
          }, () => {
            // When streaming completes
            setStreamingStage('complete');
          });
        }, 1000);
        
      } catch (error) {
        console.error('Error in streaming mode:', error);
        setStreamingStage('error');
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
      
      return;
    }
    
    // Regular non-streaming mode
    try {
      if (selectedModels.length === 0) {
        setModelError('Please select at least one model');
        return;
      }
      
      setIsLoading(true);
      setResults([]);
      
      console.log('Sending request with models:', selectedModels);
      
      const response = await fetch('/api/llm-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: values.prompt,
          selectedModels,
          streaming: false
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API error:', responseData);
        throw new Error(responseData.error || 'Failed to test LLMs');
      }

      // Add better validation of the response format
      if (!responseData.results || !Array.isArray(responseData.results)) {
        throw new Error('Invalid response format from API');
      }
      
      setResults(responseData.results);
      setActiveTab('results');
    } catch (error) {
      console.error('Error testing LLMs:', error);
      // Display the error to the user
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatJSON = (json: any) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (error) {
      return 'Error formatting JSON';
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>LLM JSON Response Testing</CardTitle>
          <CardDescription>
            Test how different LLMs respond to prompts requiring JSON output
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="results" disabled={results.length === 0 && !streamingMode}>
                Results{results.length > 0 ? ` (${results.length})` : ''}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your prompt here. The LLM will be instructed to respond in JSON format."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Make sure your prompt is clear about the JSON structure you expect.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Select Models <span className="text-red-500">*</span></FormLabel>
                    
                    {/* Group models by category */}
                    {['GPT-4', 'GPT-3.5'].map((category) => (
                      <div key={category} className="mt-4">
                        <h3 className="text-sm font-medium mb-2">{category} Models</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableModels
                            .filter((model) => model.category === category)
                            .map((model) => (
                              <Button
                                key={model.value}
                                type="button"
                                variant={selectedModels.includes(model.value) ? 'default' : 'outline'}
                                onClick={() => handleModelSelection(model.value)}
                                className={`justify-start text-sm ${selectedModels.includes(model.value) ? 'ring-2 ring-primary' : ''}`}
                                title={model.value}
                              >
                                {selectedModels.includes(model.value) && (
                                  <span className="mr-2">✓</span>
                                )}
                                {model.label}
                              </Button>
                            ))}
                        </div>
                      </div>
                    ))}
                    
                    {modelError && (
                      <div className="mt-2 p-2 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                        {modelError}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={streamingMode} 
                        onChange={toggleStreamingMode} 
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span>Enable token-by-token streaming (only works with single model)</span>
                    </label>
                  </div>

                  <Button type="submit" disabled={isLoading || isStreaming}>
                    {isLoading ? 'Testing...' : streamingMode ? 'Start Streaming' : 'Run Test'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="results">
              {/* Streaming Results Display */}
              {streamingMode && (
                <div className="space-y-8">
                  <ThinkingIndicator 
                    stage={streamingStage} 
                    model={selectedModels[0] ? availableModels.find(m => m.value === selectedModels[0])?.label || selectedModels[0] : 'Unknown'} 
                    startTime={streamingStartTime}
                  />
                  
                  <StreamingDisplay
                    content={streamingContent}
                    model={selectedModels[0] ? availableModels.find(m => m.value === selectedModels[0])?.label || selectedModels[0] : 'Unknown'}
                    isComplete={streamingStage === 'complete'}
                  />
                  
                  {streamingError && (
                    <div className="p-4 bg-red-50 text-red-800 rounded-md">
                      <p className="font-semibold">Error:</p>
                      <p>{streamingError}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Non-Streaming Results Display */}
              {!streamingMode && results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{availableModels.find(m => m.value === result.model)?.label || result.model}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.success ? 'Success' : 'Error'}
                          </span>
                        </CardTitle>
                        {result.modelInfo && (
                          <CardDescription>
                            <div className="flex flex-wrap gap-2 text-xs mt-1">
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                Family: {result.modelInfo.family}
                              </span>
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                Max tokens: {result.modelInfo.tokenLimit}
                              </span>
                              {result.usage && (
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  Used: {result.usage.total_tokens} tokens
                                </span>
                              )}
                              {result.finish_reason && (
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  Finish reason: {result.finish_reason}
                                </span>
                              )}
                            </div>
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {result.success ? (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Parsed JSON Response:</h4>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96 text-sm">
                                {formatJSON(result.response)}
                              </pre>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Raw Response:</h4>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-40 text-xs">
                                {result.raw}
                              </pre>
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-500">
                            <p className="font-semibold">Error:</p>
                            <p>{result.error}</p>
                            {result.raw && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Raw Response:</h4>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-40 text-xs">
                                  {result.raw}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                !streamingMode && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No results yet. Run a test first.</p>
                    <Button variant="outline" onClick={() => setActiveTab('prompt')} className="mt-4">
                      Go to Prompt
                    </Button>
                  </div>
                )
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 