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

// Define the types for API responses and internal use
export type ApiResponseModel = {
  model: string;
  modelInfo: ModelInfo;
  response: any;
  raw: string | null;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  finish_reason?: string;
  success: boolean;
  error?: string;
};

// Define the API request body type
export type LlmApiRequest = {
  prompt: string;
  selectedModels: string[];
  streaming?: boolean;
  systemMessage?: string | null;
};

// Streaming response usage data structure
export type UsageData = {
  __usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost_usd: {
      input: number;
      output: number;
      total: number;
    };
    cost_inr: {
      input: number;
      output: number;
      total: number;
    };
  };
}; 