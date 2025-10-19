import dotenv from "dotenv";
dotenv.config();

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

export async function getResponse(req, res) {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const systemPrompt = `You are a Waray-Waray language expert and translator.  
    Translate English text into Waray-Waray **only**.  
    Do **not** add explanations, commentary, or reasoning.  
    Respond **line by line** exactly as requested, preserving punctuation and style.  
    When asked a question or raised a concern, answer with the Waray translation of the question or concern only.`;

    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${FIREWORKS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/gpt-oss-120b",
          max_tokens: 512,
          temperature: 0,
          top_p: 1,
          top_k: 40,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Fireworks API error: ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response.";

    return res.json({ prompt, response: content });
  } catch (err) {
    console.error("🔥 Fireworks API Error:", err);
    return res.status(500).json({
      error: "⚠️ Error: Could not reach the Fireworks AI service.",
      details: err.message,
    });
  }
}
