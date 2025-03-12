import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { ModelInfo } from '../types';
import { estimateTokens, createUsageData } from '../utils/token-utils';

// Handle streaming requests for both OpenAI and Anthropic
export async function handleStreamingRequest(
  prompt: string, 
  model: string, 
  systemMessage: string | null,
  modelInfo: ModelInfo,
  openai: OpenAI,
  anthropic: Anthropic | null
) {
  try {
    console.log(`Streaming request for model: ${model}`);
    
    // Validate API client availability
    if (modelInfo.provider === 'anthropic' && !anthropic) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Please add your API key to the environment variables.' },
        { status: 401 }
      );
    }
    
    if (modelInfo.provider === 'openai' && !openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add your API key to the environment variables.' },
        { status: 401 }
      );
    }
    
    // Create a custom streaming response
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          if (modelInfo.provider === 'anthropic') {
            if (!anthropic) {
              throw new Error('Anthropic API key not configured');
            }
            await processAnthropicStream(
              anthropic, 
              model, 
              prompt, 
              systemMessage, 
              modelInfo, 
              controller, 
              encoder
            );
          } else {
            await processOpenAiStream(
              openai, 
              model, 
              prompt, 
              systemMessage, 
              modelInfo, 
              controller, 
              encoder
            );
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

// Process Anthropic streaming
async function processAnthropicStream(
  anthropic: Anthropic,
  model: string,
  prompt: string,
  systemMessage: string | null,
  modelInfo: ModelInfo,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
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
    
    // Send token usage data as a special marker at the end
    const usageData = createUsageData(promptTokens, completionTokens, modelInfo);
    
    // Add a special marker to indicate this is usage data
    const usageMarker = "\n\n__USAGE_DATA__" + JSON.stringify(usageData);
    controller.enqueue(encoder.encode(usageMarker));
  } catch (anthropicError) {
    console.error(`Error with Anthropic model ${model}:`, anthropicError);
    const errorMessage = `Error with Anthropic model ${model}: ${anthropicError instanceof Error ? anthropicError.message : 'Unknown error'}`;
    controller.enqueue(encoder.encode(errorMessage));
    throw anthropicError;
  }
}

// Process OpenAI streaming
async function processOpenAiStream(
  openai: OpenAI,
  model: string,
  prompt: string,
  systemMessage: string | null,
  modelInfo: ModelInfo,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  try {
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
    
    // Send token usage data as a special marker at the end
    const usageData = createUsageData(promptTokens, completionTokens, modelInfo);
    
    // Add a special marker to indicate this is usage data
    const usageMarker = "\n\n__USAGE_DATA__" + JSON.stringify(usageData);
    controller.enqueue(encoder.encode(usageMarker));
  } catch (openaiError) {
    console.error(`Error with OpenAI model ${model}:`, openaiError);
    const errorMessage = `Error with OpenAI model ${model}: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`;
    controller.enqueue(encoder.encode(errorMessage));
    throw openaiError;
  }
} 