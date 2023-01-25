const CommentReplyUseCase = require('../../../../Applications/use_case/CommentReplyUseCase')

class CommentRepliesHandler {
  constructor(container) {
    this._container = container

    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this)
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this)
  }

  async postCommentReplyHandler({ payload, auth, params }, h) {
    const { id: userId } = auth.credentials
    const { threadId, commentId } = params

    const commentRepliesUseCase = this._container.getInstance(
      CommentReplyUseCase.name,
    )

    const addedReply = await commentRepliesUseCase.addCommentReply({
      userId,
      threadId,
      commentId,
      payload,
    })

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    })
    response.code(201)
    return response
  }

  async deleteCommentReplyHandler({ auth, params }, h) {
    const { id: userId } = auth.credentials
    const { threadId, commentId, replyId } = params

    const commentRepliesUseCase = this._container.getInstance(
      CommentReplyUseCase.name,
    )

    await commentRepliesUseCase.deleteCommentReply({
      userId,
      threadId,
      commentId,
      replyId,
    })

    const response = h.response({
      status: 'success',
    })
    response.code(200)
    return response
  }
}

module.exports = CommentRepliesHandler
