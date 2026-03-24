import Header from '@/components/header'
import IdeaCard from '@/components/idea-card'
import { getAllIdeas } from '@/lib/db'

export default async function Dashboard() {
  const ideas = await getAllIdeas()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Recent Ideas</h2>
            <p className="text-muted-foreground">
              {ideas.length} idea{ideas.length !== 1 ? 's' : ''} submitted for evaluation
            </p>
          </div>

          {ideas.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">No ideas submitted yet</p>
              <a
                href="/submit"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit Your First Idea
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
