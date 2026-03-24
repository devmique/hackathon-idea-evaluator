import { createIdea, getAllIdeas, getIdeasWithRanking } from '@/lib/db'
import { generateIdeaSuggestions } from '@/lib/ai'
import { updateIdeaAiSuggestions } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, description, track } = await request.json()

    if (!name || !description || !track) {
      return Response.json(
        { error: 'Missing required fields: name, description, track' },
        { status: 400 }
      )
    }

    // Create the idea
    const idea = await createIdea(name, description, track)

    // Generate AI suggestions asynchronously (don't wait for it)
    generateIdeaSuggestions(name, description)
      .then((suggestions) => {
        updateIdeaAiSuggestions(idea.id, suggestions).catch((err) =>
          console.error('Error updating AI suggestions:', err)
        )
      })
      .catch((err) => console.error('Error generating AI suggestions:', err))

    return Response.json(idea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return Response.json({ error: 'Failed to create idea' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const withRanking = searchParams.get('withRanking') === 'true'

    if (withRanking) {
      const ideas = await getIdeasWithRanking()
      return Response.json(ideas)
    }

    const ideas = await getAllIdeas()
    return Response.json(ideas)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return Response.json({ error: 'Failed to fetch ideas' }, { status: 500 })
  }
}
