// app/navComponent/generateTagsFromContent.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const generateResponse = async (prompt: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
  }
};

const generateTagsFromContent = async (content: string) => {
  if (content.length < 100) {
  } else {
    const prompt = `Based on the following blog content, generate relevant, concise, and SEO-friendly tags. Ensure that the tags are descriptive and capture the core topics, themes, and keywords:

  "${content}"
  
  Return the tags as a comma-separated list.
  `;

    const response = await generateResponse(prompt);
    return response ? response.split(", ") : [];
  }
};

export default generateTagsFromContent;
