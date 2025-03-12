import { OpenAI } from 'openai';
import { ApiResponseModel, ModelInfo } from '../types';

// Process OpenAI non-streaming requests
export async function processOpenAiRequest(
  openai: OpenAI,
  model: string,
  prompt: string,
  systemMessage: string | null,
  modelInfo: ModelInfo
): Promise<ApiResponseModel> {
  try {
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

    // Request JSON output from the model
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
      
      return {
        model,
        modelInfo,
        response: parsedJson,
        raw: result,
        usage,
        finish_reason,
        success: true
      };
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
  } catch (error) {
    console.error(`Error with OpenAI model ${model}:`, error);
    return {
      model,
      modelInfo,
      response: null,
      raw: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 