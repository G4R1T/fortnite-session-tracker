import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });

  const apiKey = process.env.TRACKER_GG_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API Key Required', message: 'To enable this feature, get a free API key from tracker.gg/developers and add it to your .env file as TRACKER_GG_API_KEY=your_key' }, { status: 503 });

  try {
    const encoded = encodeURIComponent(username);
    const url = `https://public-api.tracker.gg/v2/fortnite/standard/profile/epic/${encoded}`;
    const res = await fetch(url, {
      headers: {
        'TRN-Api-Key': apiKey,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: txt }, { status: res.status });
    }
    const data = await res.json();
    const segments = data?.data?.segments || [];
    const overview = segments.find((s: { type: string }) => s.type === 'overview') || segments[0];
    const stats = overview?.stats || {};
    return NextResponse.json({
      username,
      kills: stats.kills?.value ?? 0,
      wins: stats.wins?.value ?? 0,
      matches: stats.matches?.value ?? 0,
      kd: stats.kd?.value ?? 0,
      winRate: stats.winRatio?.value ?? 0,
      score: stats.score?.value ?? 0,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
