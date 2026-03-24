import Header from '@/components/header'
import IdeaCard from '@/components/idea-card'
import { getIdeasWithRanking } from '@/lib/db'

export const metadata = {
  title: 'Leaderboard - Hackathon Evaluator',
  description: 'View ranked hackathon ideas based on evaluation scores',
}

export default async function LeaderboardPage() {
  const ideasWithRanking = await getIdeasWithRanking()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h2>
            <p className="text-muted-foreground">
              Ideas ranked by total evaluation scores across all criteria
            </p>
          </div>

          {ideasWithRanking.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No evaluated ideas yet. Submit an idea and get it evaluated!
              </p>
              <a
                href="/submit"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit Your Idea
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideasWithRanking.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    showRank={true}
                  />
                ))}
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Scoring System
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Innovation', weight: 2 },
                    { name: 'Feasibility', weight: 2 },
                    { name: 'Impact', weight: 2 },
                    { name: 'Market Potential', weight: 2 },
                    { name: 'Team Capability', weight: 2 },
                    { name: 'Scalability', weight: 2 },
                    { name: 'User Experience', weight: 2 },
                    { name: 'Business Model', weight: 2 },
                  ].map((criterion) => (
                    <div
                      key={criterion.name}
                      className="flex items-center justify-between p-3 bg-card border border-border rounded"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {criterion.name}
                      </span>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        Weight: {criterion.weight}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
