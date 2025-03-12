import { LlmTestingInterface } from '@/components/LlmTestingInterface';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="bg-gradient-to-r from-primary to-primary/90 text-white py-8 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-2">AI Model Analyzer & Comparison Platform</h1>
          <p className="text-lg opacity-90">Test, compare, and evaluate OpenAI and Anthropic models with structured outputs</p>
        </div>
      </header>
      
      <div className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-primary mb-4">Compare Leading AI Models for Content Enhancement</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              This platform helps you evaluate how different AI models analyze and enhance your text, providing structured JSON feedback for easy comparison.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1.5 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base"><span className="font-medium">Test Multiple Models:</span> Compare OpenAI GPT-4o and GPT-4 alongside Anthropic Claude 3.5 Sonnet, Claude 3 Opus, and Claude 3 Haiku</p>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1.5 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base"><span className="font-medium">Structured Output:</span> Get detailed analysis in consistent JSON format with storytelling, reasoning, and improvement suggestions</p>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1.5 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base"><span className="font-medium">Token Usage Monitoring:</span> Track usage and costs with real-time token estimation</p>
              </div>
            </div>
            
            <div className="p-5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-800">
              <p className="font-medium mb-2 text-base">How to get started:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Paste your text in the input area below</li>
                <li>Select models to compare (default prompt evaluates communication quality)</li>
                <li>Click "Analyze Text" to get structured feedback</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-grow px-4 pb-10">
        <LlmTestingInterface />
      </div>
      
      <footer className="bg-gray-100 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-400">LLM Testing Platform - Built with Next.js, ShadCN UI, and Vercel AI SDK</p>
        </div>
      </footer>
    </main>
  );
}
