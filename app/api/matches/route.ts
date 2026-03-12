import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const matches = await prisma.match.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(matches)
}

export async function POST(req: Request) {
  const body = await req.json()
  const match = await prisma.match.create({
    data: {
      mode: body.mode,
      placement: Number(body.placement),
      kills: Number(body.kills),
      assists: Number(body.assists),
      survived: Number(body.survived),
      tilt: Number(body.tilt),
      mood: body.mood,
      notes: body.notes,
      win: Number(body.placement) === 1,
    },
  })
  return NextResponse.json(match, { status: 201 })
}
