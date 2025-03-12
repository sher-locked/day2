import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clarifi Workbench - AI Model Analyzer & Comparison Platform",
  description: "Test, compare, and evaluate OpenAI and Anthropic language models with structured outputs for content enhancement and reasoning analysis.",
  metadataBase: new URL('https://clarifi-six.vercel.app'),
  openGraph: {
    title: 'Clarifi Workbench - AI Model Analyzer',
    description: 'Compare GPT-4o, GPT-4, and Claude models for content enhancement with structured outputs',
    url: 'https://clarifi-six.vercel.app',
    siteName: 'Clarifi Workbench',
    images: [
      {
        url: '/clarifi-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Clarifi Workbench - AI Model Analyzer & Comparison Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarifi Workbench - AI Model Analyzer',
    description: 'Compare leading AI models for content enhancement with structured outputs',
    images: ['/clarifi-og.jpg'],
    creator: '@clarifi',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="clarifi-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
