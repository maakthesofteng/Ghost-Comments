import { NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o-mini";

const client = new OpenAI({
    baseURL: endpoint,
    apiKey: process.env.GITHUB_TOKEN, 
});

export async function POST(req: Request) {
    try {
        const prompt = `
    Create a list of three open-ended and engaging questions formatted as a single string. 
    Each question should be separated by '||'. 
    These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. 
    Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. 
    For example, your output should be structured like this: 
    'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
    Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
    `;

        
        const response = await client.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: "You are a creative AI that generates interesting anonymous questions." },
                { role: "user", content: prompt },
            ],
            temperature: 0.9,
            max_tokens: 400,
        });

        const aiResponse = response.choices[0]?.message?.content || "No response generated.";

        return NextResponse.json({
            success: true,
            questions: aiResponse,
        });
    } catch (error: any) {
        console.error("GitHub Models API Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error generating questions",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
