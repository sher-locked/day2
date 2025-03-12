'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAnthropicPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-anthropic');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to connect to Anthropic API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Anthropic API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Test your connection to the Anthropic API to make sure it's properly configured.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Testing connection...' : 'Test Anthropic API Connection'}
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-200 dark:border-red-800">
              <h3 className="text-red-700 dark:text-red-400 font-medium mb-2">Connection Error</h3>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 rounded text-sm text-red-800 dark:text-red-200">
                <p className="font-medium mb-1">Troubleshooting:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Check if your API key is correctly formatted in the .env.local file</li>
                  <li>Make sure the API key is valid and not expired</li>
                  <li>Restart the server to pick up environment changes</li>
                </ol>
              </div>
            </div>
          )}
          
          {result && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md border border-green-200 dark:border-green-800">
              <h3 className="text-green-700 dark:text-green-400 font-medium mb-2">
                {result.success ? '✅ Connection Successful' : '❌ Connection Failed'}
              </h3>
              
              {result.success ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Model:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{result.model}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Response:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{result.response}"</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Input Tokens</p>
                      <p className="text-sm font-medium">{result.usage.input_tokens}</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Output Tokens</p>
                      <p className="text-sm font-medium">{result.usage.output_tokens}</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Total Tokens</p>
                      <p className="text-sm font-medium">{result.usage.total_tokens}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-green-600 dark:text-green-300 font-medium">
                    Your Anthropic API connection is working correctly!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {result.error || 'Unknown error'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 