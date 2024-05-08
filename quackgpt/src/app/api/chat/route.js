import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
const { GPTTokens } = require("gpt-tokens");

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  //organization: process.env.OPENAI_ORG_ID,
});

function isWithinTokenLimit(model, messages, maxContext) {
  const gptTokens = new GPTTokens({
    model,
    messages,
  });
  console.log(gptTokens.usedTokens);
  return gptTokens.usedTokens < maxContext;
}

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const checkContextLimit = searchParams.get("checkContextLimit") === "true";

  const { messages } = await req.json();
  const models = [
    {
      name: "gpt-3.5-turbo",
      maxContext: 4096,
    },
    {
      name: "gpt-3.5-turbo-0125",
      maxContext: 16385,
    },
  ];

  // Set model based on token count
  let model = null;
  for (let i = 0; i < models.length; i++) {
    if (isWithinTokenLimit(models[i].name, messages, models[i].maxContext)) {
      model = models[i].name;
      break;
    }
  }
  if (checkContextLimit) {
    // Check for when checkContextLimit is set
    return NextResponse.json({
      isWithinTokenLimit: model != null,
    });
  }
  if (model == null) {
    throw new Error("Stop here please");
  }

  console.log("about to send:", messages);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: model,
    stream: true,
    messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
