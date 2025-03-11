import { LlmTestingInterface } from '@/components/LlmTestingInterface';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">LLM Testing Platform</h1>
          <p className="text-sm opacity-80">Test different LLMs with JSON-formatted responses</p>
        </div>
      </header>
      
      <div className="flex-grow">
        <LlmTestingInterface />
      </div>
      
      <footer className="bg-gray-100 dark:bg-gray-800 p-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>LLM Testing Platform - Built with Next.js, ShadCN UI, and Vercel AI SDK</p>
        </div>
      </footer>
    </main>
  );
}
