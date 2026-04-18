import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { prisma } from "../database/client";
import { getChatbotResponse } from "../utils/chatbot";

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, sessionToken: incomingToken } = req.body;

    const sessionToken: string = incomingToken ?? randomUUID();
    const response = getChatbotResponse(message);

    await prisma.chatLog.create({ data: { sessionToken, message, response } });

    res.json({ status: "success", data: { sessionToken, response } });
  } catch (error) {
    throw error;
  }
};
