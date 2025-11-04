import OpenAI from "openai";

import type { Route } from "./+types/generate-idea-page";

import { z } from "zod";
import { insertIdeas } from "../mutations";
import { zodResponseFormat } from "openai/helpers/zod";
import { createAdminClient } from "~/lib/supabase.server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const IdeaSchema = z.object({
    title: z.string(),
    description: z.string().describe("A short description of the idea. 100 characters max."),
    problem: z.string(),
    solution: z.string(),
    category: z.enum([
        "tech",
        "business",
        "health",
        "education",
        "finance",
        "other",
    ]),
});

const ResponseSchema = z.object({
    potato: z.array(IdeaSchema),
});

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        return new Response(null, { status: 404 });
    }
    const header = request.headers.get("X-POTATO");
    if (!header || header !== "X-TOMATO") {
        return new Response(null, { status: 404 });
    }

    console.log('🚀 Generate idea action started (CRON Job)');
    console.log('Environment check:', {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? `Set (${process.env.OPENAI_API_KEY.length} chars)` : 'Missing',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? `Set (${process.env.SUPABASE_SERVICE_ROLE_KEY.length} chars)` : 'Missing',
    });

    try {
        console.log('🤖 Calling OpenAI API...');
        const completion = await openai.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content:
                        "Give the name and elevator pitch of startup ideas that can be built by small teams.",
                },
                {
                    role: "user",
                    content:
                        "For example: 'An app that helps you find the best deals on groceries.', or 'A platform to rent a coder per hour.'",
                },
                {
                    role: "user",
                    content: "Give me 10 ideas.",
                },
            ],
            response_format: zodResponseFormat(ResponseSchema, "potato"),
        });

        console.log('✅ OpenAI API response received');
        console.log('Response structure:', {
            hasChoices: !!completion.choices,
            choicesLength: completion.choices?.length,
            hasParsed: !!completion.choices?.[0]?.message?.parsed,
        });

        const descriptions =
            completion.choices[0].message.parsed?.potato.map(
                (idea) => idea.description
            );

        console.log('📝 Generated descriptions:', descriptions);

        if (!descriptions || descriptions.length === 0) {
            return Response.json(
                {
                    error: "No ideas generated",
                },
                { status: 400 }
            );
        }

        // 필터링: 유효한 문자열만 유지
        const validDescriptions = descriptions.filter(
            (desc): desc is string => typeof desc === 'string' && desc.trim().length > 0
        );

        if (validDescriptions.length === 0) {
            return Response.json(
                {
                    error: "No valid ideas generated",
                },
                { status: 400 }
            );
        }

        console.log('✅ Valid descriptions to insert:', validDescriptions.length);

        const adminClient = createAdminClient();
        const insertedData = await insertIdeas(adminClient, validDescriptions);

        return Response.json({
            ok: true,
            count: validDescriptions.length,
            insertedIds: insertedData?.map((idea) => idea.gpt_idea_id) || [],
        });
    } catch (error) {
        console.error("Error generating ideas:", error);
        return Response.json(
            {
                error: "Failed to generate ideas",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};

export default function GenerateIdeaPage() {
    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="space-y-4 text-center">
                <h1 className="text-2xl font-bold">Idea Generation</h1>
                <p className="text-muted-foreground">
                    This endpoint is designed for automated CRON jobs. Ideas are generated automatically on a schedule.
                </p>
                <p className="text-sm text-muted-foreground">
                    To view generated ideas, please visit the{" "}
                    <a href="/ideas" className="text-primary underline">
                        Ideas page
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

