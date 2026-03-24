import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateIdeaSuggestions(
  ideaName: string,
  description: string
): Promise<string> {

  if (!process.env.GEMINI_API_KEY) {
    return 'Missing GEMINI_API_KEY'
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5',
  })

  const prompt = `You are an expert hackathon mentor evaluating startup ideas.

An idea has been submitted:
- Name: ${ideaName}
- Description: ${description}

Provide 3-4 actionable suggestions:
1. Improve value proposition
2. Make it feasible in hackathon
3. Increase impact
4. Possible challenges

Format as numbered list.`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (err: any) {
    console.error(err)

    if (err.message?.includes('429')) {
      await new Promise(res => setTimeout(res, 3000))
      const retry = await model.generateContent(prompt)
      return retry.response.text()
    }

    return 'Failed to generate suggestions.'
  }
}
