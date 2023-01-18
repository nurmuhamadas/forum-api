const RegisterComment = require('../../Domains/threads/entities/RegisterComment')
const RegisterCommentReply = require('../../Domains/threads/entities/RegisterCommentReply')
const RegisterThread = require('../../Domains/threads/entities/RegisterThread')

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async addThread(userId, useCasePayload) {
    const registerThread = new RegisterThread(userId, useCasePayload)
    return this._threadRepository.addThread(registerThread)
  }

  async addComment(userId, threadId, useCasePayload) {
    const registerComment = new RegisterComment(
      userId,
      threadId,
      useCasePayload,
    )
    await this._threadRepository.verifyAvailableThread(threadId)
    return this._threadRepository.addComment(registerComment)
  }

  async deleteComment({ threadId, userId, commentId }) {
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._threadRepository.verifyAvailableComment(commentId)
    await this._threadRepository.verifyCommentOwner(userId, commentId)
    return this._threadRepository.deleteComment(commentId)
  }

  async addCommentReply({ userId, threadId, commentId, payload }) {
    const registerCommentReply = new RegisterCommentReply({
      userId,
      threadId,
      commentId,
      payload,
    })
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._threadRepository.verifyAvailableComment(commentId)
    return this._threadRepository.addCommentReply(registerCommentReply)
  }

  async deleteCommentReply({ userId, threadId, commentId, replyId }) {
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._threadRepository.verifyAvailableComment(commentId)
    await this._threadRepository.verifyAvailableCommentReply(replyId)
    await this._threadRepository.verifyCommentReplyOwner(userId, replyId)
    return this._threadRepository.deleteCommentReply(replyId)
  }

  async getThread(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId)
    return this._threadRepository.getThread(threadId)
  }
}

module.exports = ThreadUseCase
