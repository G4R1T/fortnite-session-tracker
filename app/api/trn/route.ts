import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 })

  const apiKey = process.env.TRACKER_GG_API_KEY
  if (!apiKey) return NextResponse.json({ error: "No API key configured" }, { status: 503 })

  try {
    const encoded = encodeURIComponent(username)
    const url = `https://public-api.tracker.gg/v2/fortnite/standard/profile/epic/${encoded}`
    const res = await fetch(url, {
      headers: { "TRN-Api-Key": apiKey, "Accept": "application/json" },
      next: { revalidate: 60 }
    })
    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: txt }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
