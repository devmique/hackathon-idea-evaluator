import { generateText } from 'ai'

// Uses Vercel AI Gateway by default (no provider package needed)
const DEFAULT_MODEL = 'openai/gpt-4o-mini'

export async function generateIdeaSuggestions(ideaName: string, description: string): Promise<string> {
  try {
    const prompt = `You are an expert hackathon mentor evaluating startup ideas. 
    
An idea has been submitted with the following details:
- Name: ${ideaName}
- Description: ${description}

Please provide 3-4 specific, actionable suggestions to improve this idea and make it more viable for a hackathon competition. Focus on:
1. How to strengthen the core value proposition
2. How to make it more feasible to build within hackathon timeframe
3. How to increase market appeal or impact
4. Any potential technical or business challenges to address

Format your response as a numbered list with concise suggestions.`

    const result = await generateText({
      model: DEFAULT_MODEL,
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.text
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return 'Unable to generate suggestions at this time. Please try again later.'
  }
}
