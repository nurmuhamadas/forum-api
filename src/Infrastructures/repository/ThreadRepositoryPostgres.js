const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
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
}

module.exports = ThreadRepositoryPostgres
