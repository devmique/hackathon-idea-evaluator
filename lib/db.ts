import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface Idea {
  id: number
  name: string
  description: string
  track: string
  created_at: string
  ai_suggestions?: string
}

export interface Evaluation {
  id: number
  idea_id: number
  evaluator_name: string
  created_at: string
}

export interface Score {
  id: number
  evaluation_id: number
  criterion: string
  score: number
}

export interface IdeaWithScores extends Idea {
  total_score: number
  evaluation_count: number
  average_scores: Record<string, number>
  rank: number
}

// Ideas
export async function createIdea(name: string, description: string, track: string) {
  const result = await sql`
    INSERT INTO ideas (name, description, track)
    VALUES (${name}, ${description}, ${track})
    RETURNING id, name, description, track, created_at
  `
  return result[0] as Idea
}

export async function getIdea(id: number) {
  const result = await sql`
    SELECT * FROM ideas WHERE id = ${id}
  `
  return result[0] as Idea | undefined
}

export async function getAllIdeas() {
  const result = await sql`
    SELECT * FROM ideas ORDER BY created_at DESC
  `
  return result as Idea[]
}

export async function updateIdeaAiSuggestions(id: number, suggestions: string) {
  const result = await sql`
    UPDATE ideas SET ai_suggestions = ${suggestions}
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as Idea
}

// Evaluations
export async function createEvaluation(idea_id: number, evaluator_name: string, scores: Array<{ criterion: string; score: number }>) {
  const evalResult = await sql`
    INSERT INTO evaluations (idea_id, evaluator_name)
    VALUES (${idea_id}, ${evaluator_name})
    RETURNING id, idea_id, evaluator_name, created_at
  `

  const evaluation = evalResult[0] as Evaluation

  // Insert scores
  for (const { criterion, score } of scores) {
    await sql`
      INSERT INTO scores (evaluation_id, criterion, score)
      VALUES (${evaluation.id}, ${criterion}, ${score})
    `
  }

  return evaluation
}

export async function getEvaluationsByIdea(idea_id: number) {
  const result = await sql`
    SELECT * FROM evaluations WHERE idea_id = ${idea_id}
    ORDER BY created_at DESC
  `
  return result as Evaluation[]
}

export async function getEvaluatorNames() {
  const result = await sql`
    SELECT DISTINCT evaluator_name FROM evaluations
    ORDER BY evaluator_name
  `
  return result.map((r) => r.evaluator_name) as string[]
}

// Scores and Ranking
export async function getScoresForIdea(idea_id: number) {
  const result = await sql`
    SELECT s.criterion, AVG(s.score) as avg_score, COUNT(*) as count
    FROM scores s
    JOIN evaluations e ON s.evaluation_id = e.id
    WHERE e.idea_id = ${idea_id}
    GROUP BY s.criterion
  `
  return result
}

export async function getIdeasWithRanking() {
  // First get all ideas
  const ideas = await sql`
    SELECT DISTINCT i.* FROM ideas i
  `

  // Criteria and weights
  const criteria = [
    { name: 'Innovation', weight: 2 },
    { name: 'Feasibility', weight: 2 },
    { name: 'Impact', weight: 2 },
    { name: 'Market Potential', weight: 2 },
    { name: 'Team Capability', weight: 2 },
    { name: 'Scalability', weight: 2 },
    { name: 'User Experience', weight: 2 },
    { name: 'Business Model', weight: 2 },
  ]

  // Get all scores for all ideas
  const allScores = await sql`
    SELECT 
      e.idea_id,
      s.criterion,
      AVG(s.score) as avg_score,
      COUNT(DISTINCT e.id) as evaluation_count
    FROM scores s
    JOIN evaluations e ON s.evaluation_id = e.id
    GROUP BY e.idea_id, s.criterion
  `

  // Calculate totals for each idea
  const ideasWithScores = (ideas as Idea[]).map((idea) => {
    const ideaScores = allScores.filter((s) => s.idea_id === idea.id)
    const averageScores: Record<string, number> = {}
    let totalScore = 0

    criteria.forEach((criterion) => {
      const score = ideaScores.find((s) => s.criterion === criterion.name)
      const avgScore = score?.avg_score || 0
      averageScores[criterion.name] = avgScore
      totalScore += avgScore * criterion.weight
    })

    const evaluationCount = Math.max(
      ...ideaScores.map((s) => s.evaluation_count),
      0
    )

    return {
      ...idea,
      total_score: totalScore,
      evaluation_count: evaluationCount,
      average_scores: averageScores,
      rank: 0, // Will be set after sorting
    } as IdeaWithScores
  })

  // Sort by total score and assign ranks
  ideasWithScores.sort((a, b) => b.total_score - a.total_score)
  ideasWithScores.forEach((idea, index) => {
    idea.rank = index + 1
  })

  return ideasWithScores
}

export async function hasEvaluatorEvaluatedIdea(idea_id: number, evaluator_name: string) {
  const result = await sql`
    SELECT COUNT(*) as count FROM evaluations
    WHERE idea_id = ${idea_id} AND evaluator_name = ${evaluator_name}
  `
  return result[0].count > 0
}
