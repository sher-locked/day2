import { useState, useCallback } from 'react';
import { UsageData } from '@/lib/utils/tokenCalculation';

type HookOptions = {
  onComplete?: () => void;
};

// Define types for fetch request options
export type StreamingOptions = RequestInit & {
  body?: string;
};

export function useStreamingResponse(hookOptions: HookOptions = {}) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [responseData, setResponseData] = useState<Record<string, unknown> | null>(null);
  const [stage, setStage] = useState<'connecting' | 'thinking' | 'streaming' | 'complete' | 'error'>('connecting');

  // Function to reset state for a new streaming session
  const reset = useCallback(() => {
    setContent('');
    setError(null);
    setUsageData(null);
    setResponseData(null);
    setStage('connecting');
  }, []);

  // Function to extract usage data from content if it exists
  const extractUsageData = useCallback((text: string): { content: string; usageData: UsageData | null } => {
    const usageMarker = "\n\n__USAGE_DATA__";
    const markerIndex = text.indexOf(usageMarker);
    
    if (markerIndex === -1) {
      return { content: text, usageData: null };
    }
    
    const contentPart = text.substring(0, markerIndex);
    const usageDataJson = text.substring(markerIndex + usageMarker.length);
    
    try {
      const parsedData = JSON.parse(usageDataJson);
      setResponseData(parsedData);
      return { 
        content: contentPart, 
        usageData: parsedData.__usage 
      };
    } catch (e) {
      console.error('Failed to parse usage data:', e);
      return { content: contentPart, usageData: null };
    }
  }, []);

  // Main function to start streaming
  const startStreaming = useCallback(
    async (url: string, options: StreamingOptions) => {
      try {
        reset();
        setIsLoading(true);
        setStage('connecting');

        // Prepare the request
        const response = await fetch(url, options);

        if (!response.ok) {
          setStage('error');
          // Try to get error message from response
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to start streaming: ${response.status} ${response.statusText}`);
          } catch (_jsonError) {
            throw new Error(`Failed to start streaming: ${response.status} ${response.statusText}`);
          }
        }

        // Check if we got a streaming response
        if (!response.body) {
          setStage('error');
          throw new Error('Streaming response not supported by your browser');
        }

        // Signal that streaming has started - thinking stage
        setStage('thinking');
        
        // Small delay to show the thinking stage before moving to streaming
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStage('streaming');

        // Process the stream with the ReadableStream API
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        // Process the stream chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode and process chunk
          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;
          
          // Extract usage data if present, but only update content
          const { content, usageData } = extractUsageData(accumulatedContent);
          setContent(content);
          if (usageData) {
            setUsageData(usageData);
          }
        }

        // Ensure we have the complete content
        const finalChunk = decoder.decode();
        if (finalChunk) {
          accumulatedContent += finalChunk;
          // Extract final usage data
          const { content, usageData } = extractUsageData(accumulatedContent);
          setContent(content);
          if (usageData) {
            setUsageData(usageData);
          }
        }

        // Signal that streaming has completed
        setStage('complete');
        if (hookOptions.onComplete) {
          hookOptions.onComplete();
        }
      } catch (err) {
        console.error('Streaming error:', err);
        setStage('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    },
    [reset, extractUsageData, hookOptions]
  );

  return {
    content,
    isLoading,
    error,
    stage,
    usageData,
    responseData,
    startStreaming,
    reset,
  };
} 