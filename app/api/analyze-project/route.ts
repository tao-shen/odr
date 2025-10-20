import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

interface ProjectAnalysisRequest {
  projectName: string;
  symbol?: string;
  analysisType: 'full' | 'team' | 'investors' | 'twitter' | 'roadmap' | 'sentiment';
}

interface TwitterData {
  mentions: number;
  sentiment: number;
  positiveRatio: number;
  keyTopics: string[];
  recentTweets: Array<{
    text: string;
    author: string;
    engagement: number;
    timestamp: string;
  }>;
}

interface TeamMember {
  name: string;
  role: string;
  background: string;
  linkedin?: string;
  twitter?: string;
  previousProjects?: string[];
}

interface Investor {
  name: string;
  type: 'vc' | 'angel' | 'institution';
  amount?: string;
  round?: string;
  date?: string;
}

interface RoadmapItem {
  quarter: string;
  milestones: string[];
  status: 'completed' | 'in-progress' | 'planned';
  details?: string;
}

interface ProjectAnalysisResponse {
  projectInfo: {
    name: string;
    symbol: string;
    description: string;
    category: string;
    website?: string;
    whitepaper?: string;
    github?: string;
    marketCap?: string;
    price?: string;
    change24h?: number;
    volume24h?: string;
    circulatingSupply?: string;
    totalSupply?: string;
  };
  team?: TeamMember[];
  investors?: Investor[];
  twitterData?: TwitterData;
  roadmap?: RoadmapItem[];
  sentiment?: {
    overall: number;
    community: number;
    developer: number;
    investor: number;
    factors: string[];
  };
  risks?: string[];
  opportunities?: string[];
  recommendation?: {
    score: number;
    reasoning: string;
    timeframe: string;
  };
}

// 模拟数据生成函数
function generateMockAnalysis(projectName: string, symbol?: string): ProjectAnalysisResponse {
  const mockProjects: Record<string, Partial<ProjectAnalysisResponse>> = {
    'ethereum': {
      projectInfo: {
        name: 'Ethereum',
        symbol: 'ETH',
        description: '去中心化智能合约平台，支持DApps和DeFi生态系统',
        category: 'Layer 1',
        website: 'https://ethereum.org',
        marketCap: '$400B',
        price: '$3,200',
        change24h: 2.5,
      },
      team: [
        {
          name: 'Vitalik Buterin',
          role: 'Co-Founder',
          background: '以太坊创始人，区块链技术专家，Bitcoin Magazine联合创始人',
          twitter: '@VitalikButerin'
        },
        {
          name: 'Gavin Wood',
          role: 'Co-Founder',
          background: '以太坊联合创始人，Polkadot创始人，前CTO',
          twitter: '@gavofyork'
        }
      ],
      twitterData: {
        mentions: 15420,
        sentiment: 0.72,
        positiveRatio: 0.68,
        keyTopics: ['DeFi', 'NFT', 'Layer2', 'Merge', 'Staking'],
        recentTweets: []
      }
    },
    'chainlink': {
      projectInfo: {
        name: 'Chainlink',
        symbol: 'LINK',
        description: '去中心化预言机网络，为智能合约提供可靠的外部数据',
        category: 'Oracle',
        website: 'https://chain.link',
        marketCap: '$8.5B',
        price: '$14.20',
        change24h: -1.2,
      },
      team: [
        {
          name: 'Sergey Nazarov',
          role: 'Co-Founder & CEO',
          background: 'Chainlink联合创始人，SmartContract.com创始人',
          twitter: '@SergeyNazarov'
        }
      ],
      twitterData: {
        mentions: 8930,
        sentiment: 0.65,
        positiveRatio: 0.61,
        keyTopics: ['Oracle', 'DeFi', 'Cross-chain', 'CCIP', 'Staking'],
        recentTweets: []
      }
    }
  };

  const projectKey = projectName.toLowerCase();
  const mockData = mockProjects[projectKey] || {
    projectInfo: {
      name: projectName,
      symbol: symbol || 'UNKNOWN',
      description: `${projectName} 是一个创新的区块链项目`,
      category: '未分类',
      marketCap: '待查询',
      price: '待查询',
      change24h: 0,
    }
  };

  // 添加默认的投资人信息
  if (!mockData.investors) {
    mockData.investors = [
      {
        name: 'Andreessen Horowitz (a16z)',
        type: 'vc',
        amount: '$25M',
        round: 'Series A'
      },
      {
        name: 'Coinbase Ventures',
        type: 'vc',
        amount: '$10M',
        round: 'Seed'
      }
    ];
  }

  // 添加默认的路线图
  if (!mockData.roadmap) {
    mockData.roadmap = [
      {
        quarter: 'Q4 2024',
        milestones: ['主网上线', '代币发行', '社区建设'],
        status: 'completed'
      },
      {
        quarter: 'Q1 2025',
        milestones: ['DeFi集成', '跨链桥开发', '治理系统'],
        status: 'in-progress'
      },
      {
        quarter: 'Q2 2025',
        milestones: ['移动端应用', '机构合作', '生态扩展'],
        status: 'planned'
      }
    ];
  }

  return mockData as ProjectAnalysisResponse;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ProjectAnalysisRequest = await request.json();
    const { projectName, symbol, analysisType } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成分析数据
    const analysisData = generateMockAnalysis(projectName, symbol);

    // 根据分析类型返回相应数据
    let response: Partial<ProjectAnalysisResponse> = {};

    switch (analysisType) {
      case 'team':
        response = { projectInfo: analysisData.projectInfo, team: analysisData.team };
        break;
      case 'investors':
        response = { projectInfo: analysisData.projectInfo, investors: analysisData.investors };
        break;
      case 'twitter':
        response = { projectInfo: analysisData.projectInfo, twitterData: analysisData.twitterData };
        break;
      case 'roadmap':
        response = { projectInfo: analysisData.projectInfo, roadmap: analysisData.roadmap };
        break;
      case 'sentiment':
        response = { 
          projectInfo: analysisData.projectInfo, 
          sentiment: analysisData.sentiment,
          twitterData: analysisData.twitterData 
        };
        break;
      case 'full':
      default:
        response = analysisData;
        break;
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Project analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectName = searchParams.get('project');
  
  if (!projectName) {
    return NextResponse.json({ error: 'Project parameter is required' }, { status: 400 });
  }

  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analysisData = generateMockAnalysis(projectName);
    
    return NextResponse.json({
      success: true,
      data: analysisData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Project analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}