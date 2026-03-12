'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Match = { id: number; placement: number; kills: number; tilt: number; win: boolean; mode: string; survived: number }

export default function Stats() {
  const [matches, setMatches] = useState<Match[]>([])
  useEffect(() => { fetch('/api/matches').then(r => r.json()).then(setMatches) }, [])

  const total = matches.length
  const wins = matches.filter(m => m.win).length
  const avgKills = total ? (matches.reduce((a, m) => a + m.kills, 0) / total).toFixed(1) : '0'
  const avgTilt = total ? (matches.reduce((a, m) => a + m.tilt, 0) / total).toFixed(1) : '0'
  const avgPlacement = total ? (matches.reduce((a, m) => a + m.placement, 0) / total).toFixed(1) : '0'
  const winRate = total ? ((wins / total) * 100).toFixed(1) : '0'

  const tiltBuckets = [0,0,0] // low 1-3, mid 4-6, high 7-10
  matches.forEach(m => { if (m.tilt <= 3) tiltBuckets[0]++; else if (m.tilt <= 6) tiltBuckets[1]++; else tiltBuckets[2]++ })

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-yellow-400">← Back</Link>
        <h1 className="text-2xl font-bold text-yellow-400">Your Stats</h1>
      </div>
      {total === 0 && <p className="text-gray-400 text-center mt-20">No matches yet!</p>}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[['Total Matches', total],['Wins', wins],['Win Rate', winRate + '%'],['Avg Kills', avgKills],['Avg Placement', '#' + avgPlacement],['Avg Tilt', avgTilt + '/10']].map(([l, v]) => (
          <div key={l as string} className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">{l}</p>
            <p className="text-2xl font-bold text-yellow-400">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
        <h2 className="font-bold mb-3">Tilt Distribution</h2>
        {[['Low (1-3)', tiltBuckets[0], 'bg-green-500'],['Mid (4-6)', tiltBuckets[1], 'bg-yellow-400'],['High (7-10)', tiltBuckets[2], 'bg-red-500']].map(([l, v, c]) => (
          <div key={l as string} className="mb-2">
            <div className="flex justify-between text-sm mb-1"><span>{l}</span><span>{v} games</span></div>
            <div className="bg-gray-700 rounded-full h-2"><div className={`${c} rounded-full h-2`} style={{width: total ? `${((v as number)/total)*100}%` : '0%'}} /></div>
          </div>
        ))}
      </div>
    </main>
  )
}
