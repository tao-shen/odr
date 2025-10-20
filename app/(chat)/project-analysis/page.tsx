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
          content: `# 🚀 欢迎使用加密货币项目深度分析平台

我是您的AI分析师，专门帮助您深度研究加密货币项目。我可以为您提供：

## 📊 分析功能
- **项目基本信息** - 代币信息、市值、价格走势
- **团队背景调研** - 创始人履历、团队经验分析  
- **投资人背景** - VC机构、投资轮次、资金情况
- **推特情报分析** - 社交媒体情绪、讨论热度、KOL观点
- **路线图评估** - 项目进展、里程碑完成情况
- **产品分析** - 技术架构、竞争优势、创新点
- **市场情绪** - 社区反馈、用户评价、风险评估

## 🔍 使用方法
请告诉我您想分析的项目名称或代币符号，例如：
- "分析 Ethereum (ETH)"
- "研究 Chainlink 项目"
- "调研 Uniswap 的团队背景"

我将为您提供全面、客观的项目分析报告。`,
        },
      ]}
      selectedModelId={selectedModelId}
      selectedReasoningModelId={selectedReasoningModelId}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  );
}