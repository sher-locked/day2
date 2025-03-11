import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { MODEL_INFO, availableModels } from '@/lib/constants/modelInfo';
import { formatNumber, formatCurrency } from '@/lib/utils/formatters';

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
  // Group models by family
  const gpt4Models = availableModels.filter(model => model.category === 'GPT-4');
  const gpt35Models = availableModels.filter(model => model.category === 'GPT-3.5');
  
  // Currently selected model info
  const modelInfo = MODEL_INFO[selectedModel];
  
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
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {gpt4Models.length > 0 && (
            <SelectGroup>
              <SelectLabel>GPT-4 Models</SelectLabel>
              {gpt4Models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          
          {gpt35Models.length > 0 && (
            <SelectGroup>
              <SelectLabel>GPT-3.5 Models</SelectLabel>
              {gpt35Models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      
      {/* Display model information below the selector */}
      {modelInfo && (
        <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded mt-1">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div>Family: {modelInfo.family}</div>
            <div>Input: {formatNumber(modelInfo.tokenLimit)} tokens</div>
            <div>Output: {formatNumber(modelInfo.outputLimit)} tokens</div>
            <div>Pricing: {formatCurrency(modelInfo.inputPrice * 1000, 'USD')}/1M input, {formatCurrency(modelInfo.outputPrice * 1000, 'USD')}/1M output</div>
          </div>
        </div>
      )}
    </div>
  );
} 