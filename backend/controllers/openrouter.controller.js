import { OpenRouter } from "@openrouter/sdk";
import { createClient } from "@supabase/supabase-js";

import dotenv from "dotenv";

dotenv.config();

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// async function getEmbedding(text) {
//   const res = await openrouter.embeddings.generate({
//     model: "openai/text-embedding-3-small",
//     input: text,
//   });

//   return res.data[0].embedding;
// }

async function getEmbedding(text) {
  const res = await openrouter.embeddings.generate({
    requestBody: {
      model: "openai/text-embedding-3-small",
      input: text,
    },
  });

  return res.data[0].embedding;
}

export async function getResponse(req, res) {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // 🔹 1. Get embedding
    const queryEmbedding = await getEmbedding(prompt);

    // 🔹 2. Retrieve from Supabase
    const { data: matches, error } = await supabase.rpc("match_waray", {
      query_embedding: queryEmbedding,
      match_count: 5,
    });

    if (error) throw error;

    // 🔹 3. Build context
    const context =
      matches?.map((m) => `${m.english} = ${m.waray}`).join("\n") || "";

    // 🔹 4. System Prompt (STRONGER)
    const systemPrompt = `
You are a translation engine.

You MUST follow these rules strictly:

- ONLY output the Waray translation.
- DO NOT explain anything.
- DO NOT answer questions.
- DO NOT add extra text.
- DO NOT ignore the dataset.

Dataset:
${context}

Task:
Find the closest match from the dataset and return ONLY the Waray translation.
Use the closest match as a context or reference to your translation.

If no match is found, analyze the closest matches and make your own translation. 
If nothing can be retrieved from the matches, response with:
Translation not available in dataset.
`;

    // console.log(" SYSTEM PROMPT: ", systemPrompt);
    // console.log(" PROMPT: ", prompt);
    // 🔹 5. Call OpenRouter
    const result = await openrouter.callModel({
      model: "openai/gpt-oss-120b",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Translate: ${prompt}` },
      ],
    });

    const output = await result.getText();

    return res.json({
      prompt,
      response: output,
      matches, // optional (debugging)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "⚠️ Error: Could not reach the AI service.",
    });
  }
}
