// import { InferenceClient } from "@huggingface/inference"; /* when you are using Huggingface interference */
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"; //for using gemni   
dotenv.config();

// const client = new InferenceClient(process.env.HuggingFace_API_KEY); /* when you are using Huggingface interference */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //for gemni


export async function getTutorialFromRepo(repoContent) {
  const prompt =`You are an expert technical writer and software explainer.

Your task is to analyze the provided GitHub project source code and generate a beginner-friendly, SEO-optimized tutorial in **strict JSON format**

---

🎯 Output Format (must strictly match):

{
  "title": "Tutorial: <Project Name>",
  "summary": "A brief beginner-friendly explanation of the project using **bold** and *italic* for highlights.",
  "flowchart": "<Mermaid.js compatible flowchart (e.g., flowchart TD\nA --> B)>",
  "chapters": [
    {
      "title": "Chapter 1: Overview of <Project Name>",
      "content": "Markdown-formatted explanation including the purpose of the project, features, folder structure, tech stack used, and high-level goals."
    },
    {
      "title": "Chapter 2: <Main Component or Feature>",
      "content": "Explain the implementation, logic, code examples, and its role in the project."
    },
    {
      "title": "Chapter N: ...",
      "content": "Keep breaking down the project feature-wise or file-wise. Explain each part in simple markdown-rich explanations."
    }
  ]
}

---

✅ Guidelines:
-ONLY return valid JSON. Do NOT include extra text or commentary.
- Use **bold** and *italic* markdown to highlight key terms.
- Output must include a flowchart in Mermaid syntax showing the relationships between main components/files.
- Chapters should be clear, concise, and structured like a book/tutorial.
- Prefer code structure-based breakdown over file-by-file dumping.
- Keep tone beginner-friendly, with no jargon unless explained.

---

📁 GitHub Code:
${repoContent}
        `

  /* when you are using Huggingface interference */
  // const chatCompletion = await client.chatCompletion({
  //   provider: "novita", // for chat-style inference
  //   model: "deepseek-ai/DeepSeek-R1-0528", // or HuggingFaceH4/zephyr-7b-beta
  //   messages: [
  //     {
  //       role: "user",
  //       content: prompt,
  //     },
  //   ],
  // });
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

let raw = "";
 try {
    const result = await model.generateContent(prompt);
    raw = await result.response.text();

    // Try to extract the JSON from the text
    const jsonMatch = raw.match(/\{[\s\S]*\}/); // greedy match of full JSON object
    if (!jsonMatch) {
      console.error("⚠️ No valid JSON block found.");
      throw new Error("Gemini did not return a JSON object.");
    }

    const cleaned = jsonMatch[0]
      .replace(/\\n/g, "\\n") // ensure linebreaks stay escaped
      .replace(/“|”/g, '"') // fancy quotes to normal
      .replace(/‘|’/g, "'") // fancy apostrophes
      .replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"); // remove trailing commas

    // Try parsing JSON
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error("🛑 JSON parsing failed:", err.message);
    console.error("🧾 Gemini output (cleaned):", raw.slice(0, 1000));
    throw new Error("Failed to parse Gemini output.");
  }
}
