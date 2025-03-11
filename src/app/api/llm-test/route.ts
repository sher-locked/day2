import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Set the runtime environment
export const runtime = 'edge';

// Define the types for model information
type ModelInfo = {
  tokenLimit: number;
  outputLimit: number;
  family: string;
  inputPrice: number;  // USD per 1K tokens
  outputPrice: number; // USD per 1K tokens
};

type ModelInfoMap = {
  [key: string]: ModelInfo;
};

// Model information for reference, token limits, and pricing (USD per 1K tokens)
const MODEL_INFO: ModelInfoMap = {
  // GPT-4 models
  'gpt-4o': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015 },
  'gpt-4o-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.0015, outputPrice: 0.0060 },
  'gpt-4-turbo': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03 },
  'gpt-4': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06 },
  'gpt-4-0613': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06 },
  'gpt-4-0314': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06 },
  'gpt-4-32k': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12 },
  'gpt-4-32k-0613': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12 },
  
  // GPT-3.5 models
  'gpt-3.5-turbo': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015 },
  'gpt-3.5-turbo-0125': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015 },
  'gpt-3.5-turbo-1106': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002 },
  'gpt-3.5-turbo-0613': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002 },
  'gpt-3.5-turbo-16k': { tokenLimit: 16384, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002 },
  'gpt-3.5-turbo-instruct': { tokenLimit: 4097, outputLimit: 4097, family: 'GPT-3.5', inputPrice: 0.0015, outputPrice: 0.002 },
};

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

    // Initialize OpenAI client once
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      // Log API key status (without showing the actual key)
      console.log('OpenAI API key available:', !!process.env.OPENAI_API_KEY);

      // Create responses from multiple LLMs
      const responses = await Promise.all(
        selectedModels.map(async (model: string) => {
          try {
            console.log(`Testing model: ${model}`);

            const modelInfo = MODEL_INFO[model] || { 
              tokenLimit: 4096, 
              outputLimit: 4096,
              family: 'Unknown' 
            };

            // Check if the model supports JSON response format
            // GPT-3.5 Turbo Instruct doesn't support response_format
            const supportsJsonFormat = !model.includes('instruct');

            // Request JSON output from the model using completion approach
            const response = await openai.chat.completions.create({
              model,
              messages: [
                {
                  role: 'system',
                  content: 'You are an assistant that always responds in JSON format. Your response should be a valid JSON object.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              ...(supportsJsonFormat && { response_format: { type: 'json_object' } }),
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
          } catch (error) {
            console.error(`Error with model ${model}:`, error);
            return {
              model,
              modelInfo: MODEL_INFO[model] || { tokenLimit: 4096, outputLimit: 4096, family: 'Unknown' },
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
    } catch (openaiError) {
      console.error('OpenAI initialization error:', openaiError);
      return NextResponse.json(
        { error: 'Failed to initialize OpenAI client. Check API key configuration.' },
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
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    // Check if the model supports JSON response format
    const supportsJsonFormat = !model.includes('instruct');
    
    // Get model info
    const modelInfo = MODEL_INFO[model] || { 
      tokenLimit: 4096, 
      outputLimit: 4096,
      family: 'Unknown',
      inputPrice: 0.01,
      outputPrice: 0.01
    };
    
    // Create a custom streaming response
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          // Create the OpenAI streaming request
          const streamResponse = await openai.chat.completions.create({
            model,
            messages: [
              {
                role: 'system',
                content: systemMessage || 'You are an assistant that always responds in JSON format. Your response should be a valid JSON object.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            ...(supportsJsonFormat && { response_format: { type: 'json_object' } }),
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
          
          // Convert to INR (using a standard conversion rate - can be updated to fetch real-time rates)
          const usdToInr = 83.34; // Average rate as of 2023
          const totalCostInr = totalCost * usdToInr;
          
          // Send token usage data as a special marker at the end
          const usageData = {
            __usage: {
              prompt_tokens: promptTokens,
              completion_tokens: completionTokens,
              total_tokens: totalTokens,
              cost_usd: {
                input: inputCost,
                output: outputCost,
                total: totalCost
              },
              cost_inr: {
                input: inputCost * usdToInr,
                output: outputCost * usdToInr,
                total: totalCostInr
              }
            }
          };
          
          // Add a special marker to indicate this is usage data
          const usageMarker = "\n\n__USAGE_DATA__" + JSON.stringify(usageData);
          controller.enqueue(encoder.encode(usageMarker));
          
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
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