import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Set the runtime environment
export const runtime = 'edge';

// Define the types for model information
type ModelInfo = {
  tokenLimit: number;
  outputLimit: number;
  family: string;
};

type ModelInfoMap = {
  [key: string]: ModelInfo;
};

// Model information for reference and token limits
const MODEL_INFO: ModelInfoMap = {
  // GPT-4 models
  'gpt-4o': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4' },
  'gpt-4o-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4' },
  'gpt-4-turbo': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4' },
  'gpt-4': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4' },
  'gpt-4-0613': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4' },
  'gpt-4-0314': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4' },
  'gpt-4-32k': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4' },
  'gpt-4-32k-0613': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4' },
  
  // GPT-3.5 models
  'gpt-3.5-turbo': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5' },
  'gpt-3.5-turbo-0125': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5' },
  'gpt-3.5-turbo-1106': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5' },
  'gpt-3.5-turbo-0613': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5' },
  'gpt-3.5-turbo-16k': { tokenLimit: 16384, outputLimit: 4096, family: 'GPT-3.5' },
  'gpt-3.5-turbo-instruct': { tokenLimit: 4097, outputLimit: 4097, family: 'GPT-3.5' },
};

export async function POST(req: Request) {
  try {
    console.log('API route called');
    
    const body = await req.json();
    const { prompt, selectedModels } = body;

    console.log('Request body:', { prompt: prompt?.substring(0, 50) + '...', selectedModels });

    if (!prompt || !selectedModels || !Array.isArray(selectedModels) || selectedModels.length === 0) {
      console.error('Invalid request:', { prompt, selectedModels });
      return NextResponse.json(
        { error: 'Prompt and at least one model are required' },
        { status: 400 }
      );
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
            } catch (e) {
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