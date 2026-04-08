// saas-backend/src/app/api/leads/route.ts

import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Define the exact shape of the data we expect from the AI Agent
const leadSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  companySize: z.string().optional(),
  useCase: z.string().optional(),
  telegramChatId: z.string(), // To link the lead back to the Telegram conversation
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 2. Validate the incoming payload using Zod
    const validatedData = leadSchema.parse(body);

    // 3. Save the Lead to the Database
    // We use upsert so if an email already exists, we just update their info
    const lead = await prisma.lead.upsert({
      where: {
        email: validatedData.email,
      },
      update: {
        companySize: validatedData.companySize,
        useCase: validatedData.useCase,
        status: "CONTACTED",
      },
      create: {
        email: validatedData.email,
        companySize: validatedData.companySize,
        useCase: validatedData.useCase,
      },
    });

    // 4. Update the Telegram User's state to reflect they are now a Lead
    await prisma.telegramUser.upsert({
      where: { chatId: validatedData.telegramChatId },
      update: { state: "LEAD_CAPTURED" },
      create: {
        chatId: validatedData.telegramChatId,
        state: "LEAD_CAPTURED",
      }
    });

    return NextResponse.json({ success: true, lead }, { status: 200 });

  } catch (error) {
    console.error("Error processing lead:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}