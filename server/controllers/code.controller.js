import { Op } from 'sequelize';
import { CodeSnippet, Analysis, Bookmark } from '../models/index.js';

// POST /api/code/upload
export const uploadSnippet = async (req, res, next) => {
  try {
    const { title, language, raw_code } = req.body;

    if (!raw_code || raw_code.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Code cannot be empty.',
        code: 'EMPTY_CODE',
      });
    }

    if (raw_code.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Code must be under 10,000 characters.',
        code: 'CODE_TOO_LONG',
      });
    }

    const snippet = await CodeSnippet.create({
      user_id: req.user.userId,
      title,
      language,
      raw_code,
    });

    res.status(201).json({
      success: true,
      message: 'Snippet uploaded successfully.',
      snippet,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/code/all
export const getAllSnippets = async (req, res, next) => {
  try {
    const { language, search, page = 1, limit = 12 } = req.query;

    const where = { user_id: req.user.userId };

    if (language) {
      where.language = language;
    }

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: snippets } = await CodeSnippet.findAndCountAll({
      where,
      include: [
        {
          model: Analysis,
          as: 'analysis',
          attributes: ['algorithm_name', 'time_complexity', 'space_complexity', 'brief_summary', 'dsa_pattern', 'is_valid'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    // Check bookmarks for these snippets
    const snippetIds = snippets.map((s) => s.id);
    const bookmarks = await Bookmark.findAll({
      where: {
        user_id: req.user.userId,
        snippet_id: { [Op.in]: snippetIds },
      },
    });
    const bookmarkedIds = new Set(bookmarks.map((b) => b.snippet_id));

    const enrichedSnippets = snippets.map((s) => ({
      ...s.toJSON(),
      is_bookmarked: bookmarkedIds.has(s.id),
    }));

    res.json({
      success: true,
      snippets: enrichedSnippets,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/code/:id
export const getSnippet = async (req, res, next) => {
  try {
    const snippet = await CodeSnippet.findOne({
      where: { id: req.params.id, user_id: req.user.userId },
      include: [
        {
          model: Analysis,
          as: 'analysis',
        },
      ],
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found.',
        code: 'NOT_FOUND',
      });
    }

    // Check bookmark status
    const bookmark = await Bookmark.findOne({
      where: { user_id: req.user.userId, snippet_id: snippet.id },
    });

    res.json({
      success: true,
      snippet: {
        ...snippet.toJSON(),
        is_bookmarked: !!bookmark,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/code/:id
export const deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await CodeSnippet.findOne({
      where: { id: req.params.id, user_id: req.user.userId },
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found.',
        code: 'NOT_FOUND',
      });
    }

    await snippet.destroy(); // Cascade deletes analysis and bookmarks

    res.json({
      success: true,
      message: 'Snippet deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/code/bookmark/:snippetId
export const toggleBookmark = async (req, res, next) => {
  try {
    const { snippetId } = req.params;

    // Verify snippet exists and belongs to user
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

    const existing = await Bookmark.findOne({
      where: { user_id: req.user.userId, snippet_id: snippetId },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ success: true, bookmarked: false });
    }

    await Bookmark.create({
      user_id: req.user.userId,
      snippet_id: snippetId,
    });

    res.json({ success: true, bookmarked: true });
  } catch (error) {
    next(error);
  }
};

// GET /api/code/bookmarks
export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { user_id: req.user.userId },
      include: [
        {
          model: CodeSnippet,
          as: 'snippet',
          include: [
            {
              model: Analysis,
              as: 'analysis',
              attributes: ['algorithm_name', 'time_complexity', 'space_complexity', 'brief_summary', 'dsa_pattern', 'is_valid'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const snippets = bookmarks.map((b) => ({
      ...b.snippet.toJSON(),
      is_bookmarked: true,
    }));

    res.json({
      success: true,
      snippets,
    });
  } catch (error) {
    next(error);
  }
};
