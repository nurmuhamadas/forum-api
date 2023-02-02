/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'comment_like-123',
    commentId = 'comment-123',
    userId = 'user-123',
    isLiked = true,
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
      values: [id, commentId, userId, isLiked],
    }

    await pool.query(query)
  },

  async getCommentLikeById(id) {
    const query = {
      text: `SELECT * FROM comment_likes WHERE id = $1`,
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows[0]
  },

  async putCommentLikeById(id) {
    const query = {
      text: `UPDATE comment_likes cl SET is_likes = NOT cl.is_liked
            FROM comments WHERE id = $1`,
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes')
  },
}

module.exports = CommentLikesTableTestHelper
