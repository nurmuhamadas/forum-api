const { ERROR_MESSAGE } = require('../../Commons/consts')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const DetailedThread = require('../../Domains/threads/entities/DetailedThread')
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread(registerThread) {
    const { userId, title, body } = registerThread
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title',
      values: [id, title, body, userId, false, new Date()],
    }

    const result = await this._pool.query(query)

    return new RegisteredThread(userId, { ...result.rows[0] })
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id=$1',
      values: [threadId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError(ERROR_MESSAGE.threadNotFound)
    }
  }

  async getThread(threadId) {
    const queryThread = {
      text: `SELECT threads.*, users.username FROM threads
            INNER JOIN users ON users.id = threads.user_id
            WHERE threads.id = $1;`,
      values: [threadId],
    }
    const queryComment = {
      text: `SELECT comments.*, users.username FROM comments
            INNER JOIN users ON users.id = comments.user_id
            WHERE comments.thread_id = $1
            ORDER BY comments.created_at ASC;`,
      values: [threadId],
    }

    const resultThread = await this._pool.query(queryThread)
    const resultComment = await this._pool.query(queryComment)
    const thread = {
      id: resultThread.rows[0].id,
      title: resultThread.rows[0].title,
      body: resultThread.rows[0].body,
      date: resultThread.rows[0].created_at,
      username: resultThread.rows[0].username,
    }
    const comments = resultComment.rows.map((d) => ({
      id: d.id,
      username: d.username,
      date: d.created_at,
      content: d.content,
      is_delete: d.is_delete,
    }))
    const commentIds = comments.map((c) => c.id)

    let commentsReply = []
    if (commentIds.length > 0) {
      const queryCommentReply = {
        text: `SELECT comment_replies.*, users.username FROM comment_replies
            INNER JOIN users ON users.id = comment_replies.user_id
            WHERE comment_replies.comment_id IN (${commentIds
              .map((_, i) => `$${i + 1}`)
              .join(', ')})
            ORDER BY comment_replies.created_at ASC;`,
        values: [...commentIds],
      }
      const resultCommentReply = await this._pool.query(queryCommentReply)
      commentsReply = resultCommentReply.rows.map((d) => ({
        id: d.id,
        commentId: d.comment_id,
        username: d.username,
        date: d.created_at,
        content: d.content,
        is_delete: d.is_delete,
      }))
    }

    return new DetailedThread(thread, comments, commentsReply)
  }
}

module.exports = ThreadRepositoryPostgres
