
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

type Match = {
  id: number; mode: string; placement: number; kills: number
  assists: number; survived: number; tilt: number; mood: string
  notes: string; win: boolean; createdAt: string
}

const MOOD_EMOJI: Record<string,string> = {
  neutral: "😐", focused: "🎯", tilted: "😤", "on fire": "🔥", "checked out": "😶"
}
const MODE_COLOR: Record<string,string> = {
  Solos: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Duos: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Trios: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Squads: "bg-green-500/20 text-green-300 border-green-500/30",
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(d => { setMatches(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const wins = matches.filter(m => m.win).length
  const avgKills = matches.length ? (matches.reduce((a,m) => a+m.kills,0)/matches.length).toFixed(1) : "0"
  const avgTilt = matches.length ? (matches.reduce((a,m) => a+m.tilt,0)/matches.length).toFixed(1) : "0"

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0d1220]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-sm">FN</div>
            <span className="font-bold text-white text-lg tracking-tight">Fortnite Tracker</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/stats" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">Stats</Link>
            <Link href="/new" className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm rounded-lg transition-colors flex items-center gap-1">
              <span>+</span> Log Match
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Quick Stats Row */}
        {matches.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Matches</p>
              <p className="text-3xl font-black text-white">{matches.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Wins</p>
              <p className="text-3xl font-black text-green-400">{wins}</p>
              <p className="text-xs text-gray-500">{matches.length ? ((wins/matches.length)*100).toFixed(0) : 0}% WR</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Avg Kills</p>
              <p className="text-3xl font-black text-red-400">{avgKills}</p>
              <p className="text-xs text-gray-500">Tilt avg: {avgTilt}/10</p>
            </div>
          </div>
        )}

        {/* Match List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Recent Matches</h2>
          {matches.length > 0 && <span className="text-gray-500 text-sm">{matches.length} total</span>}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-white font-bold text-xl mb-2">No matches yet</p>
            <p className="text-gray-500 mb-6">Log your first game to start tracking</p>
            <Link href="/new" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl transition-colors">
              + Log First Match
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map(m => (
              <div key={m.id} className="group bg-[#0d1220] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`text-xs font-bold px-2 py-0.5 rounded border ${MODE_COLOR[m.mode] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                      {m.mode}
                    </div>
                    {m.win && <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">#1 VICTORY</span>}
                    {!m.win && <span className="text-xs text-gray-500">#{m.placement}</span>}
                  </div>
                  <span className="text-xs text-gray-600">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-3 flex items-center gap-6 text-sm">
                  <span className="text-white font-bold">{m.kills} <span className="text-gray-500 font-normal text-xs">kills</span></span>
                  <span className="text-gray-400">{m.assists} <span className="text-gray-500 text-xs">assists</span></span>
                  <span className="text-gray-400">{m.survived}m <span className="text-gray-500 text-xs">survived</span></span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="text-gray-500 text-xs">Tilt</span>
                    <div className="flex gap-0.5">
                      {Array.from({length:10},(_,i) => (
                        <div key={i} className={`w-1.5 h-3 rounded-sm ${i < m.tilt ? (m.tilt >= 7 ? "bg-red-500" : m.tilt >= 4 ? "bg-yellow-500" : "bg-green-500") : "bg-white/10"}`} />
                      ))}
                    </div>
                    <span className="text-xs">{MOOD_EMOJI[m.mood] || ""}</span>
                  </span>
                </div>
                {m.notes && <p className="mt-2 text-xs text-gray-500 italic">"{m.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
