import Anthropic from '@anthropic-ai/sdk';
import { ApiResponseModel, ModelInfo } from '../types';

// Process Anthropic non-streaming requests
export async function processAnthropicRequest(
  anthropic: Anthropic,
  model: string,
  prompt: string,
  systemMessage: string | null,
  modelInfo: ModelInfo
): Promise<ApiResponseModel> {
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
} 