import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';

export default async function ProjectAnalysisPage() {
  const id = generateUUID();
  const session = await auth();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const reasoningModelIdFromCookie = cookieStore.get('reasoning-model-id')?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  const selectedReasoningModelId =
    models.find((model) => model.id === reasoningModelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  if (!session || !session.user) {
    notFound();
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[
        {
          id: generateUUID(),
          role: 'assistant',
          content: `# 🚀 Crypto Deep Research

I am your AI analyst for deep research on cryptocurrency projects. This tool focuses specifically on crypto projects and will compile sources, Twitter insights, and structured reports.

## What I can analyze
- Project basics: token info, positioning, market
- Team background: founders and core members
- Investors: firms, rounds, amounts (if public)
- Twitter intelligence: activity, engagement, key announcements
- Roadmap evaluation: milestones and progress (rendered with Mermaid timelines)
- Product analysis: features, architecture, differentiation
- Sentiment: community/media/KOL perspective

## How to use
Tell me the project name or token symbol, for example:
- "Analyze Ethereum (ETH)"
- "Research Chainlink"
- "Investigate Uniswap team background"

I'll generate a comprehensive, objective research report with sources.`,
        },
      ]}
      selectedModelId={selectedModelId}
      selectedReasoningModelId={selectedReasoningModelId}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  );
}