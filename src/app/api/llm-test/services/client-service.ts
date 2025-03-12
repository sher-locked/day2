import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Function to initialize clients
export function initializeClients() {
  // Check if API keys are available
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  
  // Log API key status
  logApiKeyStatus();
  
  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: openaiApiKey || '',
  });
  
  // Initialize Anthropic client only if API key is available
  const anthropic = anthropicApiKey 
    ? new Anthropic({
        apiKey: anthropicApiKey,
      })
    : null;
  
  return { 
    openai, 
    anthropic,
    // Add status flags for easy checking
    openaiAvailable: !!openaiApiKey,
    anthropicAvailable: !!anthropicApiKey
  };
}

// Log API key status for debug purposes
export function logApiKeyStatus() {
  console.log('OpenAI API key available:', !!process.env.OPENAI_API_KEY);
  console.log('Anthropic API key available:', !!process.env.ANTHROPIC_API_KEY);
} 