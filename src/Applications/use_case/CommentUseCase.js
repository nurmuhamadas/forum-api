const InvariantError = require('../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const RegisterComment = require('../../Domains/comments/entities/RegisterComment')

class CommentUseCase {
  constructor({ commentRepository, threadRepository, commentLikeRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._commentLikeRepository = commentLikeRepository
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

  async likeUnlikeComment(payload) {
    if (
      payload === undefined ||
      payload.threadId === undefined ||
      payload.commentId === undefined ||
      payload.userId === undefined
    ) {
      throw new InvariantError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    const { threadId, commentId, userId } = payload
    if (
      typeof commentId !== 'string' ||
      typeof userId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new InvariantError('COMMENT_USE_CASE.NOT_MEET_DATA_SPECIFICATION')
    }

    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    const commentLike =
      await this._commentLikeRepository.checkCommentLikeIsAvailable({
        commentId,
        userId,
      })

    if (commentLike) {
      return this._commentLikeRepository.putCommentLike({
        commentId,
        userId,
        isLiked: !commentLike.is_liked,
      })
    }
    return this._commentLikeRepository.addCommentLike({
      commentId,
      userId,
      isLiked: true,
    })
  }
}

module.exports = CommentUseCase
