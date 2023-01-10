const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const DetailedThread = require('../../Domains/threads/entities/DetailedThread')
const RegisteredComment = require('../../Domains/threads/entities/RegisteredComment')
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
      text: 'SELECT * FROM threads WHERE id=$1',
      values: [threadId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
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
            WHERE comments.thread_id = $1;`,
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
    }))

    return new DetailedThread(thread, comments)
  }
}

module.exports = ThreadRepositoryPostgres
