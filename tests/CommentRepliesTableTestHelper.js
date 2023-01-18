/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentRepliesTableTestHelper = {
  async addCommentReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'Content of the Comment reply',
    userId = 'user-123',
    date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, commentId, userId, false, date],
    }

    await pool.query(query)
  },

  async findCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies')
  },
}

module.exports = CommentRepliesTableTestHelper
