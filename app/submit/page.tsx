import Header from '@/components/header'
import SubmitForm from '@/components/submit-form'

export const metadata = {
  title: 'Submit Your Idea - Hackathon Evaluator',
  description: 'Submit your hackathon idea for evaluation and AI-powered suggestions',
}

export default function SubmitPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Submit Your Idea</h2>
            <p className="text-muted-foreground">
              Share your hackathon idea and get constructive feedback from evaluators and AI-powered suggestions to improve it.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 sm:p-8 bg-card">
            <SubmitForm />
          </div>
        </div>
      </main>
    </>
  )
}
