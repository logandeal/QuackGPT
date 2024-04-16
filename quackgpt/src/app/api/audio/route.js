import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const apiKey = process.env.OPENAI_API_KEY; // Replace with your actual API key
const openai = new OpenAI({ apiKey });

export async function POST(req) {
  const formData = await req.formData();

  const transcription = await openai.audio.transcriptions.create({
    file: formData.get("file"),
    model: "whisper-1",
    language: "en", // this is optional but helps the model
  });

  return NextResponse.json({
    text: transcription.text,
  });
}
