const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository')

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async checkCommentLikeIsAvailable({ commentId, userId }) {
    const query = {
      text: `SELECT is_liked FROM comment_likes
          WHERE comment_id = $1 AND user_id = $2`,
      values: [commentId, userId],
    }

    const result = await this._pool.query(query)

    return result.rows?.[0]
  }

  async addCommentLike({ commentId, userId, isLiked }) {
    const id = `comment_like-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
      values: [id, commentId, userId, isLiked],
    }

    const result = await this._pool.query(query)

    return result.rows?.[0]
  }

  async putCommentLike({ commentId, userId, isLiked }) {
    const query = {
      text: `UPDATE comment_likes SET is_liked = $1
              WHERE comment_id = $2 AND user_id = $3
              RETURNING id`,
      values: [isLiked, commentId, userId],
    }

    const result = await this._pool.query(query)

    return result.rows?.[0]
  }

  async getCommentLikesByCommentIds(commentIds) {
    const query = {
      text: `SELECT comment_id, COUNT(DISTINCT user_id)  FROM comment_likes
          WHERE comment_id = ANY($1::text[]) AND is_liked = true
          GROUP BY comment_id`,
      values: [commentIds],
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = CommentLikeRepositoryPostgres
