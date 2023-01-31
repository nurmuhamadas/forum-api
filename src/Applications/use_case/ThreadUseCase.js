const InvariantError = require('../../Commons/exceptions/InvariantError')
const CommentsData = require('../../Domains/comments/entities/CommentsData')
const DetailedThread = require('../../Domains/threads/entities/DetailedThread')
const RegisterThread = require('../../Domains/threads/entities/RegisterThread')

class ThreadUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._repliesRepository = repliesRepository
  }

  async addThread(userId, useCasePayload) {
    const registerThread = new RegisterThread(userId, useCasePayload)
    return this._threadRepository.addThread(registerThread)
  }

  async getThread(threadId) {
    if (threadId === undefined) {
      throw new InvariantError('THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof threadId !== 'string') {
      throw new InvariantError('THREAD_USE_CASE.NOT_MEET_DATA_SPECIFICATION')
    }

    // thread data
    await this._threadRepository.verifyAvailableThread(threadId)
    const thread = await this._threadRepository.getThread(threadId)

    // comment data
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    )
    const commentIds = comments.map((c) => c.id)

    // replies data
    const replies = await this._repliesRepository.getCommentRepliesByCommentIds(
      commentIds,
    )

    return new DetailedThread(thread, comments, replies)
  }
}

module.exports = ThreadUseCase
