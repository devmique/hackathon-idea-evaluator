'use client'

import { useState } from 'react'

interface AISuggestionsProps {
  ideaId: number
  ideaName: string
  description: string
  initialSuggestions?: string
}

export default function AISuggestions({
  ideaId,
  ideaName,
  description,
  initialSuggestions,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSuggestions = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, ideaName, description }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuggestions(data.suggestions)
      } else {
        setError(data.error || 'Failed to generate suggestions.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate suggestions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">✨</span>
        <h3 className="font-semibold text-foreground">AI-Generated Suggestions</h3>
      </div>

      {!suggestions && (
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          {loading ? 'Generating...' : 'Generate AI Suggestions'}
        </button>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {suggestions && (
        <div className="text-sm text-foreground whitespace-pre-wrap space-y-2 mt-4">
          {suggestions.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}
