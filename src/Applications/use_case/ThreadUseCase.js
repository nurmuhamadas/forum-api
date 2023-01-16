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

  async verifyAvailableComment(commentId) {
    return this._threadRepository.verifyAvailableComment(commentId)
  }

  async verifyAvailableCommentReply(replyId) {
    return this._threadRepository.verifyAvailableCommentReply(replyId)
  }

  async verifyCommentReplyOwner(userId, replyId) {
    return this._threadRepository.verifyCommentReplyOwner(userId, replyId)
  }

  async verifyAvailableThread(userId, threadId) {
    return this._threadRepository.verifyAvailableThread(userId, threadId)
  }

  async verifyCommentOwner(userId, commentId) {
    return this._threadRepository.verifyCommentOwner(userId, commentId)
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

  async addCommentReply(userId, threadId, useCasePayload) {
    const registerCommentReply = new RegisterCommentReply(
      userId,
      threadId,
      useCasePayload,
    )
    return this._threadRepository.addCommentReply(registerCommentReply)
  }

  async deleteCommentReply(userId) {
    return this._threadRepository.deleteCommentReply(userId)
  }

  async getThread(threadId) {
    return this._threadRepository.getThread(threadId)
  }
}

module.exports = ThreadUseCase
