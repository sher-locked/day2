import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { availableModels, getModelInfo } from '@/lib/constants/modelInfo';
import { formatNumber, formatCurrency } from '@/lib/utils/formatters';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// USD to INR conversion rate (can be moved to a config file)
const USD_TO_INR = 83.34;

type ModelSelectorProps = {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
};

export function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  disabled = false 
}: ModelSelectorProps) {
  // State for API key status
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    openai: boolean;
    anthropic: boolean;
  }>({ openai: false, anthropic: false });
  
  // Check API key status on mount
  useEffect(() => {
    async function checkApiKeyStatus() {
      try {
        const response = await fetch('/api/check-api-keys');
        if (response.ok) {
          const data = await response.json();
          setApiKeyStatus({
            openai: data.openaiAvailable,
            anthropic: data.anthropicAvailable
          });
        }
      } catch (error) {
        console.error('Error checking API keys:', error);
      }
    }
    
    checkApiKeyStatus();
  }, []);
  
  // Group models by provider and category
  const anthropicOSeries = availableModels.filter(model => model.provider === 'anthropic' && model.category === 'O-Series');
  const anthropicClaude = availableModels.filter(model => model.provider === 'anthropic' && model.category === 'Claude');
  
  const openaiGpt4Models = availableModels.filter(model => model.provider === 'openai' && model.category === 'GPT-4');
  const openaiGpt35Models = availableModels.filter(model => model.provider === 'openai' && model.category === 'GPT-3.5');
  
  const legacyModels = availableModels.filter(model => 
    model.category === 'GPT-4-Legacy' || model.category === 'GPT-3.5-Legacy'
  );
  
  // Currently selected model info
  const modelInfo = getModelInfo(selectedModel);
  
  // Helper to get provider label and icon
  const getProviderInfo = (provider: 'openai' | 'anthropic') => {
    return {
      openai: {
        label: 'OpenAI',
        icon: '/images/openai-icon.png',
        className: 'text-emerald-700 dark:text-emerald-400'
      },
      anthropic: {
        label: 'Anthropic',
        icon: '/images/anthropic-icon.png',
        className: 'text-blue-700 dark:text-blue-400'
      }
    }[provider];
  };
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="model-selector" className="text-sm font-medium">
          Model
        </label>
        
        {modelInfo && (
          <div className="text-xs text-slate-500">
            Max tokens: {formatNumber(modelInfo.tokenLimit)}
          </div>
        )}
      </div>
      
      <Select
        value={selectedModel}
        onValueChange={onModelChange}
        disabled={disabled}
      >
        <SelectTrigger id="model-selector" className="w-full">
          <SelectValue placeholder="Select a model">
            {selectedModel && (
              <div className="flex items-center">
                {modelInfo && (
                  <div className="flex items-center">
                    <Image 
                      src={getProviderInfo(modelInfo.provider).icon} 
                      alt={getProviderInfo(modelInfo.provider).label}
                      width={16} 
                      height={16} 
                      className="mr-2"
                    />
                    <span>{availableModels.find(m => m.value === selectedModel)?.label}</span>
                  </div>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {/* Anthropic Models Section */}
          <div className="px-2 py-1.5 mb-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Image 
                  src="/images/anthropic-icon.png" 
                  alt="Anthropic" 
                  width={20} 
                  height={20} 
                  className="mr-2"
                />
                <span className="font-bold text-blue-800 dark:text-blue-300">Anthropic Models</span>
              </div>
              
              {/* API key status indicator */}
              <div className={`text-xs px-2 py-0.5 rounded-full ${
                apiKeyStatus.anthropic 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {apiKeyStatus.anthropic ? 'API Key ✓' : 'No API Key ✗'}
              </div>
            </div>
            
            {/* O-Series Reasoning Models */}
            {anthropicOSeries.length > 0 && (
              <SelectGroup>
                <SelectLabel className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  <Image 
                    src="/images/claude-icon.png" 
                    alt="O-Series" 
                    width={16} 
                    height={16} 
                    className="mr-1.5 opacity-80"
                  />
                  O-Series Reasoning Models
                </SelectLabel>
                {anthropicOSeries.map((model) => (
                  <SelectItem 
                    key={model.value} 
                    value={model.value}
                    className="ml-6 border-l-2 border-blue-200 dark:border-blue-800 pl-2"
                    disabled={!apiKeyStatus.anthropic || disabled}
                  >
                    {model.label}
                    {!apiKeyStatus.anthropic && (
                      <span className="ml-2 text-red-500 text-xs">⚠️ API Key Required</span>
                    )}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            
            {/* Claude Models */}
            {anthropicClaude.length > 0 && (
              <SelectGroup className="mt-2">
                <SelectLabel className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  <Image 
                    src="/images/claude-icon.png" 
                    alt="Claude" 
                    width={16} 
                    height={16} 
                    className="mr-1.5 opacity-80"
                  />
                  Claude Models
                </SelectLabel>
                {anthropicClaude.map((model) => (
                  <SelectItem 
                    key={model.value} 
                    value={model.value}
                    className="ml-6 border-l-2 border-blue-200 dark:border-blue-800 pl-2"
                    disabled={!apiKeyStatus.anthropic || disabled}
                  >
                    {model.label}
                    {!apiKeyStatus.anthropic && (
                      <span className="ml-2 text-red-500 text-xs">⚠️ API Key Required</span>
                    )}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </div>
          
          {/* OpenAI Models Section - Only show if there are models available */}
          {(openaiGpt4Models.length > 0 || openaiGpt35Models.length > 0) && (
            <div className="px-2 py-1.5 my-1 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Image 
                    src="/images/openai-icon.png" 
                    alt="OpenAI" 
                    width={20} 
                    height={20} 
                    className="mr-2"
                  />
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">OpenAI Models</span>
                </div>
                
                {/* API key status indicator */}
                <div className={`text-xs px-2 py-0.5 rounded-full ${
                  apiKeyStatus.openai 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {apiKeyStatus.openai ? 'API Key ✓' : 'No API Key ✗'}
                </div>
              </div>
              
              {/* GPT-4 Models */}
              {openaiGpt4Models.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Image 
                      src="/images/gpt4-icon.png" 
                      alt="GPT-4" 
                      width={16} 
                      height={16} 
                      className="mr-1.5 opacity-80"
                    />
                    GPT-4 Models
                  </SelectLabel>
                  {openaiGpt4Models.map((model) => (
                    <SelectItem 
                      key={model.value} 
                      value={model.value}
                      className="ml-6 border-l-2 border-emerald-200 dark:border-emerald-800 pl-2"
                    >
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              
              {/* GPT-3.5 Models */}
              {openaiGpt35Models.length > 0 && (
                <SelectGroup className="mt-2">
                  <SelectLabel className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Image 
                      src="/images/gpt35-icon.png" 
                      alt="GPT-3.5" 
                      width={16} 
                      height={16} 
                      className="mr-1.5 opacity-80"
                    />
                    GPT-3.5 Models
                  </SelectLabel>
                  {openaiGpt35Models.map((model) => (
                    <SelectItem 
                      key={model.value} 
                      value={model.value}
                      className="ml-6 border-l-2 border-emerald-200 dark:border-emerald-800 pl-2"
                    >
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </div>
          )}
          
          {/* Message when no OpenAI models are available */}
          {openaiGpt4Models.length === 0 && openaiGpt35Models.length === 0 && apiKeyStatus.openai && (
            <div className="px-4 py-3 my-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">OpenAI Models Unavailable</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    OpenAI models are currently disabled in this application. Please use the available Anthropic Claude models for your text analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Legacy Models - collapsed by default */}
          {legacyModels.length > 0 && (
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 px-2 pb-2">Legacy/Deprecated Models</p>
              
              <SelectGroup>
                <SelectLabel className="text-gray-500 dark:text-gray-400 text-xs">
                  Legacy Models
                </SelectLabel>
                {legacyModels.map((model) => (
                  <SelectItem 
                    key={model.value} 
                    value={model.value} 
                    className="text-gray-600 dark:text-gray-400 text-sm"
                  >
                    {model.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </div>
          )}
        </SelectContent>
      </Select>
      
      {/* Display model information below the selector */}
      {modelInfo && (
        <div className={`text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded mt-1 border ${
          modelInfo.isDeprecated 
            ? 'border-amber-300 dark:border-amber-800' 
            : 'border-transparent'
        }`}>
          {modelInfo.isDeprecated && (
            <div className="mb-2 text-amber-600 dark:text-amber-400 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Deprecated model - May be removed in the future</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded flex items-center">
              <Image 
                src={getProviderInfo(modelInfo.provider).icon}
                alt={getProviderInfo(modelInfo.provider).label}
                width={14}
                height={14}
                className="mr-1.5"
              />
              <span className={getProviderInfo(modelInfo.provider).className}>{getProviderInfo(modelInfo.provider).label}</span>
            </div>
            <div className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">
              Family: <span className="font-medium">{modelInfo.family}</span>
            </div>
            <div className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">
              Context: <span className="font-medium">{formatNumber(modelInfo.tokenLimit)}</span> tokens
            </div>
            <div className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">
              Max output: <span className="font-medium">{formatNumber(modelInfo.outputLimit)}</span> tokens
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-slate-600 dark:text-slate-300 font-medium mb-1">Pricing (per 1K tokens):</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Input pricing */}
              <div className="flex flex-col p-2 bg-blue-50 dark:bg-blue-900 rounded">
                <div className="text-blue-700 dark:text-blue-200 font-medium">Input</div>
                <div className="flex justify-between mt-1">
                  <span className="text-blue-600 dark:text-blue-300">
                    {formatCurrency(modelInfo.inputPrice, 'USD', 2)}
                  </span>
                  <span className="text-blue-600 dark:text-blue-300">
                    ≈ {formatCurrency(modelInfo.inputPrice * USD_TO_INR, 'INR', 2)}
                  </span>
                </div>
              </div>
              
              {/* Output pricing */}
              <div className="flex flex-col p-2 bg-green-50 dark:bg-green-900 rounded">
                <div className="text-green-700 dark:text-green-200 font-medium">Output</div>
                <div className="flex justify-between mt-1">
                  <span className="text-green-600 dark:text-green-300">
                    {formatCurrency(modelInfo.outputPrice, 'USD', 2)}
                  </span>
                  <span className="text-green-600 dark:text-green-300">
                    ≈ {formatCurrency(modelInfo.outputPrice * USD_TO_INR, 'INR', 2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 