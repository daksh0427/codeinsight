import { CodeSnippet, Analysis } from '../models/index.js';
import { analyzeCode } from '../services/gemini.service.js';
import { buildAnalysisPrompt } from '../utils/promptBuilder.js';
import { parseAnalysisResponse } from '../utils/responseParser.js';

// POST /api/analysis/analyze/:snippetId
export const analyzeSnippet = async (req, res, next) => {
  try {
    const { snippetId } = req.params;

    // Find snippet and verify ownership
    const snippet = await CodeSnippet.findOne({
      where: { id: snippetId, user_id: req.user.userId },
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found.',
        code: 'NOT_FOUND',
      });
    }

    // Check if analysis already exists
    const existingAnalysis = await Analysis.findOne({
      where: { snippet_id: snippetId },
    });

    if (existingAnalysis) {
      return res.json({
        success: true,
        message: 'Analysis already exists.',
        analysis: existingAnalysis,
      });
    }

    // Build prompt and call AI
    const prompt = buildAnalysisPrompt(snippet.language, snippet.raw_code);
    const rawResponse = await analyzeCode(prompt);

    // Parse and validate
    const parsed = parseAnalysisResponse(rawResponse);

    // Save analysis
    const analysis = await Analysis.create({
      snippet_id: snippetId,
      algorithm_name: parsed.algorithm_name,
      time_complexity: parsed.time_complexity,
      space_complexity: parsed.space_complexity,
      explanation: parsed.explanation,
      brief_summary: parsed.brief_summary,
      dsa_pattern: parsed.dsa_pattern,
      viva_questions: parsed.viva_questions,
      raw_ai_response: parsed.raw_ai_response,
      is_valid: parsed.is_valid,
    });

    res.status(201).json({
      success: true,
      message: parsed.is_valid
        ? 'Analysis completed successfully.'
        : 'Analysis completed with partial results.',
      analysis,
    });
  } catch (error) {
    next(error);
  }
};
