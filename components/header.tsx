import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Hackathon Ideas Evaluator
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Submit ideas, get evaluated, improve with AI
              </p>
            </div>
          </Link>
          <nav className="flex gap-2 sm:gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Submit Idea
            </Link>
            <Link
              href="/evaluate"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Evaluate
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Leaderboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
