import { NextResponse } from 'next/server';
import { LlmApiRequest } from './types';
import { initializeClients, logApiKeyStatus } from './services/client-service';
import { getModelInfo } from './services/model-info';
import { processOpenAiRequest } from './services/openai-service';
import { processAnthropicRequest } from './services/anthropic-service';
import { handleStreamingRequest } from './services/streaming-service';

// Set the runtime environment
export const runtime = 'edge';

// Main API route handler
export async function POST(req: Request) {
  try {
    console.log('API route called');
    
    const body: LlmApiRequest = await req.json();
    const { prompt, selectedModels, streaming = false, systemMessage } = body;

    console.log('Request body:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      selectedModels,
      streaming,
      hasSystemMessage: !!systemMessage
    });

    // Validate request parameters
    if (!prompt || !selectedModels || !Array.isArray(selectedModels) || selectedModels.length === 0) {
      console.error('Invalid request:', { prompt, selectedModels });
      return NextResponse.json(
        { error: 'Prompt and at least one model are required' },
        { status: 400 }
      );
    }

    // Initialize clients
    try {
      const { openai, anthropic, openaiAvailable, anthropicAvailable } = initializeClients();

      // Check if selected models are available based on API key status
      const unavailableModels = selectedModels.filter(model => {
        const modelInfo = getModelInfo(model);
        return (modelInfo.provider === 'anthropic' && !anthropicAvailable) || 
               (modelInfo.provider === 'openai' && !openaiAvailable);
      });

      if (unavailableModels.length > 0) {
        const missingProviders = [];
        if (unavailableModels.some(model => getModelInfo(model).provider === 'anthropic') && !anthropicAvailable) {
          missingProviders.push('Anthropic');
        }
        if (unavailableModels.some(model => getModelInfo(model).provider === 'openai') && !openaiAvailable) {
          missingProviders.push('OpenAI');
        }
        
        return NextResponse.json(
          { 
            error: `API key missing for ${missingProviders.join(' and ')}. Cannot use models: ${unavailableModels.join(', ')}`,
            missingProviders
          },
          { status: 401 }
        );
      }

      // Check for streaming mode
      if (streaming && selectedModels.length === 1) {
        const model = selectedModels[0];
        const modelInfo = getModelInfo(model);
        
        return handleStreamingRequest(prompt, model, systemMessage || null, modelInfo, openai, anthropic);
      }

      // Validate model names against our valid models list
      const invalidModels = selectedModels.filter(model => !getModelInfo(model).family);
      if (invalidModels.length > 0) {
        console.error('Invalid models requested:', invalidModels);
        return NextResponse.json(
          { error: `Invalid model(s): ${invalidModels.join(', ')}` },
          { status: 400 }
        );
      }

      // Create responses from multiple LLMs
      const responses = await Promise.all(
        selectedModels.map(async (model: string) => {
          try {
            console.log(`Testing model: ${model}`);
            const modelInfo = getModelInfo(model);

            // Handle different providers
            if (modelInfo.provider === 'anthropic') {
              if (!anthropic) {
                throw new Error('Anthropic API key not configured');
              }
              return processAnthropicRequest(anthropic, model, prompt, systemMessage || null, modelInfo);
            } else {
              if (!openai) {
                throw new Error('OpenAI API key not configured');
              }
              return processOpenAiRequest(openai, model, prompt, systemMessage || null, modelInfo);
            }
          } catch (error) {
            console.error(`Error with model ${model}:`, error);
            return {
              model,
              modelInfo: getModelInfo(model),
              response: null,
              raw: null,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );

      console.log(`Request completed successfully for ${selectedModels.length} models`);
      return NextResponse.json({ results: responses });
    } catch (clientError) {
      console.error('Client initialization error:', clientError);
      return NextResponse.json(
        { error: 'Failed to initialize API clients. Check API key configuration.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 