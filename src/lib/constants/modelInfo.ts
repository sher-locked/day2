// Define the types for model information
export type ModelInfo = {
  tokenLimit: number;
  outputLimit: number;
  family: string;
  inputPrice: number;  // USD per 1K tokens
  outputPrice: number; // USD per 1K tokens
  isDeprecated?: boolean; // Optional flag for deprecated models
  provider: 'openai' | 'anthropic'; // Provider of the model
};

export type ModelInfoMap = {
  [key: string]: ModelInfo;
};

// Model information for reference, token limits, and pricing (USD per 1K tokens)
export const MODEL_INFO: ModelInfoMap = {
  // O-Series models (reasoning models from Anthropic)
  'o1': { tokenLimit: 200000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.015, outputPrice: 0.06, provider: 'anthropic' },
  'o1-preview': { tokenLimit: 128000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.015, outputPrice: 0.06, provider: 'anthropic' },
  'o1-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.001, outputPrice: 0.004, provider: 'anthropic' },
  'o3-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'O-Series', inputPrice: 0.001, outputPrice: 0.004, provider: 'anthropic' },
  
  // Claude models (from Anthropic)
  'claude-3-5-sonnet-20240620': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.003, outputPrice: 0.015, provider: 'anthropic' },
  'claude-3-opus-20240229': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.015, outputPrice: 0.075, provider: 'anthropic' },
  'claude-3-sonnet-20240229': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.003, outputPrice: 0.015, provider: 'anthropic' },
  'claude-3-haiku-20240307': { tokenLimit: 200000, outputLimit: 4096, family: 'Claude', inputPrice: 0.00025, outputPrice: 0.00125, provider: 'anthropic' },
  
  // GPT-4o models (from OpenAI)
  'gpt-4o-2024-11-20': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-2024-08-06': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-2024-05-13': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015, provider: 'openai' },
  'gpt-4o-mini-2024-07-18': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.00015, outputPrice: 0.0006, provider: 'openai' },
  'gpt-4o-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.00015, outputPrice: 0.0006, provider: 'openai' },
  
  // GPT-4 Turbo models (from OpenAI)
  'gpt-4-turbo-2024-04-09': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  'gpt-4-turbo': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  'gpt-4-vision-preview': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03, provider: 'openai' },
  
  // Base GPT-4 models (from OpenAI)
  'gpt-4': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, provider: 'openai' },
  'gpt-4-0613': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, isDeprecated: true, provider: 'openai' },
  'gpt-4-0314': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06, isDeprecated: true, provider: 'openai' },
  'gpt-4-32k': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12, provider: 'openai' },
  'gpt-4-32k-0613': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12, isDeprecated: true, provider: 'openai' },
  
  // GPT-3.5 Turbo models (from OpenAI)
  'gpt-3.5-turbo-0125': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015, provider: 'openai' },
  'gpt-3.5-turbo': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015, provider: 'openai' },
  'gpt-3.5-turbo-1106': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, provider: 'openai' },
  'gpt-3.5-turbo-0613': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, isDeprecated: true, provider: 'openai' },
  'gpt-3.5-turbo-16k': { tokenLimit: 16384, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002, isDeprecated: true, provider: 'openai' },
  'gpt-3.5-turbo-instruct': { tokenLimit: 4097, outputLimit: 4097, family: 'GPT-3.5', inputPrice: 0.0015, outputPrice: 0.002, provider: 'openai' },
};

// List of available models for the UI
export const availableModels = [
  // Anthropic O-Series models
  { label: 'O1', value: 'o1', category: 'O-Series', provider: 'anthropic' },
  { label: 'O1 Preview', value: 'o1-preview', category: 'O-Series', provider: 'anthropic' },
  { label: 'O1 Mini', value: 'o1-mini', category: 'O-Series', provider: 'anthropic' },
  { label: 'O3 Mini', value: 'o3-mini', category: 'O-Series', provider: 'anthropic' },
  
  // Anthropic Claude models
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620', category: 'Claude', provider: 'anthropic' },
  { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229', category: 'Claude', provider: 'anthropic' },
  { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229', category: 'Claude', provider: 'anthropic' },
  { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307', category: 'Claude', provider: 'anthropic' },
  
  // OpenAI GPT-4o models
  { label: 'GPT-4o (Nov 2024)', value: 'gpt-4o-2024-11-20', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4o (Aug 2024)', value: 'gpt-4o-2024-08-06', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4o (May 2024)', value: 'gpt-4o-2024-05-13', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4o', value: 'gpt-4o', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4o Mini (Jul 2024)', value: 'gpt-4o-mini-2024-07-18', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4o Mini', value: 'gpt-4o-mini', category: 'GPT-4', provider: 'openai' },
  
  // OpenAI GPT-4 Turbo models
  { label: 'GPT-4 Turbo (Apr 2024)', value: 'gpt-4-turbo-2024-04-09', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4 Vision', value: 'gpt-4-vision-preview', category: 'GPT-4', provider: 'openai' },
  
  // OpenAI Base GPT-4 models
  { label: 'GPT-4', value: 'gpt-4', category: 'GPT-4', provider: 'openai' },
  { label: 'GPT-4 32k', value: 'gpt-4-32k', category: 'GPT-4', provider: 'openai' },
  
  // OpenAI Legacy GPT-4 models (deprecated)
  { label: 'GPT-4 0613 (Deprecated)', value: 'gpt-4-0613', category: 'GPT-4-Legacy', provider: 'openai' },
  { label: 'GPT-4 0314 (Deprecated)', value: 'gpt-4-0314', category: 'GPT-4-Legacy', provider: 'openai' },
  { label: 'GPT-4 32k 0613 (Deprecated)', value: 'gpt-4-32k-0613', category: 'GPT-4-Legacy', provider: 'openai' },
  
  // OpenAI GPT-3.5 models
  { label: 'GPT-3.5 Turbo (0125)', value: 'gpt-3.5-turbo-0125', category: 'GPT-3.5', provider: 'openai' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', category: 'GPT-3.5', provider: 'openai' },
  { label: 'GPT-3.5 Turbo (1106)', value: 'gpt-3.5-turbo-1106', category: 'GPT-3.5', provider: 'openai' },
  { label: 'GPT-3.5 Turbo Instruct', value: 'gpt-3.5-turbo-instruct', category: 'GPT-3.5', provider: 'openai' },
  
  // OpenAI Legacy GPT-3.5 models (deprecated)
  { label: 'GPT-3.5 Turbo 0613 (Deprecated)', value: 'gpt-3.5-turbo-0613', category: 'GPT-3.5-Legacy', provider: 'openai' },
  { label: 'GPT-3.5 Turbo 16k (Deprecated)', value: 'gpt-3.5-turbo-16k', category: 'GPT-3.5-Legacy', provider: 'openai' },
]; 