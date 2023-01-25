const { ERROR_MESSAGE } = require('../../Commons/consts')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentReplyRepository = require('../../Domains/commentReplies/CommentReplyRepository')
const RegisteredCommentReply = require('../../Domains/commentReplies/entities/RegisteredCommentReply')

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyAvailableCommentReply(replyId) {
    const query = {
      text: 'SELECT id FROM comment_replies WHERE id = $1',
      values: [replyId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError(ERROR_MESSAGE.commentReplyNotFound)
    }
  }

  async verifyCommentReplyOwner(userId, replyId) {
    const query = {
      text: 'SELECT user_id FROM comment_replies WHERE id = $1',
      values: [replyId],
    }

    const result = await this._pool.query(query)

    if (result.rows[0]?.user_id !== userId) {
      throw new AuthorizationError(ERROR_MESSAGE.haveNotAccess)
    }
  }

  async addCommentReply(registerCommentReply) {
    const { userId, commentId, content } = registerCommentReply
    const id = `reply-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content',
      values: [id, content, commentId, userId, false, new Date()],
    }

    const result = await this._pool.query(query)

    return new RegisteredCommentReply(userId, { ...result.rows[0] })
  }

  async deleteCommentReply(replyId) {
    const query = {
      text: 'UPDATE comment_replies SET is_delete = true WHERE id = $1 RETURNING id',
      values: [replyId],
    }

    const result = await this._pool.query(query)

    return result.rows[0]?.id
  }
}

module.exports = CommentReplyRepositoryPostgres
