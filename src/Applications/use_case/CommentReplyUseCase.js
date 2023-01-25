const RegisterCommentReply = require('../../Domains/commentReplies/entities/RegisterCommentReply')

class CommentReplyUseCase {
  constructor({ threadRepository, commentRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._commentReplyRepository = commentReplyRepository
  }

  async addCommentReply({ userId, threadId, commentId, payload }) {
    const registerCommentReply = new RegisterCommentReply({
      userId,
      threadId,
      commentId,
      payload,
    })
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    return this._commentReplyRepository.addCommentReply(registerCommentReply)
  }

  async deleteCommentReply({ userId, threadId, commentId, replyId }) {
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    await this._commentReplyRepository.verifyAvailableCommentReply(replyId)
    await this._commentReplyRepository.verifyCommentReplyOwner(userId, replyId)
    return this._commentReplyRepository.deleteCommentReply(replyId)
  }
}

module.exports = CommentReplyUseCase
