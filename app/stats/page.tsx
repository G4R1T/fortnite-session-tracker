
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

type Match = { id:number; mode:string; placement:number; kills:number; assists:number; survived:number; tilt:number; mood:string; win:boolean }

export default function Stats() {
  const [matches, setMatches] = useState<Match[]>([])
  const [username, setUsername] = useState("")
  const [input, setInput] = useState("")
  const [trnData, setTrnData] = useState<any>(null)
  const [trnLoading, setTrnLoading] = useState(false)
  const [trnError, setTrnError] = useState("")

  useEffect(() => {
    fetch("/api/matches").then(r=>r.json()).then(d=>setMatches(Array.isArray(d)?d:[]))
    const saved = localStorage.getItem("epicUsername")
    if (saved) { setUsername(saved); setInput(saved); fetchTRN(saved) }
  }, [])

  const fetchTRN = async (name: string) => {
    setTrnLoading(true); setTrnError("")
    try {
      const res = await fetch(`/api/trn?username=${encodeURIComponent(name)}`)
      const data = await res.json()
      if (data.error) setTrnError(data.error)
      else { setTrnData(data); localStorage.setItem("epicUsername", name) }
    } catch(e) { setTrnError("Failed to fetch") }
    setTrnLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) { setUsername(input.trim()); fetchTRN(input.trim()) }
  }

  const wins = matches.filter(m=>m.win).length
  const avgKills = matches.length ? (matches.reduce((a,m)=>a+m.kills,0)/matches.length).toFixed(1) : "0"
  const avgTilt = matches.length ? (matches.reduce((a,m)=>a+m.tilt,0)/matches.length).toFixed(1) : "0"
  const avgSurvived = matches.length ? (matches.reduce((a,m)=>a+m.survived,0)/matches.length).toFixed(0) : "0"
  const winRate = matches.length ? ((wins/matches.length)*100).toFixed(1) : "0"

  const byMode = ["Solos","Duos","Trios","Squads"].map(mode => {
    const ms = matches.filter(m=>m.mode===mode)
    return { mode, count: ms.length, wins: ms.filter(m=>m.win).length, avgKills: ms.length ? (ms.reduce((a,m)=>a+m.kills,0)/ms.length).toFixed(1) : "0" }
  }).filter(x=>x.count>0)

  const tiltMoods = matches.reduce((acc,m) => { acc[m.mood]=(acc[m.mood]||0)+1; return acc }, {} as Record<string,number>)
  const topMood = Object.entries(tiltMoods).sort((a,b)=>b[1]-a[1])[0]

  const overview = trnData?.data?.segments?.find((s:any)=>s.type==="overview")?.stats

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <header className="border-b border-white/5 bg-[#0d1220]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-sm">FN</div>
              <span className="font-bold text-white text-lg tracking-tight">Fortnite Tracker</span>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">Matches</Link>
            <Link href="/new" className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm rounded-lg transition-colors">+ Log Match</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Local Session Stats */}
        <section>
          <h2 className="text-white font-bold text-lg mb-4">Your Session Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{label:"Matches",val:matches.length,color:"text-white"},{label:"Wins",val:wins,color:"text-green-400"},{label:"Win Rate",val:winRate+"%",color:"text-yellow-400"},{label:"Avg Kills",val:avgKills,color:"text-red-400"},{label:"Avg Survived",val:avgSurvived+"m",color:"text-blue-400"},{label:"Avg Tilt",val:avgTilt+"/10",color:"text-orange-400"},{label:"Best Mood",val:topMood?topMood[0]:"—",color:"text-purple-400"},{label:"Modes Played",val:byMode.length,color:"text-cyan-400"}].map(s=>(
              <div key={s.label} className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* By Mode Breakdown */}
        {byMode.length > 0 && (
          <section>
            <h2 className="text-white font-bold text-lg mb-4">By Mode</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {byMode.map(m=>(
                <div key={m.mode} className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
                  <p className="text-gray-400 font-bold mb-2">{m.mode}</p>
                  <p className="text-white text-sm">{m.count} matches</p>
                  <p className="text-green-400 text-sm">{m.wins} wins</p>
                  <p className="text-red-400 text-sm">{m.avgKills} avg kills</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TRN Career Stats */}
        <section>
          <h2 className="text-white font-bold text-lg mb-1">Epic Career Stats</h2>
          <p className="text-gray-500 text-sm mb-4">Enter your Epic username to pull lifetime stats from Tracker.gg</p>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder="Epic username..."
              className="flex-1 bg-[#0d1220] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg text-sm transition-colors">
              {trnLoading ? "..." : "Search"}
            </button>
          </form>

          {trnError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {trnError.includes("503") || trnError.includes("No API key") ? (
                <><p className="font-bold mb-1">API Key Required</p><p>To enable this feature, get a free API key from <a href="https://tracker.gg/developers" target="_blank" className="underline">tracker.gg/developers</a> and add it to your .env file as <code className="bg-white/10 px-1 rounded">TRACKER_GG_API_KEY=your_key</code></p></>
              ) : <p>{trnError.includes('Invalid authentication') ? (
              <div>
                <p className="font-semibold text-yellow-400 mb-1">TRN API Pending Approval</p>
                <p className="text-sm text-gray-400">Your Tracker.gg API app is awaiting production approval. Once approved at <a href="https://tracker.gg/developers" className="text-blue-400 underline" target="_blank">tracker.gg/developers</a>, live stats will load here automatically.</p>
              </div>
            ) : trnError}</p>}
            </div>
          )}

          {overview && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{key:"wins",label:"Career Wins",color:"text-yellow-400"},{key:"kills",label:"Career Kills",color:"text-red-400"},{key:"matchesPlayed",label:"Matches Played",color:"text-white"},{key:"winRate",label:"Career Win Rate",color:"text-green-400"},{key:"kd",label:"K/D Ratio",color:"text-orange-400"},{key:"top3",label:"Top 3 Finishes",color:"text-purple-400"},{key:"top6",label:"Top 6 Finishes",color:"text-blue-400"},{key:"score",label:"Total Score",color:"text-cyan-400"}].map(s=>overview[s.key] ? (
                <div key={s.key} className="bg-[#0d1220] border border-yellow-500/10 rounded-xl p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{overview[s.key]?.displayValue || "—"}</p>
                </div>
              ) : null)}
            </div>
          )}

          {!overview && !trnError && !trnLoading && username && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm">
              No data found for "{username}". Check the username and try again.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
