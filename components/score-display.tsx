interface ScoreDisplayProps {
  averageScores: Record<string, number>
  evaluationCount: number
  totalScore: number
}

const CRITERIA_WEIGHTS: Record<string, number> = {
  Innovation: 2,
  Feasibility: 2,
  Impact: 2,
  'Market Potential': 2,
  'Team Capability': 2,
  Scalability: 2,
  'User Experience': 2,
  'Business Model': 2,
}

export default function ScoreDisplay({
  averageScores,
  evaluationCount,
  totalScore,
}: ScoreDisplayProps) {
  const sortedCriteria = Object.entries(averageScores).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">Total Score</p>
          <p className="text-2xl font-bold text-primary">{totalScore.toFixed(1)}</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">Evaluations</p>
          <p className="text-2xl font-bold text-primary">{evaluationCount}</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">Avg Score</p>
          <p className="text-2xl font-bold text-primary">
            {evaluationCount > 0
              ? (
                  Object.values(averageScores).reduce((a, b) => a + b, 0) /
                  Object.keys(averageScores).length
                ).toFixed(1)
              : 'N/A'}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground">Max Score</p>
          <p className="text-2xl font-bold text-primary">
            {Math.max(...Object.values(averageScores), 0).toFixed(1)}
          </p>
        </div>
      </div>

      {evaluationCount > 0 && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Criteria Scores</h3>
          <div className="space-y-4">
            {sortedCriteria.map(([criterion, score]) => (
              <div key={criterion}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{criterion}</span>
                  <span className="text-sm font-bold text-primary">{score.toFixed(2)}/10</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
