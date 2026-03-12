'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Match = {
  id: number; date: string; mode: string; placement: number
  kills: number; tilt: number; win: boolean; mood: string; notes: string
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    fetch('/api/matches').then(r => r.json()).then(setMatches)
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Fortnite Tracker</h1>
        <div className="flex gap-2">
          <Link href="/new" className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl">+ Match</Link>
          <Link href="/stats" className="bg-gray-700 text-white font-bold px-4 py-2 rounded-xl">Stats</Link>
        </div>
      </div>
      {matches.length === 0 && <p className="text-gray-400 text-center mt-20">No matches yet. Log your first game!</p>}
      <div className="flex flex-col gap-3">
        {matches.map(m => (
          <div key={m.id} className={`rounded-2xl p-4 border ${m.win ? 'border-yellow-400 bg-yellow-950' : 'border-gray-700 bg-gray-900'}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-lg">{m.mode}</span>
                {m.win && <span className="ml-2 text-yellow-400 font-bold">VICTORY ROYALE</span>}
                <p className="text-gray-400 text-sm">{new Date(m.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">#{m.placement}</p>
                <p className="text-sm text-gray-400">{m.kills}K</p>
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Tilt: <span className={m.tilt >= 8 ? 'text-red-400' : m.tilt >= 5 ? 'text-yellow-400' : 'text-green-400'}>{m.tilt}/10</span></span>
              <span>Mood: {m.mood}</span>
            </div>
            {m.notes && <p className="text-gray-400 text-sm mt-1 italic">{m.notes}</p>}
          </div>
        ))}
      </div>
    </main>
  )
}
