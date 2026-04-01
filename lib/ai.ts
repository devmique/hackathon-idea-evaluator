"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateIdeaSuggestions(
  ideaName: string,
  description: string
): Promise<string> {

 
  const prompt = `
You are an expert hackathon mentor evaluating startup ideas.

An idea has been submitted:
- Name: ${ideaName}
- Description: ${description}

Provide 3-4 actionable suggestions:
1. Improve value proposition
2. Make it feasible in hackathon
3. Increase impact
4. Possible challenges

Format as numbered list.
`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    return text;
  } catch (error: any) {
    console.error(error);

    if (error.message?.includes("429")) {
      await new Promise((res) => setTimeout(res, 3000));

      const { text } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt,
      });

      return text;
    }

    return "Failed to generate suggestions.";
  }
}
