'use client';

import { useState } from 'react';
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

const formSchema = z.object({
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
});

// Define the types for model results
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
              <TabsTrigger value="results" disabled={results.length === 0}>
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

                  <Button type="submit" disabled={isLoading || selectedModels.length === 0}>
                    {isLoading ? 'Testing...' : 'Run Test'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="results">
              {results.length > 0 ? (
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
                <div className="text-center py-10">
                  <p className="text-gray-500">No results yet. Run a test first.</p>
                  <Button variant="outline" onClick={() => setActiveTab('prompt')} className="mt-4">
                    Go to Prompt
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 