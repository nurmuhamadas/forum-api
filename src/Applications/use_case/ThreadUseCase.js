const RegisterComment = require('../../Domains/threads/entities/RegisterComment')
const RegisterThread = require('../../Domains/threads/entities/RegisterThread')

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async addThread(userId, useCasePayload) {
    const registerThread = new RegisterThread(userId, useCasePayload)
    return this._threadRepository.addThread(registerThread)
  }

  async verifyAvailableComment(commentId) {
    return this._threadRepository.verifyAvailableComment(commentId)
  }

  async verifyAvailableThread(userId, threadId) {
    return this._threadRepository.verifyAvailableThread(userId, threadId)
  }

  async verifyCommentOwner(userId, threadId) {
    return this._threadRepository.verifyCommentOwner(userId, threadId)
  }

  async addComment(userId, threadId, useCasePayload) {
    const registerComment = new RegisterComment(
      userId,
      threadId,
      useCasePayload,
    )
    return this._threadRepository.addComment(registerComment)
  }

  async deleteComment(userId) {
    return this._threadRepository.deleteComment(userId)
  }

  async getThread(threadId) {
    return this._threadRepository.getThread(threadId)
  }
}

module.exports = ThreadUseCase
