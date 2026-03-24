import Header from '@/components/header'
import IdeaCard from '@/components/idea-card'
import { getAllIdeas, getEvaluatorNames } from '@/lib/db'

export const metadata = {
  title: 'Evaluate Ideas - Hackathon Evaluator',
  description: 'Review and evaluate hackathon ideas with structured feedback criteria',
}

export default async function EvaluatePage() {
  const ideas = await getAllIdeas()
  const evaluators = await getEvaluatorNames()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Evaluate Ideas</h2>
            <p className="text-muted-foreground">
              Choose an idea to evaluate and provide structured feedback on 8 key criteria.
            </p>
          </div>

          {ideas.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">No ideas to evaluate yet</p>
              <a
                href="/submit"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit an Idea
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>

              {evaluators.length > 0 && (
                <div className="mt-12 border-t border-border pt-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Evaluators ({evaluators.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {evaluators.map((evaluator) => (
                      <span
                        key={evaluator}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                      >
                        {evaluator}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
