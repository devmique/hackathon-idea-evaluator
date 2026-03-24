import { createEvaluation, hasEvaluatorEvaluatedIdea, getEvaluatorNames } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { idea_id, evaluator_name, scores } = await request.json()

    if (!idea_id || !evaluator_name || !scores || scores.length === 0) {
      return Response.json(
        { error: 'Missing required fields: idea_id, evaluator_name, scores' },
        { status: 400 }
      )
    }

    // Check if evaluator has already evaluated this idea
    const alreadyEvaluated = await hasEvaluatorEvaluatedIdea(idea_id, evaluator_name)
    if (alreadyEvaluated) {
      return Response.json(
        { error: 'This evaluator has already evaluated this idea' },
        { status: 409 }
      )
    }

    // Validate scores
    const validCriteria = [
      'Innovation',
      'Feasibility',
      'Impact',
      'Market Potential',
      'Team Capability',
      'Scalability',
      'User Experience',
      'Business Model',
    ]

    for (const score of scores) {
      if (!validCriteria.includes(score.criterion)) {
        return Response.json(
          { error: `Invalid criterion: ${score.criterion}` },
          { status: 400 }
        )
      }
      if (score.score < 1 || score.score > 10) {
        return Response.json(
          { error: `Score must be between 1 and 10 for ${score.criterion}` },
          { status: 400 }
        )
      }
    }

    const evaluation = await createEvaluation(idea_id, evaluator_name, scores)

    return Response.json(evaluation, { status: 201 })
  } catch (error) {
    console.error('Error creating evaluation:', error)
    return Response.json({ error: 'Failed to create evaluation' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const evaluators = await getEvaluatorNames()
    return Response.json({ evaluators })
  } catch (error) {
    console.error('Error fetching evaluators:', error)
    return Response.json({ error: 'Failed to fetch evaluators' }, { status: 500 })
  }
}
