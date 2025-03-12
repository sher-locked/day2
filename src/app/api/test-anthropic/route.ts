import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

export async function GET() {
  try {
    console.log('Testing Anthropic API connection...');
    
    // Check if API key is available
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!anthropicApiKey) {
      console.error('Anthropic API key is not configured in environment variables');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Anthropic API key not found in environment variables',
          apiKeyConfigured: false
        },
        { status: 401 }
      );
    }
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });
    
    // Make a simple test request
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      system: 'You are a helpful assistant.',
      messages: [
        {
          role: 'user',
          content: 'Say hello in one sentence'
        }
      ]
    });
    
    // Extract text content from response
    let responseText = '';
    if (response.content && response.content.length > 0) {
      const textBlocks = response.content.filter(block => block.type === 'text');
      if (textBlocks.length > 0 && 'text' in textBlocks[0]) {
        responseText = textBlocks[0].text;
      }
    }
    
    // Log successful response
    console.log('Anthropic API connection successful!');
    console.log('Model used:', response.model);
    console.log('Response:', responseText);
    
    // Return success response
    return NextResponse.json({
      success: true,
      apiKeyConfigured: true,
      model: response.model,
      response: responseText,
      usage: {
        input_tokens: response.usage?.input_tokens,
        output_tokens: response.usage?.output_tokens,
        total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
      }
    });
    
  } catch (error) {
    console.error('Error testing Anthropic API connection:', error);
    
    // Determine if the error is related to authentication
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isAuthError = 
      errorMessage.includes('authentication') || 
      errorMessage.includes('auth') || 
      errorMessage.includes('apiKey') ||
      errorMessage.includes('API key');
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        apiKeyConfigured: true,
        isAuthError: isAuthError
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
} 