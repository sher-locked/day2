# LLM Testing Platform

A Next.js application for testing different LLMs' responses to prompts that should return JSON.

## Features

- Test multiple LLMs with a single prompt
- Compare JSON responses side-by-side
- Visual indicators for successful and failed responses
- Comprehensive multi-provider support:
  - **OpenAI Models**:
    - GPT-4o models (all variants including dated versions)
    - GPT-4 and GPT-4 Turbo models
    - GPT-3.5 Turbo models
  - **Anthropic Models**:
    - O-Series reasoning models (O1, O1-mini, O3-mini)
    - Claude 3.5 Sonnet
    - Claude 3 Opus, Sonnet, and Haiku
- Enhanced UI with provider logos and model family categorization
- User Mode and Developer Mode for different user experiences
- Pricing information in both USD and INR

## Tech Stack

- [Next.js](https://nextjs.org/) with App Router
- [ShadCN UI](https://ui.shadcn.com/) for components
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for LLM integrations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for form validation

## Code Structure

The application follows a modular architecture for maintainability and scalability:

### Directory Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # API endpoints
│   │   └── llm-test/     # API endpoint for LLM testing
│   └── page.tsx          # Main application page
├── components/           # React components
│   ├── LlmTesting/       # LLM testing specific components
│   │   ├── ui/           # UI utility components
│   │   ├── renderers/    # Content rendering components
│   │   ├── ModelSelector.tsx
│   │   ├── StreamingDisplay.tsx
│   │   └── ThinkingIndicator.tsx
│   ├── ui/               # Shared UI components (from ShadCN)
│   └── LlmTestingInterface.tsx  # Main interface component
├── hooks/                # Custom React hooks
│   └── useStreamingResponse.ts  # Hook for streaming LLM responses
├── lib/                  # Utility libraries and helpers
│   ├── constants/        # Application constants
│   └── utils/            # Utility functions
│       ├── formatters.ts # Text formatting utilities
│       └── tokenCalculation.ts # Token counting and cost calculation
```

### Key Components

1. **LlmTestingInterface**: Main component that integrates all UI elements and manages the application state. Provides two different modes:
   - **User Mode**: Simplified interface for general users, focusing on the content.
   - **Dev Mode**: Technical interface with additional debugging information for developers.

2. **StreamingDisplay**: Handles the display of streaming responses from LLMs with support for:
   - Pretty formatting of JSON responses
   - Raw JSON view (in Dev Mode)
   - Token usage statistics and cost calculations

3. **Renderers**: Modular components that render different parts of the LLM response:
   - **SummaryDashboard**: Shows the summary of analysis
   - **AnalysisSection**: Displays detailed analysis sections
   - **Notes**: Shows additional notes and issues
   - **SuggestedImprovements**: Displays improvement suggestions
   - **TokenUsage**: Shows token usage and cost information

4. **ModelSelector**: UI component for selecting different LLM models with information about each model.

5. **ThinkingIndicator**: Visual indicator showing progress during LLM processing.

### API Structure

The API uses Next.js API routes to handle communication with LLM services, organized in a modular way:

1. **llm-test/route.ts**: Main API route handler that coordinates requests
2. **services/**:
   - **client-service.ts**: Manages API client initialization
   - **model-info.ts**: Contains model metadata and specifications
   - **openai-service.ts**: Handles OpenAI-specific requests
   - **anthropic-service.ts**: Handles Anthropic-specific requests
   - **streaming-service.ts**: Manages streaming responses for both providers
3. **utils/token-utils.ts**: Utilities for token counting and cost calculation
4. **types.ts**: Type definitions for API requests and responses

### State Management

The application uses React's built-in state management with custom hooks:

1. **useStreamingResponse**: Custom hook for handling streaming responses from the LLM API.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd llm-testing-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` to add your API keys.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. Enter a prompt that should result in JSON responses
2. Select the LLM models you want to test
3. Click "Run Test" to see the results
4. Compare the JSON outputs from different models

## Extending

The platform already supports OpenAI and Anthropic models out of the box. To add support for additional LLM providers:

1. Install the relevant API client:
   ```bash
   npm install <provider-sdk>
   ```

2. Create a new service file in `src/app/api/llm-test/services/`
3. Add the new provider to the `types.ts` file's ModelInfo type
4. Add the new models to the `MODEL_INFO` object in both:
   - `src/lib/constants/modelInfo.ts` (for frontend use)
   - `src/app/api/llm-test/services/model-info.ts` (for API use)
5. Add the models to the `availableModels` array
6. Update the `ModelSelector.tsx` component to display the new provider's models
7. Add the provider's logo to the `public/images` directory

## License

This project is licensed under the MIT License.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
