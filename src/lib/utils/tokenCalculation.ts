import { ModelInfo } from '../constants/modelInfo';

export type TokenUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type CostData = {
  input: number;
  output: number;
  total: number;
};

export type UsageData = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: CostData;
  cost_inr: CostData;
};

// Simple function to estimate tokens (very approximate)
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // A very simple approximation: about 4 characters per token for English text
  return Math.ceil(text.length / 4);
}

// Calculate costs based on usage and model info
export function calculateCosts(usage: TokenUsage | undefined, modelInfo: ModelInfo | undefined) {
  if (!usage || !modelInfo) {
    return {
      usd: { input: 0, output: 0, total: 0 },
      inr: { input: 0, output: 0, total: 0 }
    };
  }
  
  // USD costs
  const inputCostUsd = (usage.prompt_tokens / 1000) * (modelInfo.inputPrice || 0);
  const outputCostUsd = (usage.completion_tokens / 1000) * (modelInfo.outputPrice || 0);
  const totalCostUsd = inputCostUsd + outputCostUsd;
  
  // INR costs (using fixed exchange rate)
  const usdToInr = 83.34; // Average rate - this should ideally be fetched from an API
  const inputCostInr = inputCostUsd * usdToInr;
  const outputCostInr = outputCostUsd * usdToInr;
  const totalCostInr = totalCostUsd * usdToInr;
  
  return {
    usd: { input: inputCostUsd, output: outputCostUsd, total: totalCostUsd },
    inr: { input: inputCostInr, output: outputCostInr, total: totalCostInr }
  };
}

// Create token usage data object from prompt and completion tokens
export function createUsageData(promptTokens: number, completionTokens: number, modelInfo: ModelInfo): UsageData {
  const totalTokens = promptTokens + completionTokens;
  
  // Calculate cost in USD
  const inputCost = (promptTokens / 1000) * modelInfo.inputPrice;
  const outputCost = (completionTokens / 1000) * modelInfo.outputPrice;
  const totalCost = inputCost + outputCost;
  
  // Convert to INR (using a standard conversion rate)
  const usdToInr = 83.34;
  const totalCostInr = totalCost * usdToInr;
  
  return {
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: totalTokens,
    cost_usd: {
      input: inputCost,
      output: outputCost,
      total: totalCost
    },
    cost_inr: {
      input: inputCost * usdToInr,
      output: outputCost * usdToInr,
      total: totalCostInr
    }
  };
} 