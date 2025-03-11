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
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to start streaming');
        }

        // Check if we got a streaming response
        if (!response.body) {
          throw new Error('Streaming response not supported');
        }

        // Get the reader from the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        // Signal that streaming has started
        if (onStreamStart) onStreamStart();

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the chunk and append to content
          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;
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