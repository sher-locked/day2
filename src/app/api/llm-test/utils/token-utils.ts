import { ModelInfo } from '../types';

// Constants
export const USD_TO_INR = 83.34;

// Simple function to estimate tokens (very approximate)
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // A very simple approximation: about 4 characters per token for English text
  return Math.ceil(text.length / 4);
}

// Calculate cost based on token counts and model pricing
export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  modelInfo: ModelInfo
) {
  const inputCost = (promptTokens / 1000) * modelInfo.inputPrice;
  const outputCost = (completionTokens / 1000) * modelInfo.outputPrice;
  const totalCost = inputCost + outputCost;
  
  // Convert to INR
  const totalCostInr = totalCost * USD_TO_INR;
  
  return {
    cost_usd: {
      input: parseFloat(inputCost.toFixed(4)),
      output: parseFloat(outputCost.toFixed(4)),
      total: parseFloat(totalCost.toFixed(4))
    },
    cost_inr: {
      input: parseFloat((inputCost * USD_TO_INR).toFixed(2)),
      output: parseFloat((outputCost * USD_TO_INR).toFixed(2)),
      total: parseFloat(totalCostInr.toFixed(2))
    }
  };
}

// Create the usage data object for streaming responses
export function createUsageData(
  promptTokens: number,
  completionTokens: number,
  modelInfo: ModelInfo
) {
  const totalTokens = promptTokens + completionTokens;
  const costData = calculateCost(promptTokens, completionTokens, modelInfo);
  
  return {
    __usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      ...costData
    }
  };
} 