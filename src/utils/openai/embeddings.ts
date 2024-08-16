import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateOpenAIEmbeddings(text: string) {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-large",
    dimensions: 1024,
  });
  return response.data[0].embedding;
}
