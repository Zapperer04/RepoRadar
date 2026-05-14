class AiService {
  static async explainContent(content) {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Ruthless Auditor. 2 sentences." },
        { role: "user", content: `Analyze: ${content.substring(0, 5000)}` }
      ],
      model: "llama-3.3-70b-versatile",
    });
    return completion.choices[0].message.content;
  }
}

module.exports = AiService;
