import { Request, Response } from "express";
import { randomUUID } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../database/client";
import { CustomError } from "../utils/CustomError";
import config from "../config/config";

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable health assistant for GenCare Hub, a platform providing confidential health services to young people in Rwanda.

Your role is to:
- Answer health questions clearly, especially about sexual health, HIV/AIDS, STIs, mental health, family planning, and general wellness
- Be non-judgmental, empathetic, and culturally sensitive to Rwandan youth
- Encourage users to book an anonymous consultation when the topic requires professional care
- Keep responses concise (2–4 sentences) and easy to understand
- Never diagnose — always recommend professional consultation for specific concerns
- Respect user privacy — never ask for personal identifying information

Available services users can book anonymously:
1. HIV/STI Testing & Counseling (30 min)
2. Family Planning Consultation (45 min)
3. Mental Health Support (60 min)
4. General Health Check-up (30 min)

Respond in the same language the user writes in (English, French, or Kinyarwanda).`;

export const chat = async (req: Request, res: Response) => {
  try {
    if (!config.anthropicApiKey) {
      throw new CustomError("Chatbot service is not configured", 503);
    }

    const { message, sessionToken: incomingToken } = req.body;
    const sessionToken: string = incomingToken ?? randomUUID();

    // Fetch last 5 exchanges for this session to maintain context
    const history = await prisma.chatLog.findMany({
      where: { sessionToken },
      orderBy: { createdAt: "asc" },
      take: 5,
    });

    const messages: Anthropic.MessageParam[] = [
      ...history.flatMap((log) => [
        { role: "user" as const, content: log.message },
        { role: "assistant" as const, content: log.response },
      ]),
      { role: "user" as const, content: message },
    ];

    const aiResponse = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const response =
      aiResponse.content[0].type === "text"
        ? aiResponse.content[0].text
        : "I'm sorry, I could not process your request. Please try again.";

    await prisma.chatLog.create({ data: { sessionToken, message, response } });

    res.json({ status: "success", data: { sessionToken, response } });
  } catch (error) {
    throw error;
  }
};
