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

    const resultThread = await this._pool.query(queryThread)
    return resultThread.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres
