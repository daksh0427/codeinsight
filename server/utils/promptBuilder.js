export const buildAnalysisPrompt = (language, rawCode) => {
  return `You are an expert DSA and software engineering tutor. Analyze the following ${language} code and respond ONLY with a valid JSON object — no markdown, no explanation outside JSON.

Code:
${rawCode}

Return this exact structure:
{
  "algorithm_name": "Name of the algorithm or technique used",
  "time_complexity": "e.g. O(n log n)",
  "space_complexity": "e.g. O(n)",
  "dsa_pattern": "e.g. sliding window, two pointer, dynamic programming, brute force, etc.",
  "brief_summary": "A concise summary of what the code does (max 150 chars)",
  "explanation": "A detailed paragraph explaining the code logic step by step, as if teaching a student",
  "viva_questions": [
    { "question": "A relevant interview question about this code", "answer": "A detailed model answer" },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}

Important: Generate exactly 5 viva questions. The brief_summary must be under 150 characters. Respond with ONLY the JSON object, no other text.`;
};
