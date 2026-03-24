import { notFound } from 'next/navigation'
import Header from '@/components/header'
import AISuggestions from '@/components/ai-suggestions'
import ScoreDisplay from '@/components/score-display'
import EvaluationForm from '@/components/evaluation-form'
import { getIdea, getEvaluationsByIdea, getScoresForIdea } from '@/lib/db'
// Add these imports at the top
import { generateIdeaSuggestions } from '@/lib/ai'
import { updateIdeaAiSuggestions } from '@/lib/db'
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idea = await getIdea(parseInt(id, 10))
  if (!idea) return { title: 'Idea Not Found' }
  return {
    title: `${idea.name} - Hackathon Evaluator`,
    description: idea.description.substring(0, 160),
  }
}

interface IdeaDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function IdeaDetailsPage({ params }: IdeaDetailsPageProps) {
  const { id } = await params
  const ideaId = parseInt(id, 10)

  if (isNaN(ideaId)) {
    notFound()
  }

  const idea = await getIdea(ideaId)
  if (!idea) {
    notFound()
  }
 


  const evaluations = await getEvaluationsByIdea(ideaId)
  const scores = await getScoresForIdea(ideaId)

  // Calculate averages
  const averageScores: Record<string, number> = {}
  const criteria = [
    'Innovation',
    'Feasibility',
    'Impact',
    'Market Potential',
    'Team Capability',
    'Scalability',
    'User Experience',
    'Business Model',
  ]

  criteria.forEach((criterion) => {
    const criterionScores = scores.filter((s) => s.criterion === criterion)
    if (criterionScores.length > 0) {
      const sum = criterionScores.reduce((acc, s) => acc + s.avg_score, 0)
      averageScores[criterion] = sum / criterionScores.length
    }
  })

  // Calculate total score (weighted)
  const weights: Record<string, number> = {
    Innovation: 2,
    Feasibility: 2,
    Impact: 2,
    'Market Potential': 2,
    'Team Capability': 2,
    Scalability: 2,
    'User Experience': 2,
    'Business Model': 2,
  }

  let totalScore = 0
  Object.entries(averageScores).forEach(([criterion, score]) => {
    totalScore += score * (weights[criterion] || 1)
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-border rounded-lg p-6 sm:p-8 bg-card">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {idea.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded">
                    {idea.track}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Submitted {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                    {idea.description}
                  </p>
                </div>
              </div>

             
                <AISuggestions
  ideaId={ideaId}
  ideaName={idea.name}
  description={idea.description}
  suggestions={idea.ai_suggestions}
/>

         

              {evaluations.length > 0 && (
                <ScoreDisplay
                  averageScores={averageScores}
                  evaluationCount={evaluations.length}
                  totalScore={totalScore}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-6 sm:p-8 bg-card sticky top-4">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Evaluate This Idea
                </h2>
                <EvaluationForm ideaId={ideaId} ideaName={idea.name} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
