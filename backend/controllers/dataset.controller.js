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

export async function insertOne(req, res) {
  const { english, waray } = req.body;

  if (!english || !waray) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const text = `English: ${english}\nWaray: ${waray}`;

    // 🔹 embed
    // const embRes = await openrouter.embeddings.generate({
    //   model: "openai/text-embedding-3-small",
    //   input: text,
    // });

    const embRes = await openrouter.embeddings.generate({
      requestBody: {
        model: "openai/text-embedding-3-small",
        input: text,
      },
    });

    const embedding = embRes.data[0].embedding;

    // 🔹 insert
    const { error } = await supabase.from("waray_dataset").insert([
      {
        english,
        waray,
        embedding,
      },
    ]);

    if (error) throw error;

    return res.json({ message: "Inserted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Insert failed" });
  }
}

export async function insertBatch(req, res) {
  const { data } = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    // 🔥 1. Prepare inputs
    const inputs = data.map(
      (item) => `English: ${item.english}\nWaray: ${item.waray}`,
    );

    // 🔥 2. Batch embedding (fast + cheap)
    const embRes = await openrouter.embeddings.generate({
      model: "openai/text-embedding-3-small",
      input: inputs,
    });

    // 🔥 3. Build rows
    const rows = data.map((item, i) => ({
      english: item.english,
      waray: item.waray,
      embedding: embRes.data[i].embedding,
    }));

    // 🔥 4. Insert all
    const { error } = await supabase.from("waray_dataset").insert(rows);

    if (error) throw error;

    return res.json({
      message: "Batch inserted",
      count: rows.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Batch insert failed" });
  }
}
