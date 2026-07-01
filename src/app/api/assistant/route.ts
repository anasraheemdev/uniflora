import { NextResponse } from "next/server";
import { getFamilyBySlug, familySlugFromName } from "@/data/families";
import { getPlantBySlug } from "@/data/plants";
import { answerPlantQuestion } from "@/lib/plant-assistant";
import { buildPlantContext } from "@/lib/plant-context";
import type { AssistantRequest, AssistantResponse } from "@/types/assistant";

async function callOpenAI(
  plantContext: string,
  plantLabel: string,
  messages: AssistantRequest["messages"],
  apiKey: string,
): Promise<string> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const systemPrompt = `You are UniFlora AI, a knowledgeable botanical assistant for a university campus flora platform in Pakistan/South Asia. Answer questions about ${plantLabel} using ONLY the plant data below. Be concise (2–4 short paragraphs max), accurate, and educational. Use markdown sparingly (**bold** for emphasis, bullet lists when helpful). If the data does not contain an answer, say so and suggest what the user could check on the species page or campus map. Never invent medicinal dosages or clinical advice — include a brief disclaimer for health-related questions.

PLANT DATA:
${plantContext}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.35,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${err.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}

export async function POST(request: Request) {
  let body: AssistantRequest;

  try {
    body = (await request.json()) as AssistantRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, messages } = body;

  if (!slug || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "slug and messages are required" }, { status: 400 });
  }

  const plant = getPlantBySlug(slug);
  if (!plant) {
    return NextResponse.json({ error: "Plant not found" }, { status: 404 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content?.trim()) {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  const family = getFamilyBySlug(familySlugFromName(plant.family));
  const plantLabel = `${plant.commonName} (${plant.scientificName})`;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    let message: string;
    let source: AssistantResponse["source"];

    if (apiKey) {
      message = await callOpenAI(buildPlantContext(plant, family), plantLabel, messages, apiKey);
      source = "openai";
    } else {
      message = answerPlantQuestion(plant, lastUser.content, family);
      source = "local";
    }

    const payload: AssistantResponse = { message, source };
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[assistant]", error);
    const fallback = answerPlantQuestion(plant, lastUser.content, family);
    const payload: AssistantResponse = {
      message: `${fallback}\n\n_Note: Live AI is temporarily unavailable; this answer was generated from the UniFlora database._`,
      source: "local",
    };
    return NextResponse.json(payload);
  }
}
