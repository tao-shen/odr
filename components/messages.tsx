import type { Message } from 'ai';
import type { ChatRequestOptions } from '@/lib/types';
import { PreviewMessage, ThinkingMessage } from './message';
import { Kline } from './kline';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { memo, useMemo } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import { toast } from 'sonner';
import { CryptoResearch } from './crypto-research';
import { useDeepResearch } from '@/lib/deep-research-context';

interface MessagesProps {
  chatId: string;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  isBlockVisible: boolean;
}

function PureMessages({
  chatId,
  isLoading,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const { state: deepResearchState } = useDeepResearch();

  // Extract crypto symbol from messages
  const cryptoSymbol = useMemo(() => {
    // Look for common crypto symbols in messages
    const messageText = messages.map(m => m.content).join(' ').toUpperCase();
    
    // Common crypto symbols mapping
    const symbolMap: Record<string, string> = {
      'BTC': 'BINANCE:BTCUSDT',
      'BITCOIN': 'BINANCE:BTCUSDT',
      'ETH': 'BINANCE:ETHUSDT',
      'ETHEREUM': 'BINANCE:ETHUSDT',
      'SOL': 'BINANCE:SOLUSDT',
      'SOLANA': 'BINANCE:SOLUSDT',
      'BNB': 'BINANCE:BNBUSDT',
      'XRP': 'BINANCE:XRPUSDT',
      'RIPPLE': 'BINANCE:XRPUSDT',
      'ADA': 'BINANCE:ADAUSDT',
      'CARDANO': 'BINANCE:ADAUSDT',
      'DOGE': 'BINANCE:DOGEUSDT',
      'DOGECOIN': 'BINANCE:DOGEUSDT',
      'MATIC': 'BINANCE:MATICUSDT',
      'POLYGON': 'BINANCE:MATICUSDT',
      'DOT': 'BINANCE:DOTUSDT',
      'POLKADOT': 'BINANCE:DOTUSDT',
      'AVAX': 'BINANCE:AVAXUSDT',
      'AVALANCHE': 'BINANCE:AVAXUSDT',
      'LINK': 'BINANCE:LINKUSDT',
      'CHAINLINK': 'BINANCE:LINKUSDT',
    };

    for (const [key, value] of Object.entries(symbolMap)) {
      if (messageText.includes(key)) {
        return value;
      }
    }

    return 'BINANCE:BTCUSDT'; // Default to Bitcoin
  }, [messages]);

  // Handle rate limit error
  const handleError = async (error: any) => {
    if (error?.response?.status === 429) {
      const data = await error.response.json();
      const resetInSeconds = Math.ceil((data.reset - Date.now()) / 1000);
      toast.error(
        `Rate limit exceeded. Please wait ${resetInSeconds} seconds before trying again.`,
        {
          duration: Math.min(resetInSeconds * 1000, 5000),
        },
      );
    }
  };

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
      >
        {messages.length === 0 && <Overview />}
        {messages.length > 0 && (
          <div className="px-2 md:px-4 space-y-4">
            <Kline symbol={cryptoSymbol} />
          </div>
        )}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
            vote={
              votes
                ? votes.find((vote) => vote.messageId === message.id)
                : undefined
            }
            setMessages={setMessages}
            reload={async (options?: ChatRequestOptions) => {
              try {
                return await reload(options);
              } catch (error) {
                handleError(error);
                return null;
              }
            }}
            isReadonly={isReadonly}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

    </>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isBlockVisible && nextProps.isBlockVisible) return true;

  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
