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
      { message: "Not authorized to generate title." },
      { status: 401 }
    );
  }

  const prompt = `Based on the following blog content, generate relevant, concise, and SEO-friendly title. Ensure that the title is catchy, descriptive, and effectively captures the main topics, themes, and keywords: "${content}" 
  return only one title that best represents the content and keep normal text only (means dont add ## etc.).`;

  try {
    const response = await generateResponse(prompt);
    return NextResponse.json({ title: response });
  } catch (error) {
    console.error("Error generating title", error);
    return NextResponse.json(
      { message: "Error generating title.", error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ message: "This is a GET request" });
}
