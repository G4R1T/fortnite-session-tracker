
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const MODES = ["Solos","Duos","Trios","Squads"]
const MOODS = ["neutral","focused","tilted","on fire","checked out"]
const MOOD_EMOJI: Record<string,string> = { neutral:"😐", focused:"🎯", tilted:"😤", "on fire":"🔥", "checked out":"😶" }

export default function NewMatch() {
  const router = useRouter()
  const [form, setForm] = useState({ mode:"Solos", placement:1, kills:0, assists:0, survived:0, tilt:5, mood:"neutral", notes:"" })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: any) => setForm(f => ({...f, [k]:v}))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await fetch("/api/matches", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) })
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <header className="border-b border-white/5 bg-[#0d1220]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-sm">FN</div>
            <span className="font-bold text-white text-lg tracking-tight">Fortnite Tracker</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Cancel</Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-white mb-6">Log a Match</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mode */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Mode</label>
            <div className="grid grid-cols-4 gap-2">
              {MODES.map(m => (
                <button key={m} type="button" onClick={()=>set("mode",m)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                    form.mode===m ? "bg-yellow-400 text-black border-yellow-400" : "bg-[#0d1220] text-gray-400 border-white/10 hover:border-white/20"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Placement */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Placement <span className="text-yellow-400">{form.placement === 1 ? "#1 VICTORY" : `#${form.placement}`}</span></label>
            <input type="number" min="1" max="100" value={form.placement} onChange={e=>set("placement",+e.target.value)}
              className="w-full bg-[#0d1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 text-lg font-bold" />
          </div>

          {/* Kills + Assists */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Kills</label>
              <input type="number" min="0" value={form.kills} onChange={e=>set("kills",+e.target.value)}
                className="w-full bg-[#0d1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 text-lg font-bold" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Assists</label>
              <input type="number" min="0" value={form.assists} onChange={e=>set("assists",+e.target.value)}
                className="w-full bg-[#0d1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 text-lg font-bold" />
            </div>
          </div>

          {/* Survived */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Minutes Survived</label>
            <input type="number" min="0" value={form.survived} onChange={e=>set("survived",+e.target.value)}
              className="w-full bg-[#0d1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 text-lg font-bold" />
          </div>

          {/* Tilt Slider */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
              Tilt Level <span className={form.tilt >= 7 ? "text-red-400" : form.tilt >= 4 ? "text-yellow-400" : "text-green-400"}>{form.tilt}/10</span>
            </label>
            <div className="flex gap-1 mb-2">
              {Array.from({length:10},(_,i) => (
                <button key={i} type="button" onClick={()=>set("tilt",i+1)}
                  className={`flex-1 h-6 rounded transition-all ${
                    i < form.tilt ? (form.tilt >= 7 ? "bg-red-500" : form.tilt >= 4 ? "bg-yellow-500" : "bg-green-500") : "bg-white/10 hover:bg-white/20"
                  }`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Chill</span><span>Max Tilt</span>
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Mood</label>
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map(m => (
                <button key={m} type="button" onClick={()=>set("mood",m)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    form.mood===m ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-[#0d1220] text-gray-500 border-white/10 hover:border-white/20"
                  }`}>
                  <span className="text-lg">{MOOD_EMOJI[m]}</span>
                  <span className="capitalize">{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Notes <span className="text-gray-600 normal-case">(optional)</span></label>
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={3}
              placeholder="What happened this game?"
              className="w-full bg-[#0d1220] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-500/50 resize-none text-sm" />
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-black text-lg rounded-xl transition-colors">
            {saving ? "Saving..." : "Save Match"}
          </button>
        </form>
      </div>
    </main>
  )
}
