'use client'

interface AISuggestionsProps {
  suggestions?: string
  loading?: boolean
}

export default function AISuggestions({ suggestions, loading = false }: AISuggestionsProps) {
  if (loading) {
    return (
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-primary/20 rounded-full animate-spin"></div>
          <h3 className="font-semibold text-foreground">AI Suggestions Loading...</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Our AI is analyzing this idea to provide improvement suggestions.
        </p>
      </div>
    )
  }

  if (!suggestions) {
    return null
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">✨</span>
        <h3 className="font-semibold text-foreground">AI-Generated Suggestions</h3>
      </div>
      <div className="text-sm text-foreground whitespace-pre-wrap space-y-2">
        {suggestions.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  )
}
