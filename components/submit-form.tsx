'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TRACKS = [
  'AI & Machine Learning',
  'Web3 & Blockchain',
  'Climate & Sustainability',
  'FinTech',
  'Healthcare & Biotech',
  'Social Impact',
  'Gaming & Metaverse',
  'Other',
]

export default function SubmitForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    track: TRACKS[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isFormValid = formData.name.trim() && formData.description.trim() && formData.track

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit idea')
      }

      const idea = await response.json()
      router.push(`/ideas/${idea.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Idea Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Give your idea a catchy name"
          maxLength={100}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.name.length}/100 characters
        </p>
      </div>

      <div>
        <label htmlFor="track" className="block text-sm font-medium text-foreground mb-2">
          Track *
        </label>
        <select
          id="track"
          name="track"
          value={formData.track}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {TRACKS.map((track) => (
            <option key={track} value={track}>
              {track}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your idea. What problem does it solve? Who are the users? Why is it innovative?"
          rows={8}
          maxLength={2000}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.description.length}/2000 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? 'Submitting...' : 'Submit Your Idea'}
      </button>
    </form>
  )
}
