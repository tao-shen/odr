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
          content: `# 🚀 Welcome to the Crypto Research Platform

I am your AI analyst for deep research on cryptocurrency projects. I can help with:

## 📊 What I can analyze
- Project basics: token info, market cap, price performance
- Team background: founders and core team
- Investors: VCs, rounds, funding
- Twitter intelligence: social sentiment, discussion volume, KOL viewpoints
- Roadmap evaluation: milestones and progress
- Product analysis: tech architecture, differentiation, innovation
- Market sentiment: community feedback, user reviews, risk assessment

## 🔍 How to use
Tell me the project name or token symbol, for example:
- "Analyze Ethereum (ETH)"
- "Research Chainlink"
- "Investigate Uniswap team background"

I'll generate a comprehensive and objective research report for you.`,
        },
      ]}
      selectedModelId={selectedModelId}
      selectedReasoningModelId={selectedReasoningModelId}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  );
}