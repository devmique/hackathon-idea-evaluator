'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EvaluationFormProps {
  ideaId: number
  ideaName: string
}

const CRITERIA = [
  { name: 'Innovation', description: 'How innovative and novel is this idea?' },
  { name: 'Feasibility', description: 'Can this be built in a hackathon timeframe?' },
  { name: 'Impact', description: 'What is the potential impact of this idea?' },
  { name: 'Market Potential', description: 'Does this have commercial potential?' },
  { name: 'Team Capability', description: 'Is the team capable of executing this?' },
  { name: 'Scalability', description: 'Can this idea scale long-term?' },
  { name: 'User Experience', description: 'Is the user experience well-designed?' },
  { name: 'Business Model', description: 'Is there a viable business model?' },
]

export default function EvaluationForm({ ideaId, ideaName }: EvaluationFormProps) {
  const router = useRouter()
  const [evaluatorName, setEvaluatorName] = useState('')
  const [scores, setScores] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScoreChange = (criterion: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criterion]: value,
    }))
  }

  const isFormValid =
    evaluatorName.trim().length > 0 && Object.keys(scores).length === CRITERIA.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    setError(null)

    try {
      const scoresArray = CRITERIA.map((criterion) => ({
        criterion: criterion.name,
        score: scores[criterion.name] || 5,
      }))

      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_id: ideaId,
          evaluator_name: evaluatorName,
          scores: scoresArray,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit evaluation')
      }

      router.push(`/ideas/${ideaId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={evaluatorName}
          onChange={(e) => setEvaluatorName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Evaluate "{ideaName}"
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Score each criterion on a scale of 1-10
        </p>

        <div className="space-y-6">
          {CRITERIA.map((criterion) => (
            <div key={criterion.name} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{criterion.name}</h4>
                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                </div>
                <span className="text-lg font-bold text-primary">
                  {scores[criterion.name] || '-'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores[criterion.name] || 5}
                onChange={(e) => handleScoreChange(criterion.name, parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? 'Submitting...' : 'Submit Evaluation'}
      </button>
    </form>
  )
}
