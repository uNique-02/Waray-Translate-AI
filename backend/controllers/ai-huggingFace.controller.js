// import { InferenceClient } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@4.7.1/+esm";
// import {
//   createRepo,
//   commit,
//   deleteRepo,
//   listFiles,
// } from "https://cdn.jsdelivr.net/npm/@huggingface/hub@2.6.0/+esm";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;

// ⚠️ Keep your real API key secret in production — this is only safe for testing
// const inference = new HfInference("hf_xxx_your_api_key_here");
const client = new InferenceClient(HF_TOKEN);

// const chatBox = document.getElementById("chat-box");
// const userInput = document.getElementById("user-input");
// const sendBtn = document.getElementById("send-btn");

// function appendMessage(message, sender) {
//   const msgDiv = document.createElement("div");
//   msgDiv.classList.add("message", sender);
//   msgDiv.textContent = message;
//   chatBox.appendChild(msgDiv);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// async function getResponse(prompt) {
//   try {
//     let response = await client.chatCompletion({
//       model: "openai/gpt-oss-120b",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 128,
//     });

//     return response.choices[0].message.content;
//   } catch (err) {
//     console.error(err);
//     return "⚠️ Error: Could not reach the AI service.";
//   }
// }

// async function sendMessage() {
//   const msg = userInput.value.trim();
//   if (!msg) return;
//   appendMessage(msg, "user");
//   userInput.value = "";

//   const reply = await getResponse(msg);
//   appendMessage(reply, "bot");
// }

// // Send message on button click
// sendBtn.addEventListener("click", sendMessage);

// // Send message on Enter key
// userInput.addEventListener("keypress", function (e) {
//   if (e.key === "Enter") {
//     sendMessage();
//   }
// });

export async function getResponse(req, res) {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // let systemPrompt = `You are a Waray-Waray language expert. Always respond in Waray-Waray.
    //   Translate any user input from other languages into Waray-Waray.
    //   Do not respond in any other language but Waray-waray.`;

    //     let systemPrompt = `You are a Waray-Waray language expert and translator.
    // Translate English text into Waray-Waray **only**.
    // Do **not** add explanations, commentary, or reasoning.
    // Respond **line by line** exactly as requested, preserving punctuation and style.
    // Example input: "Two roads diverged in a yellow wood,"
    // Example output: "Duha nga karsada an nagbulag ha usa nga dilaw nga kakahoyan,"
    // Always follow this format for every line.`;

    // let response = await client.chatCompletion({
    //   model: "openai/gpt-oss-120b",
    //   messages: [
    //     { role: "system", content: systemPrompt },
    //     { role: "user", content: "who washed the dishes?" },
    //     { role: "assistant", content: "Hin-o naghugas han mga pinggan?" },
    //     { role: "user", content: prompt },
    //   ],
    //   temperature: 0,
    //   max_tokens: 256,
    // });

    let systemPrompt = `You are a Waray-Waray language expert and translator.  
Translate English text into Waray-Waray **only**.  
Do **not** add explanations, commentary, or reasoning.  
Respond **line by line** exactly as requested, preserving punctuation and style. When asked a question or raised a concern, answer with the
Waray translation of the question or concern only.`;

    let response = await client.chatCompletion({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "who washed the dishes?" },
        { role: "assistant", content: "Hin-o naghugas han mga pinggan?" },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      max_tokens: 512,
    });

    const content = response.choices[0].message.content;
    return res.json({ prompt, response: content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "⚠️ Error: Could not reach the AI service.",
    });
  }
}

// export async function translatorFunction(prompt) {
//   try {
//     let systemPrompt = `You are a Waray-Waray language expert and translator.
// Translate English text into Waray-Waray **only**.
// Do **not** add explanations, commentary, or reasoning.
// Respond **line by line** exactly as requested, preserving punctuation and style. When asked a question or raised a concern, answer with the
// Waray translation of the question or concern only.`;

//     let response = await client.chatCompletion({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0,
//       max_tokens: 512,
//     });

//     const content = response.choices[0].message.content;
//     return content;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }
