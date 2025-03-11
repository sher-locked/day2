// Simple script to test if the OpenAI API key is valid
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testOpenAIKey() {
  try {
    console.log('Testing OpenAI API key...');
    
    // Create OpenAI client with the API key from .env.local
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Simple test query
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Respond with a simple "Hello, the API key is working!" if you receive this message.' }
      ],
      max_tokens: 20,
    });
    
    console.log('✅ Success! OpenAI API key is valid.');
    console.log('Response:', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ Error testing OpenAI API key:', error.message);
    if (error.message.includes('API key')) {
      console.error('The API key appears to be invalid or has expired.');
    }
    return false;
  }
}

// Run the test
testOpenAIKey(); 