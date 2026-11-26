/**
 * Parse and validate AI response for code analysis.
 * Strips markdown fences, parses JSON, validates required fields.
 * Never throws — always returns a structured result.
 */
export const parseAnalysisResponse = (rawResponse) => {
  const result = {
    algorithm_name: null,
    time_complexity: null,
    space_complexity: null,
    dsa_pattern: null,
    brief_summary: null,
    explanation: null,
    viva_questions: [],
    raw_ai_response: rawResponse,
    is_valid: false,
  };

  try {
    if (!rawResponse || typeof rawResponse !== 'string') {
      return result;
    }

    // Strip markdown code fences
    let cleaned = rawResponse.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
    cleaned = cleaned.replace(/\n?```\s*$/i, '');
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    // Validate and extract fields
    const requiredFields = ['algorithm_name', 'time_complexity', 'space_complexity', 'explanation'];
    const hasRequired = requiredFields.every(
      (field) => parsed[field] && typeof parsed[field] === 'string' && parsed[field].trim().length > 0
    );

    result.algorithm_name = parsed.algorithm_name?.trim()?.substring(0, 250) || null;
    result.time_complexity = parsed.time_complexity?.trim()?.substring(0, 250) || null;
    result.space_complexity = parsed.space_complexity?.trim()?.substring(0, 250) || null;
    result.dsa_pattern = parsed.dsa_pattern?.trim()?.substring(0, 250) || null;
    result.brief_summary = parsed.brief_summary?.trim()?.substring(0, 1000) || null;
    result.explanation = parsed.explanation?.trim() || null;

    // Validate viva questions
    if (Array.isArray(parsed.viva_questions)) {
      result.viva_questions = parsed.viva_questions
        .filter((q) => q && typeof q.question === 'string' && typeof q.answer === 'string')
        .map((q) => ({
          question: q.question.trim(),
          answer: q.answer.trim(),
        }))
        .slice(0, 10); // Cap at 10 questions
    }

    result.is_valid = hasRequired;
  } catch (error) {
    console.error('Failed to parse AI response:', error.message);
    // result stays with is_valid = false and raw_ai_response preserved
  }

  return result;
};
