import Link from 'next/link'
import type { Idea } from '@/lib/db'

interface IdeaCardProps {
  idea: Idea & {
    total_score?: number
    evaluation_count?: number
    rank?: number
  }
  showRank?: boolean
}

export default function IdeaCard({ idea, showRank = false }: IdeaCardProps) {
  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="border border-border rounded-lg p-4 sm:p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer h-full bg-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
              {idea.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                {idea.track}
              </span>
              {showRank && idea.rank && (
                <span className="inline-block px-2 py-1 text-xs font-bold bg-primary text-primary-foreground rounded">
                  #{idea.rank}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {idea.description}
        </p>

        {showRank && idea.total_score !== undefined && (
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Total Score</p>
              <p className="text-lg font-bold text-primary">
                {idea.total_score.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Evaluations</p>
              <p className="text-lg font-bold text-primary">
                {idea.evaluation_count}
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Submitted {new Date(idea.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
