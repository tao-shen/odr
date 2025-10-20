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
  // Always render panel; show empty states if no data yet

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

  if (sources.length === 0) return null;

  return (
    <div className="w-full bg-card border border-crypto-gold/20 rounded-lg shadow-lg p-3 max-h-[600px] flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-crypto-bitcoin rounded-full animate-pulse" />
        <h3 className="text-lg font-semibold text-crypto-gold">Crypto Research</h3>
      </div>

      <Tabs defaultValue="sources" className="flex flex-col h-full">
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="sources" className="flex-1 text-xs">
            Sources
          </TabsTrigger>
        </TabsList>

        {/* Overview and Activity tabs hidden as requested */}

        <TabsContent value="sources" className="flex-1 overflow-y-auto mt-2 pr-1">
          {sources.length === 0 ? (
            <Card className="bg-card/50 border-crypto-gold/20">
              <CardContent className="py-6 text-xs text-muted-foreground text-center">
                No sources yet.
              </CardContent>
            </Card>
          ) : (
          <div className="space-y-3 pr-1">
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}