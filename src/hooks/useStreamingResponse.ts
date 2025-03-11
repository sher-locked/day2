import { useState, useCallback } from 'react';

type StreamingOptions = {
  prompt: string;
  selectedModels: string[];
  streaming: boolean;
};

export function useStreamingResponse() {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to reset state for a new streaming session
  const reset = useCallback(() => {
    setContent('');
    setError(null);
  }, []);

  // Main function to start streaming
  const startStreaming = useCallback(
    async (options: StreamingOptions, onStreamStart?: () => void, onStreamEnd?: () => void) => {
      try {
        reset();
        setIsLoading(true);

        // Prepare the request
        const response = await fetch('/api/llm-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options),
        });

        if (!response.ok) {
          // Try to get error message from response
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to start streaming');
          } catch (jsonError) {
            throw new Error(`Failed to start streaming: ${response.status} ${response.statusText}`);
          }
        }

        // Check if we got a streaming response
        if (!response.body) {
          throw new Error('Streaming response not supported by your browser');
        }

        // Signal that streaming has started
        if (onStreamStart) onStreamStart();

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
          setContent(accumulatedContent);
        }

        // Ensure we have the complete content
        const finalChunk = decoder.decode();
        if (finalChunk) {
          accumulatedContent += finalChunk;
          setContent(accumulatedContent);
        }

        // Signal that streaming has ended
        if (onStreamEnd) onStreamEnd();
      } catch (err) {
        console.error('Streaming error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    },
    [reset]
  );

  return {
    content,
    isLoading,
    error,
    startStreaming,
    reset,
  };
} 