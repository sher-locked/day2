import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Set the runtime environment
export const runtime = 'edge';

// Define the types for model information
type ModelInfo = {
  tokenLimit: number;
  outputLimit: number;
  family: string;
  inputPrice: number;  // USD per 1K tokens
  outputPrice: number; // USD per 1K tokens
  isDeprecated?: boolean; // Optional flag for deprecated models
  provider: 'openai' | 'anthropic'; // Add provider information
};

type ModelInfoMap = {
  [key: string]: ModelInfo;
};

// Model information for reference, token limits, and pricing (USD per 1K tokens)
const MODEL_INFO: ModelInfoMap = {
  // O-Series models (reasoning models from Anthropic)
  'o1': { tokenLimit: 200000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.015, outputPrice: 0.06, provider: 'anthropic' },
  'o1-preview': { tokenLimit: 128000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.015, outputPrice: 0.06, provider: 'anthropic' },
  'o1-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.001, outputPrice: 0.004, provider: 'anthropic' },
  'o3-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.001, outputPrice: 0.004, provider: 'anthropic' },
  
  // GPT-4o models (from OpenAI)
  'gpt-4o-2024-11-20': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-2024-08-06': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-2024-05-13': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-mini-2024-07-18': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.00015, outputPrice: 0.0006, provider: 'openai' },
  'gpt-4o-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.00015, outputPrice: 0.0006, provider: 'openai' },
  
  // GPT-4 Turbo models (from OpenAI)
  'gpt-4-turbo-2024-04-09': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  'gpt-4-turbo': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  'gpt-4-vision-preview': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  
  // Base GPT-4 models (from OpenAI)
  'gpt-4': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, provider: 'openai' },
  'gpt-4-0613': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, isDeprecated: true, provider: 'openai' },
  'gpt-4-0314': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, isDeprecated: true, provider: 'openai' },
  'gpt-4-32k': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12, provider: 'openai' },
  'gpt-4-32k-0613': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12, isDeprecated: true, provider: 'openai' },
  
  // GPT-3.5 Turbo models (from OpenAI)
  'gpt-3.5-turbo-0125': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015, provider: 'openai' },
  'gpt-3.5-turbo': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015, provider: 'openai' },
  'gpt-3.5-turbo-1106': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, provider: 'openai' },
  'gpt-3.5-turbo-0613': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, isDeprecated: true, provider: 'openai' },
  'gpt-3.5-turbo-16k': { tokenLimit: 16384, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, isDeprecated: true, provider: 'openai' },
  'gpt-3.5-turbo-instruct': { tokenLimit: 4097, outputLimit: 4097, family: 'GPT-3.5', inputPrice: 0.0015, outputPrice: 0.002, provider: 'openai' },
};

// Function to initialize clients (moved outside to avoid repetition)
function initializeClients() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  });
  
  return { openai, anthropic };
}

