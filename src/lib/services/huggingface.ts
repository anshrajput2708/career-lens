import { HfInference } from "@huggingface/inference";

export const isHfAvailable = !!process.env.HUGGINGFACE_API_KEY || !!process.env.GEMINI_API_KEY;

// Aggressively strip quotes, newlines, and spaces that might accidentally bleed from .env.local
const rawKey = process.env.HUGGINGFACE_API_KEY || "";
const cleanKey = rawKey.replace(/[\r\n"']/g, "").trim();

const hf = cleanKey 
  ? new HfInference(cleanKey) 
  : null;

export async function hfChat(messages: any[], options: any = {}) {
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content
  }));

  let hfError = null;

  // Attempt HuggingFace Inference First
  if (hf) {
    try {
      const response = await hf.chatCompletion({
        model: options.model || "meta-llama/Meta-Llama-3-8B-Instruct", 
        messages: formattedMessages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });

      return response.choices[0].message.content || "";
    } catch (err: any) {
      console.warn(`[HF Fallback] HuggingFace API failed (${err.message}). Attempting Gemini fallback...`);
      hfError = err;
    }
  }

  // Fallback to Gemini (via OpenAI compatibility layer) if HF failed or is unconfigured
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${geminiKey}`
        },
        body: JSON.stringify({
          model: "gemini-2.0-flash", // Use gemini-2.0-flash or gemini-1.5-flash
          messages: formattedMessages,
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        })
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        throw new Error(`Gemini API Error: ${geminiRes.status} ${errText}`);
      }

      const geminiData = await geminiRes.json();
      return geminiData.choices[0].message.content || "";
    } catch (fallbackErr: any) {
      console.error(`[HF Fallback] Gemini fallback also failed: ${fallbackErr.message}`);
      throw fallbackErr;
    }
  }

  if (hfError) {
    throw hfError;
  }
  
  throw new Error("No AI API configured. Please provide HUGGINGFACE_API_KEY or GEMINI_API_KEY.");
}

export async function hfVisionOcrFromDataUrl(dataUrl: string, opts?: { timeoutMs?: number; maxTokens?: number }): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const base64 = dataUrl.split(",")[1];
        const mimeType = dataUrl.split(";")[0].split(":")[1];
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Extract all text from this image exactly as written. Preserve formatting." },
                { inline_data: { mime_type: mimeType, data: base64 } }
              ]
            }]
          })
        });
        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (err) {
        console.error("Gemini Vision OCR failed:", err);
      }
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is not configured.");
    
    return "Vision extraction failed. Please upload a PDF or text file instead of an image for deep analysis.";
}
