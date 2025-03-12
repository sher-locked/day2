import { ModelInfo, ModelInfoMap } from '../types';

// Model information for reference, token limits, and pricing (USD per 1K tokens)
export const MODEL_INFO: ModelInfoMap = {
  // Claude models (from Anthropic) - only include working models
  'claude-3-5-sonnet-20240620': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.003, outputPrice: 0.015, provider: 'anthropic' },
  'claude-3-opus-20240229': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.015, outputPrice: 0.075, provider: 'anthropic' },
  'claude-3-haiku-20240307': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.00025, outputPrice: 0.00125, provider: 'anthropic' },
};

// List of available models for the API
export const availableModels = [
  'claude-3-5-sonnet-20240620',
  'claude-3-opus-20240229',
  'claude-3-haiku-20240307'
];

// Get model info with fallback to default values
export function getModelInfo(model: string): ModelInfo {
  return MODEL_INFO[model] || { 
    tokenLimit: 4096, 
    outputLimit: 4096,
    family: 'Unknown',
    inputPrice: 0.01,
    outputPrice: 0.01,
    provider: 'anthropic'
  };
} 