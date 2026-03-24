import { generateIdeaSuggestions } from '@/lib/ai'
import { updateIdeaAiSuggestions } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { ideaId, ideaName, description } = await request.json()

    if (!ideaId || !ideaName || !description) {
      return Response.json(
        { error: 'Missing required fields: ideaId, ideaName, description' },
        { status: 400 }
      )
    }

    // Generate suggestions
    const suggestions = await generateIdeaSuggestions(ideaName, description)

    // Save to database
    await updateIdeaAiSuggestions(ideaId, suggestions)

    return Response.json({ suggestions })
  } catch (error) {
    console.error('Error in suggestions API:', error)
    return Response.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
