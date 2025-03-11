// Define the types for model information
export type ModelInfo = {
  tokenLimit: number;
  outputLimit: number;
  family: string;
  inputPrice: number;  // USD per 1K tokens
  outputPrice: number; // USD per 1K tokens
};

export type ModelInfoMap = {
  [key: string]: ModelInfo;
};

// Model information for reference, token limits, and pricing (USD per 1K tokens)
export const MODEL_INFO: ModelInfoMap = {
  // GPT-4 models
  'gpt-4o': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.005, outputPrice: 0.015 },
  'gpt-4o-mini': { tokenLimit: 128000, outputLimit: 16384, family: 'GPT-4', inputPrice: 0.0015, outputPrice: 0.0060 },
  'gpt-4-turbo': { tokenLimit: 128000, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.01, outputPrice: 0.03 },
  'gpt-4': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06 },
  'gpt-4-0613': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06 },
  'gpt-4-0314': { tokenLimit: 8192, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.03, outputPrice: 0.06 },
  'gpt-4-32k': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12 },
  'gpt-4-32k-0613': { tokenLimit: 32768, outputLimit: 4096, family: 'GPT-4', inputPrice: 0.06, outputPrice: 0.12 },
  
  // GPT-3.5 models
  'gpt-3.5-turbo': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015 },
  'gpt-3.5-turbo-0125': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015 },
  'gpt-3.5-turbo-1106': { tokenLimit: 16385, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002 },
  'gpt-3.5-turbo-0613': { tokenLimit: 4096, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002 },
  'gpt-3.5-turbo-16k': { tokenLimit: 16384, outputLimit: 4096, family: 'GPT-3.5', inputPrice: 0.001, outputPrice: 0.002 },
  'gpt-3.5-turbo-instruct': { tokenLimit: 4097, outputLimit: 4097, family: 'GPT-3.5', inputPrice: 0.0015, outputPrice: 0.002 },
};

// List of available models for the UI
export const availableModels = [
  // GPT-4 models
  { label: 'GPT-4o', value: 'gpt-4o', category: 'GPT-4' },
  { label: 'GPT-4o Mini', value: 'gpt-4o-mini', category: 'GPT-4' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo', category: 'GPT-4' },
  { label: 'GPT-4', value: 'gpt-4', category: 'GPT-4' },
  { label: 'GPT-4 0613', value: 'gpt-4-0613', category: 'GPT-4' },
  { label: 'GPT-4 0314', value: 'gpt-4-0314', category: 'GPT-4' },
  { label: 'GPT-4 32k', value: 'gpt-4-32k', category: 'GPT-4' },
  { label: 'GPT-4 32k 0613', value: 'gpt-4-32k-0613', category: 'GPT-4' },
  
  // GPT-3.5 models
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 0125', value: 'gpt-3.5-turbo-0125', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 1106', value: 'gpt-3.5-turbo-1106', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 0613', value: 'gpt-3.5-turbo-0613', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo 16k', value: 'gpt-3.5-turbo-16k', category: 'GPT-3.5' },
  { label: 'GPT-3.5 Turbo Instruct', value: 'gpt-3.5-turbo-instruct', category: 'GPT-3.5' },
]; 