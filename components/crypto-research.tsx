import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Twitter, 
  Globe, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface CryptoResearchProps {
  isActive: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  activity?: Array<{
    type: 'search' | 'extract' | 'analyze' | 'reasoning' | 'synthesis' | 'thought' | 'twitter' | 'website' | 'sentiment' | 'roadmap' | 'team';
    status: 'pending' | 'complete' | 'error';
    message: string;
    timestamp: string;
  }>;
  sources?: Array<{
    url: string;
    title: string;
    type?: 'twitter' | 'website' | 'whitepaper' | 'news';
    relevance: number;
  }>;
  researchData?: {
    projectInfo?: {
      name: string;
      symbol: string;
      description: string;
      category: string;
      marketCap?: string;
      price?: string;
      change24h?: number;
    };
    team?: Array<{
      name: string;
      role: string;
      background: string;
      linkedin?: string;
    }>;
    investors?: Array<{
      name: string;
      type: 'vc' | 'angel' | 'institution';
      amount?: string;
      round?: string;
    }>;
    twitterSentiment?: {
      score: number;
      mentions: number;
      positiveRatio: number;
      keyTopics: string[];
    };
    roadmap?: Array<{
      quarter: string;
      milestones: string[];
      status: 'completed' | 'in-progress' | 'planned';
    }>;
  };
}

export function CryptoResearch({
  isLoading,
  activity = [],
  sources = [],
  researchData
}: CryptoResearchProps) {
  if (activity.length === 0 && sources.length === 0 && !researchData) {
    return null;
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return 'text-crypto-green';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-crypto-red';
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.6) return <TrendingUp className="w-4 h-4" />;
    if (score >= 0.4) return <Target className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="fixed right-4 top-20 w-96 bg-card border border-crypto-gold/20 rounded-lg shadow-2xl p-4 max-h-[85vh] flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-crypto-bitcoin rounded-full animate-pulse" />
        <h3 className="text-lg font-semibold text-crypto-gold">Crypto Research</h3>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col h-full">
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="overview" className="flex-1 text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 text-xs">
            Activity
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex-1 text-xs">
            Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-y-auto mt-2 space-y-4">
          {researchData?.projectInfo && (
            <Card className="bg-card/50 border-crypto-gold/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-crypto-bitcoin" />
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{researchData.projectInfo.name}</span>
                  <Badge variant="outline" className="text-xs">{researchData.projectInfo.symbol}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{researchData.projectInfo.description}</p>
                {researchData.projectInfo.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Price:</span>
                    <span className={cn(
                      "text-xs font-mono",
                      researchData.projectInfo.change24h && researchData.projectInfo.change24h > 0 
                        ? "text-crypto-green" 
                        : "text-crypto-red"
                    )}>
                      {researchData.projectInfo.price}
                      {researchData.projectInfo.change24h && (
                        <span className="ml-1">
                          ({researchData.projectInfo.change24h > 0 ? '+' : ''}{researchData.projectInfo.change24h.toFixed(2)}%)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {researchData?.twitterSentiment && (
            <Card className="bg-card/50 border-crypto-gold/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Sentiment Score:</span>
                  <div className={cn("flex items-center gap-1", getSentimentColor(researchData.twitterSentiment.score))}>
                    {getSentimentIcon(researchData.twitterSentiment.score)}
                    <span className="text-xs font-mono">
                      {(researchData.twitterSentiment.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Positive</span>
                    <span>{(researchData.twitterSentiment.positiveRatio * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={researchData.twitterSentiment.positiveRatio * 100} 
                    className="h-1"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Mentions: {researchData.twitterSentiment.mentions}
                </div>
              </CardContent>
            </Card>
          )}

          {researchData?.team && researchData.team.length > 0 && (
            <Card className="bg-card/50 border-crypto-gold/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-crypto-ethereum" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {researchData.team.slice(0, 3).map((member, index) => (
                  <div key={index} className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{member.name}</span>
                      <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                    </div>
                    <p className="text-muted-foreground">{member.background}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="flex-1 overflow-y-auto mt-2">
          <div className="space-y-3 pr-2">
            {[...activity].reverse().map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2 mt-0.5">
                  {item.type === 'twitter' && <Twitter className="w-3 h-3 text-blue-400" />}
                  {item.type === 'website' && <Globe className="w-3 h-3 text-crypto-ethereum" />}
                  {item.type === 'analyze' && <Target className="w-3 h-3 text-crypto-gold" />}
                  {item.type === 'sentiment' && <TrendingUp className="w-3 h-3 text-crypto-green" />}
                  {item.type === 'roadmap' && <Calendar className="w-3 h-3 text-purple-400" />}
                  {item.type === 'team' && <Users className="w-3 h-3 text-crypto-silver" />}
                  {item.type === 'search' && <Globe className="w-3 h-3 text-crypto-ethereum" />}
                  {item.type === 'extract' && <Target className="w-3 h-3 text-crypto-gold" />}
                  {item.type === 'reasoning' && <Target className="w-3 h-3 text-purple-400" />}
                  {item.type === 'synthesis' && <CheckCircle className="w-3 h-3 text-crypto-green" />}
                  {item.type === 'thought' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      item.status === 'pending' && 'bg-yellow-500 animate-pulse',
                      item.status === 'complete' && 'bg-crypto-green',
                      item.status === 'error' && 'bg-crypto-red',
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground break-words">
                    {item.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="flex-1 overflow-y-auto mt-2">
          <div className="space-y-3 pr-2">
            {sources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 rounded-lg bg-muted/30 space-y-2"
              >
                <div className="flex items-start gap-2">
                  {source.type === 'twitter' && <Twitter className="w-3 h-3 text-blue-400 mt-0.5" />}
                  {source.type === 'website' && <Globe className="w-3 h-3 text-crypto-ethereum mt-0.5" />}
                  {source.type === 'whitepaper' && <CheckCircle className="w-3 h-3 text-crypto-gold mt-0.5" />}
                  {source.type === 'news' && <AlertTriangle className="w-3 h-3 text-crypto-red mt-0.5" />}
                  {!source.type && <Globe className="w-3 h-3 text-muted-foreground mt-0.5" />}
                  
                  <div className="flex-1 min-w-0">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium hover:underline break-words text-crypto-gold hover:text-crypto-bitcoin transition-colors"
                    >
                      {source.title}
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground truncate">
                    {new URL(source.url).hostname}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(source.relevance * 100)}%
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}