import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 100);

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const apiKey = process.env.TWITTERAPIIO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Twitter API key not configured' }, { status: 500 });
    }

    const url = `https://api.twitterapi.io/user/${encodeURIComponent(userId)}/tweets?limit=${limit}`;
    const resp = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      // Timeout safeguard via AbortSignal timeout is not available in Node <18.17; relying on platform defaults
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'Upstream error', details: text }, { status: 502 });
    }

    const data = await resp.json();

    // Normalize minimal fields for UI consumption
    const tweets = (data?.data || data?.tweets || []).map((t: any) => ({
      id: t.id || t.tweet_id || t.id_str,
      text: t.text || t.full_text || '',
      createdAt: t.created_at || t.createdAt,
      url: t.permalink || (t.id ? `https://x.com/i/web/status/${t.id}` : undefined),
      user: t.user || data?.user || null,
      likeCount: t.favorite_count || t.public_metrics?.like_count,
      retweetCount: t.retweet_count || t.public_metrics?.retweet_count,
      replyCount: t.reply_count || t.public_metrics?.reply_count,
      quoteCount: t.quote_count || t.public_metrics?.quote_count,
    }));

    return NextResponse.json({ success: true, tweets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


