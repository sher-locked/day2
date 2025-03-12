// Script to test the API routes for the working models - ESM version
import fetch from 'node-fetch';
import fs from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load test results to get working models
async function loadWorkingModels() {
  try {
    const testResults = JSON.parse(await fs.readFile('model-test-results.json', 'utf8'));
    
    const workingOpenAIModels = testResults.openai.models
      .filter(model => model.working)
      .map(model => model.model);
    
    const workingAnthropicModels = testResults.anthropic.models
      .filter(model => model.working)
      .map(model => model.model);
    
    return {
      openai: workingOpenAIModels,
      anthropic: workingAnthropicModels
    };
  } catch (error) {
    console.error('Error loading test results:', error);
    return { openai: [], anthropic: [] };
  }
}

// Test API key check endpoint
async function testAPIKeyCheck() {
  console.log('🔍 Testing API key check endpoint...');
  
  try {
    const response = await fetch('http://localhost:3002/api/check-api-keys');
    const data = await response.json();
    
    console.log(`✅ API key check endpoint response: ${JSON.stringify(data)}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`❌ API key check endpoint error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test Anthropic API test endpoint
async function testAnthropicEndpoint() {
  console.log('🔍 Testing Anthropic API test endpoint...');
  
  try {
    const response = await fetch('http://localhost:3002/api/test-anthropic');
    const data = await response.json();
    
    console.log(`✅ Anthropic API test endpoint response: ${JSON.stringify(data)}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`❌ Anthropic API test endpoint error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test main API with a working model
async function testModelAPI(model) {
  console.log(`🔍 Testing main API with model: ${model}...`);
  
  try {
    const response = await fetch('http://localhost:3002/api/llm-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Say hello briefly',
        selectedModels: [model],
        streaming: false,
        systemMessage: 'Be concise'
      })
    });
    
    const data = await response.json();
    
    // Check if the response contains results array with a successful model response
    if (data.results && data.results.length > 0 && data.results[0].success) {
      const modelResponse = data.results[0];
      console.log(`✅ Model ${model} API test success: "${modelResponse.raw || modelResponse.response?.content}"`);
      return {
        model,
        success: true,
        data: modelResponse
      };
    } else {
      console.error(`❌ Model ${model} API test error: ${JSON.stringify(data)}`);
      return {
        model,
        success: false,
        data
      };
    }
  } catch (error) {
    console.error(`❌ Model ${model} API test error: ${error.message}`);
    return {
      model,
      success: false,
      error: error.message
    };
  }
}

// Main function
async function testAPIRoutes() {
  console.log('🧪 TESTING API ROUTES');
  console.log('====================');
  
  // Wait a bit to ensure the server is up
  console.log('Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test API key check endpoint
  const apiKeyCheckResult = await testAPIKeyCheck();
  
  // Test Anthropic API test endpoint
  const anthropicEndpointResult = await testAnthropicEndpoint();
  
  // Load working models
  const workingModels = await loadWorkingModels();
  console.log(`\nWorking models found:`);
  console.log(`  OpenAI: ${workingModels.openai.length > 0 ? workingModels.openai.join(', ') : 'None'}`);
  console.log(`  Anthropic: ${workingModels.anthropic.join(', ')}\n`);
  
  // Test each working model
  const modelResults = [];
  
  // Test Anthropic models
  for (const model of workingModels.anthropic) {
    const result = await testModelAPI(model);
    modelResults.push(result);
  }
  
  // Test OpenAI models if any are working
  for (const model of workingModels.openai) {
    const result = await testModelAPI(model);
    modelResults.push(result);
  }
  
  // Print summary
  console.log('\nAPI ROUTES TEST SUMMARY:');
  console.log('=======================');
  
  console.log(`API key check endpoint: ${apiKeyCheckResult.success ? '✅ Working' : '❌ Not working'}`);
  console.log(`Anthropic API test endpoint: ${anthropicEndpointResult.success ? '✅ Working' : '❌ Not working'}`);
  
  const workingModelRoutes = modelResults.filter(r => r.success);
  console.log(`\nModel API routes: ${workingModelRoutes.length}/${modelResults.length} working\n`);
  
  console.log('Working model routes:');
  workingModelRoutes.forEach(r => console.log(`✅ ${r.model}`));
  
  console.log('\nNon-working model routes:');
  modelResults
    .filter(r => !r.success)
    .forEach(r => console.log(`❌ ${r.model}: ${r.error || JSON.stringify(r.data)}`));
  
  // Save results to a file
  const results = {
    timestamp: new Date().toISOString(),
    apiKeyCheck: apiKeyCheckResult,
    anthropicEndpoint: anthropicEndpointResult,
    modelRoutes: modelResults
  };
  
  await fs.writeFile('api-routes-test-results.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to api-routes-test-results.json');
}

// Run the tests
testAPIRoutes()
  .catch(console.error)
  .finally(() => {
    console.log('\nAPI route testing completed.');
  }); 