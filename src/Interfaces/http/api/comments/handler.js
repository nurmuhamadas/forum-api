const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')

class CommentsHandler {
  constructor(container) {
    this._container = container

    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
  }

  async postCommentHandler({ payload, auth, params }, h) {
    const { id: userId } = auth.credentials
    const { threadId } = params

    const commentUseCase = this._container.getInstance(CommentUseCase.name)

    const addedComment = await commentUseCase.addComment(
      userId,
      threadId,
      payload,
    )

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler({ auth, params }, h) {
    const { id: userId } = auth.credentials
    const { threadId, commentId } = params

    const commentUseCase = this._container.getInstance(CommentUseCase.name)

    await commentUseCase.deleteComment({ userId, threadId, commentId })

    const response = h.response({
      status: 'success',
    })
    response.code(200)
    return response
  }
}

module.exports = CommentsHandler
