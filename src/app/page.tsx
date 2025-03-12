import { LlmTestingInterface } from '@/components/LlmTestingInterface';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black dark:bg-black text-slate-900 dark:text-white">
      {/* Hero Section with Evervault-inspired gradient background */}
      <header className="relative overflow-hidden py-12">
        {/* Theme Toggle Button */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Background gradient effect similar to Evervault */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f7f9fc] to-[#edf2ff] dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#101010] z-0">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(91,38,255,0.4),transparent_40%)]"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_60%,rgba(29,78,216,0.2),transparent_30%)] dark:bg-[radial-gradient(circle_at_70%_60%,rgba(33,150,243,0.3),transparent_30%)]"></div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10 px-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-100/60 dark:bg-white/10 backdrop-blur-sm border border-blue-200/60 dark:border-white/10">
              <span className="text-sm font-medium tracking-wide text-blue-700 dark:text-white">BETA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-3 text-slate-900 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-blue-200">Clarifi Workbench</h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:opacity-80 max-w-3xl font-light">Compare LLMs for Reasoning Outputs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/70 dark:border-white/10 rounded-xl p-6 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Test Multiple Models</h3>
              <p className="text-slate-700 dark:text-white/70 leading-relaxed">Compare OpenAI GPT-4o and GPT-4 alongside Anthropic Claude models</p>
            </div>
            
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/70 dark:border-white/10 rounded-xl p-6 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Structured Output</h3>
              <p className="text-slate-700 dark:text-white/70 leading-relaxed">Get detailed analysis in consistent JSON format with reasoning and suggestions</p>
            </div>
            
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/70 dark:border-white/10 rounded-xl p-6 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Token Usage Monitoring</h3>
              <p className="text-slate-700 dark:text-white/70 leading-relaxed">Track usage and costs with real-time token estimation</p>
            </div>
          </div>
          
          {/* How to get started with soft edges */}
          <div className="relative my-10 p-8 rounded-2xl overflow-hidden">
            {/* Gradient background with soft/misty edges */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm rounded-2xl"></div>
            
            {/* Radial gradient for softer edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:from-transparent dark:via-white/5 dark:to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">How to get started:</h3>
              <ol className="list-decimal pl-8 space-y-2 text-lg text-slate-700 dark:text-white/80">
                <li className="pl-2">Paste your text in the input area below</li>
                <li className="pl-2">Select models to compare (default prompt evaluates communication quality)</li>
                <li className="pl-2">Click "Analyze Text" to get structured feedback</li>
              </ol>
            </div>
            
            {/* Extra soft edges with box shadow */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(255,255,255,0.3)] dark:shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]"></div>
          </div>
        </div>
      </header>
      
      {/* Strong visual separator between landing and analyzer section */}
      <div className="relative">
        {/* Strong visible separation line with shadow */}
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 dark:via-white/20 to-transparent"></div>
        
        {/* Add depth with a subtle shadow */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-200/30 dark:from-black/30 to-transparent"></div>
        
        {/* Spacer element to create visual breathing room */}
        <div className="h-6"></div>
      </div>
      
      {/* Main Testing Interface Section - with distinct visual treatment */}
      <div className="flex-grow px-4 pb-16 pt-6 bg-slate-100 dark:bg-[#0a0a0a]">
        <div className="container mx-auto">
          {/* Section header to clearly separate from landing */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white inline-flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </span>
              Analysis Workbench
            </h2>
            <p className="text-slate-600 dark:text-white/60 text-sm mt-1">Analyze text using advanced AI models</p>
          </div>
          
          {/* Card with distinct styling from landing cards */}
          <div className="bg-white/80 shadow-lg dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200/70 dark:border-white/10 dark:shadow-2xl overflow-hidden">
            <LlmTestingInterface />
          </div>
        </div>
      </div>
      
      <footer className="bg-white dark:bg-[#0a0a0a] py-6 border-t border-slate-200/70 dark:border-white/10">
        <div className="container mx-auto text-center">
          <p className="text-slate-500 dark:text-white/50 text-sm">Clarifi Workbench - Built with Next.js, ShadCN UI, and Vercel AI SDK</p>
        </div>
      </footer>
    </main>
  );
}

