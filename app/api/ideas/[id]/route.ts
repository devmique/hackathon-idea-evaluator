import { getIdea, getEvaluationsByIdea, getScoresForIdea } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ideaId = parseInt(id, 10)

    if (isNaN(ideaId)) {
      return Response.json({ error: 'Invalid idea ID' }, { status: 400 })
    }

    const idea = await getIdea(ideaId)
    if (!idea) {
      return Response.json({ error: 'Idea not found' }, { status: 404 })
    }

    const evaluations = await getEvaluationsByIdea(ideaId)
    const scores = await getScoresForIdea(ideaId)

    return Response.json({
      idea,
      evaluations,
      scores,
    })
  } catch (error) {
    console.error('Error fetching idea details:', error)
    return Response.json({ error: 'Failed to fetch idea details' }, { status: 500 })
  }
}
