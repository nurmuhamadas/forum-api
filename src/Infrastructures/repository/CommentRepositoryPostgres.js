const { ERROR_MESSAGE } = require('../../Commons/consts')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError(ERROR_MESSAGE.commentNotFound)
    }
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT user_id FROM comments WHERE id = $1',
      values: [commentId],
    }

    const result = await this._pool.query(query)

    if (result.rows[0]?.user_id !== userId) {
      throw new AuthorizationError(ERROR_MESSAGE.haveNotAccess)
    }
  }

  async addComment(registerComment) {
    const { userId, threadId, content } = registerComment
    const id = `comment-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content',
      values: [id, content, threadId, userId, false, new Date()],
    }

    const result = await this._pool.query(query)

    return new RegisteredComment(userId, { ...result.rows[0] })
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
      values: [commentId],
    }

    const result = await this._pool.query(query)

    return result.rows[0]?.id
  }
}

module.exports = CommentRepositoryPostgres
