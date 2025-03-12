import { ModelInfo, ModelInfoMap } from '@/app/api/llm-test/types';

// Model information for reference, token limits, and pricing (USD per 1K tokens)
export const MODEL_INFO: ModelInfoMap = {
  // Claude models (from Anthropic)
  'claude-3-5-sonnet-20240620': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.003, outputPrice: 0.015, provider: 'anthropic' },
  'claude-3-opus-20240229': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.015, outputPrice: 0.075, provider: 'anthropic' },
  'claude-3-haiku-20240307': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.00025, outputPrice: 0.00125, provider: 'anthropic' },
  
  // GPT-4 models (from OpenAI)
  'gpt-4': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, provider: 'openai' },
  'gpt-4-32k': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12, provider: 'openai' },
  'gpt-4-turbo': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  
  // GPT-4o models (from OpenAI)
  'gpt-4o': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4o', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-mini': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4o', inputPrice: 0.0015, outputPrice: 0.0045, provider: 'openai' },
  
  // GPT-3.5 models (from OpenAI)
  'gpt-3.5-turbo': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015, provider: 'openai' },
  'gpt-3.5-turbo-16k': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, provider: 'openai' },
};

// List of available models for the UI - only include working models
export const availableModels = [
  // Anthropic Claude models
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620', category: 'Claude', provider: 'anthropic' },
  { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229', category: 'Claude', provider: 'anthropic' },
  { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307', category: 'Claude', provider: 'anthropic' },
  
  // OpenAI GPT-4o models
  { label: 'GPT-4o', value: 'gpt-4o', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4o Mini', value: 'gpt-4o-mini', category: 'GPT-4', provider: 'openai' },
  
  // OpenAI GPT-4 models
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4', value: 'gpt-4', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4 32K', value: 'gpt-4-32k', category: 'GPT-4', provider: 'openai' },
  
  // OpenAI GPT-3.5 models
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', category: 'GPT-3.5', provider: 'openai' },
  { label: 'GPT-3.5 Turbo 16K', value: 'gpt-3.5-turbo-16k', category: 'GPT-3.5', provider: 'openai' },
];

// Get model info with fallback to default values
export function getModelInfo(model: string): ModelInfo {
  return MODEL_INFO[model] || { 
    tokenLimit: 4096, 
    outputLimit: 4096,
    family: 'Unknown',
    inputPrice: 0.01,
    outputPrice: 0.01,
    provider: 'openai'
  };
} 