// Non-streaming version of the API
export async function POST(req: Request) {
  try {
    console.log('API route called');
    
    const body = await req.json();
    const { prompt, selectedModels, streaming = false, systemMessage } = body;

    console.log('Request body:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      selectedModels,
      streaming,
      hasSystemMessage: !!systemMessage
    });

    if (!prompt || !selectedModels || !Array.isArray(selectedModels) || selectedModels.length === 0) {
      console.error('Invalid request:', { prompt, selectedModels });
      return NextResponse.json(
        { error: 'Prompt and at least one model are required' },
        { status: 400 }
      );
    }

    // Check for streaming mode
    if (streaming && selectedModels.length === 1) {
      return handleStreamingRequest(prompt, selectedModels[0], systemMessage);
    }

    // Validate model names against our valid models list
    const invalidModels = selectedModels.filter(model => !MODEL_INFO[model]);
    if (invalidModels.length > 0) {
      console.error('Invalid models requested:', invalidModels);
      return NextResponse.json(
        { error: `Invalid model(s): ${invalidModels.join(', ')}` },
        { status: 400 }
      );
    }

    // Initialize clients
    try {
      const { openai, anthropic } = initializeClients();
      
      // Log API key status (without showing the actual keys)
      console.log('OpenAI API key available:', !!process.env.OPENAI_API_KEY);
      console.log('Anthropic API key available:', !!process.env.ANTHROPIC_API_KEY);

      // Create responses from multiple LLMs
      const responses = await Promise.all(
        selectedModels.map(async (model: string) => {
          try {
            console.log(`Testing model: ${model}`);

            const modelInfo = MODEL_INFO[model] || { 
              tokenLimit: 4096, 
              outputLimit: 4096,
              family: 'Unknown',
              provider: 'openai'
            };

            // Handle different providers
            if (modelInfo.provider === 'anthropic') {
              // This is an Anthropic model (Claude)
              try {
                const response = await anthropic.messages.create({
                  model: model,
                  max_tokens: modelInfo.outputLimit,
                  system: systemMessage || 'You are a helpful assistant.',
                  messages: [
                    {
                      role: 'user',
                      content: prompt
                    }
                  ]
                });

                // Extract the response content
                let resultContent = '';
                if (response.content && response.content.length > 0) {
                  resultContent = response.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join('\n');
                }
                
                // Format the response to match OpenAI structure
                return {
                  model,
                  modelInfo,
                  response: { content: resultContent },
                  raw: resultContent,
                  usage: {
                    prompt_tokens: response.usage?.input_tokens || 0,
                    completion_tokens: response.usage?.output_tokens || 0,
                    total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
                  },
                  finish_reason: 'stop',
                  success: true
                };
              } catch (error) {
                console.error(`Error with Anthropic model ${model}:`, error);
                return {
                  model,
                  modelInfo,
                  response: null,
                  raw: null,
                  success: false,
                  error: error instanceof Error ? error.message : 'Error with Anthropic API request'
                };
              }
            } else {
              // This is an OpenAI model
              // Check if the model supports JSON response format
              // GPT-3.5 Turbo Instruct doesn't support response_format
              const supportsJsonFormat = !model.includes('instruct');

              // Determine system message and JSON format usage
              let finalSystemMessage = systemMessage || 'You are a helpful assistant.';
              let useJsonFormat = supportsJsonFormat;
              
              // If using JSON format, ensure system message contains "json"
              if (useJsonFormat && !finalSystemMessage.toLowerCase().includes('json')) {
                console.log('System message does not contain "json", appending JSON instructions');
                finalSystemMessage += ' Please respond in valid JSON format.';
              }

              // Request JSON output from the model using completion approach
              const response = await openai.chat.completions.create({
                model,
                messages: [
                  {
                    role: 'system',
                    content: finalSystemMessage
                  },
                  {
                    role: 'user',
                    content: prompt
                  }
                ],
                ...(useJsonFormat && { response_format: { type: 'json_object' } }),
                max_tokens: modelInfo.outputLimit,
              });

              const result = response.choices[0].message.content;
              const finish_reason = response.choices[0].finish_reason;
              const usage = response.usage;
              
              console.log(`Model ${model} responded successfully`);
              
              // Parse the JSON to validate it's properly formatted
              let parsedJson;
              try {
                parsedJson = JSON.parse(result || '{}');
              } catch (_error) {
                console.error(`Model ${model} didn't return valid JSON:`, result);
                // If JSON parsing fails, return the error
                return {
                  model,
                  modelInfo,
                  response: null,
                  raw: result,
                  usage,
                  finish_reason,
                  success: false,
                  error: "The model didn't return valid JSON"
                };
              }
              
              return {
                model,
                modelInfo,
                response: parsedJson,
                raw: result,
                usage,
                finish_reason,
                success: true
              };
            }
          } catch (error) {
            console.error(`Error with model ${model}:`, error);
            return {
              model,
              modelInfo: MODEL_INFO[model] || { tokenLimit: 4096, outputLimit: 4096, family: 'Unknown', provider: 'openai' },
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

// Simple manual streaming implementation
async function handleStreamingRequest(prompt: string, model: string, systemMessage: string | null) {
  try {
    console.log(`Streaming request for model: ${model}`);
    
    // Get model info
    const modelInfo = MODEL_INFO[model] || { 
      tokenLimit: 4096, 
      outputLimit: 4096,
      family: 'Unknown',
      inputPrice: 0.01,
      outputPrice: 0.01,
      provider: 'openai'
    };
    
    // Initialize clients
    const { openai, anthropic } = initializeClients();
    
    // Create a custom streaming response
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          if (modelInfo.provider === 'anthropic') {
            // Handle Anthropic streaming
            try {
              const stream = await anthropic.messages.create({
                model: model,
                max_tokens: modelInfo.outputLimit,
                system: systemMessage || 'You are a helpful assistant.',
                messages: [
                  {
                    role: 'user',
                    content: prompt
                  }
                ],
                stream: true
              });
              
              let completionTokens = 0;
              
              for await (const chunk of stream) {
                if (chunk.type === 'content_block_delta' && chunk.delta) {
                  // Handle different delta types safely
                  const content = 'text' in chunk.delta ? chunk.delta.text : '';
                  if (content) {
                    completionTokens += estimateTokens(content);
                    controller.enqueue(encoder.encode(content));
                  }
                }
              }
              
              // Get approximate token count for the prompt
              const promptTokens = estimateTokens(prompt);
              const totalTokens = promptTokens + completionTokens;
              
              // Calculate cost in USD
              const inputCost = (promptTokens / 1000) * modelInfo.inputPrice;
              const outputCost = (completionTokens / 1000) * modelInfo.outputPrice;
              const totalCost = inputCost + outputCost;
              
              // Convert to INR (using a standard conversion rate)
              const usdToInr = 83.34;
              const totalCostInr = totalCost * usdToInr;
              
              // Send token usage data as a special marker at the end
              const usageData = {
                __usage: {
                  prompt_tokens: promptTokens,
                  completion_tokens: completionTokens,
                  total_tokens: totalTokens,
                  cost_usd: {
                    input: parseFloat(inputCost.toFixed(4)),
                    output: parseFloat(outputCost.toFixed(4)),
                    total: parseFloat(totalCost.toFixed(4))
                  },
                  cost_inr: {
                    input: parseFloat((inputCost * usdToInr).toFixed(2)),
                    output: parseFloat((outputCost * usdToInr).toFixed(2)),
                    total: parseFloat(totalCostInr.toFixed(2))
                  }
                }
              };
              
              // Add a special marker to indicate this is usage data
              const usageMarker = "\n\n__USAGE_DATA__" + JSON.stringify(usageData);
              controller.enqueue(encoder.encode(usageMarker));
            } catch (anthropicError) {
              console.error(`Error with Anthropic model ${model}:`, anthropicError);
              const errorMessage = `Error with Anthropic model ${model}: ${anthropicError instanceof Error ? anthropicError.message : 'Unknown error'}`;
              controller.enqueue(encoder.encode(errorMessage));
              controller.close();
              return;
            }
          } else {
            // Handle OpenAI streaming
            // Check if the model supports JSON response format
            const supportsJsonFormat = !model.includes('instruct');
            
            // Determine if we need to use JSON response format
            // and ensure system message contains "json" if using JSON format
            let finalSystemMessage = systemMessage || 'You are a helpful assistant.';
            let useJsonFormat = supportsJsonFormat;
            
            // If using JSON format, ensure system message contains "json"
            if (useJsonFormat && !finalSystemMessage.toLowerCase().includes('json')) {
              console.log('System message does not contain "json", appending JSON instructions');
              finalSystemMessage += ' Please respond in valid JSON format.';
            }
            
            // Create the OpenAI streaming request
            try {
              const streamResponse = await openai.chat.completions.create({
                model,
                messages: [
                  {
                    role: 'system',
                    content: finalSystemMessage
                  },
                  {
                    role: 'user',
                    content: prompt
                  }
                ],
                ...(useJsonFormat && { response_format: { type: 'json_object' } }),
                max_tokens: modelInfo.outputLimit,
                stream: true,
              });
              
              let completionTokens = 0;
              
              // Handle the streaming response
              for await (const chunk of streamResponse) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                  completionTokens += estimateTokens(content);
                  controller.enqueue(encoder.encode(content));
                }
              }
              
              // Get approximate token count for the prompt
              const promptTokens = estimateTokens(prompt);
              const totalTokens = promptTokens + completionTokens;
              
              // Calculate cost in USD
              const inputCost = (promptTokens / 1000) * modelInfo.inputPrice;
              const outputCost = (completionTokens / 1000) * modelInfo.outputPrice;
              const totalCost = inputCost + outputCost;
              
              // Convert to INR (using a standard conversion rate)
              const usdToInr = 83.34;
              const totalCostInr = totalCost * usdToInr;
              
              // Send token usage data as a special marker at the end
              const usageData = {
                __usage: {
                  prompt_tokens: promptTokens,
                  completion_tokens: completionTokens,
                  total_tokens: totalTokens,
                  cost_usd: {
                    input: parseFloat(inputCost.toFixed(4)),
                    output: parseFloat(outputCost.toFixed(4)),
                    total: parseFloat(totalCost.toFixed(4))
                  },
                  cost_inr: {
                    input: parseFloat((inputCost * usdToInr).toFixed(2)),
                    output: parseFloat((outputCost * usdToInr).toFixed(2)),
                    total: parseFloat(totalCostInr.toFixed(2))
                  }
                }
              };
              
              // Add a special marker to indicate this is usage data
              const usageMarker = "\n\n__USAGE_DATA__" + JSON.stringify(usageData);
              controller.enqueue(encoder.encode(usageMarker));
            } catch (openaiError) {
              console.error(`Error with OpenAI model ${model}:`, openaiError);
              const errorMessage = `Error with OpenAI model ${model}: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`;
              controller.enqueue(encoder.encode(errorMessage));
              controller.close();
              return;
            }
          }
          
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          // Send the error as a message to the client
          const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });

    // Return the stream response
    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in streaming request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Simple function to estimate tokens (very approximate)
function estimateTokens(text: string): number {
  if (!text) return 0;
  // A very simple approximation: about 4 characters per token for English text
  return Math.ceil(text.length / 4);
} 