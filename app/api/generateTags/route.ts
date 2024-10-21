// pages/api/generateTitle.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getSessionAtHome } from "@/auth";

const generateResponse = async (prompt: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export async function POST(req: NextRequest, res: NextResponse) {
  const { content } = await req.json();
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      { message: "Not authorized to generate tags." },
      { status: 401 }
    );
  }

  const prompt = `Based on the following blog content, generate relevant, concise, and SEO-friendly tags. Ensure that the tags are descriptive and capture the core topics, themes, and keywords:

  "${content}"
  
  Return the tags as a comma-separated list.
  `;
  try {
    const response = await generateResponse(prompt);
    return NextResponse.json({ tags: response.split(", ") });
  } catch (error) {
    return NextResponse.json(
      { message: "Error generating tags.", error },
      { status: 500 }
    );
  }
}
