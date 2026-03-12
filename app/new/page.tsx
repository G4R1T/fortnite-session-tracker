'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMatch() {
  const router = useRouter()
  const [form, setForm] = useState({
    mode: 'Solos', placement: '1', kills: '0', assists: '0',
    survived: '0', tilt: '5', mood: 'neutral', notes: ''
  })
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await fetch('/api/matches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Log a Match</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-400">Mode</label>
          <select value={form.mode} onChange={e => set('mode', e.target.value)} className="w-full bg-gray-800 rounded-xl p-3 mt-1">
            {['Solos','Duos','Trios','Squads','Zero Build Solos','Zero Build Squads'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        {[['placement','Placement (1 = win)'],['kills','Kills'],['assists','Assists'],['survived','Minutes Survived']].map(([k,l]) => (
          <div key={k}>
            <label className="text-sm text-gray-400">{l}</label>
            <input type="number" value={(form as any)[k]} onChange={e => set(k, e.target.value)} className="w-full bg-gray-800 rounded-xl p-3 mt-1" min="0" />
          </div>
        ))}
        <div>
          <label className="text-sm text-gray-400">Tilt Level: {form.tilt}/10</label>
          <input type="range" min="1" max="10" value={form.tilt} onChange={e => set('tilt', e.target.value)} className="w-full mt-2" />
          <div className="flex justify-between text-xs text-gray-500"><span>Chill</span><span>Max Tilt</span></div>
        </div>
        <div>
          <label className="text-sm text-gray-400">Mood</label>
          <select value={form.mood} onChange={e => set('mood', e.target.value)} className="w-full bg-gray-800 rounded-xl p-3 mt-1">
            {['cracked','focused','neutral','tilted','exhausted','grinding'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="w-full bg-gray-800 rounded-xl p-3 mt-1" rows={3} placeholder="What happened?" />
        </div>
        <button type="submit" disabled={loading} className="bg-yellow-400 text-black font-bold py-3 rounded-xl text-lg mt-2">
          {loading ? 'Saving...' : 'Save Match'}
        </button>
        <button type="button" onClick={() => router.push('/')} className="text-gray-400 text-sm text-center">Cancel</button>
      </form>
    </main>
  )
}
