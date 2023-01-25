const RegisterComment = require('../../Domains/comments/entities/RegisterComment')

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async addComment(userId, threadId, useCasePayload) {
    const registerComment = new RegisterComment(
      userId,
      threadId,
      useCasePayload,
    )
    await this._threadRepository.verifyAvailableThread(threadId)
    return this._commentRepository.addComment(registerComment)
  }

  async deleteComment({ threadId, userId, commentId }) {
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    await this._commentRepository.verifyCommentOwner(userId, commentId)
    return this._commentRepository.deleteComment(commentId)
  }
}

module.exports = CommentUseCase
