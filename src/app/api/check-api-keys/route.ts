import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Check if API keys are available
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    
    // Log API key status for debugging (don't log the actual keys)
    console.log('API key status check:');
    console.log('OpenAI API key available:', !!openaiApiKey);
    console.log('Anthropic API key available:', !!anthropicApiKey);
    
    // Return the availability status
    return NextResponse.json({
      openaiAvailable: !!openaiApiKey,
      anthropicAvailable: !!anthropicApiKey
    });
  } catch (error) {
    console.error('Error checking API keys:', error);
    return NextResponse.json(
      { error: 'Failed to check API keys' },
      { status: 500 }
    );
  }
} 