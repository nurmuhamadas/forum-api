const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this)
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this)
    this.getThreadHandler = this.getThreadHandler.bind(this)
  }

  async postThreadHandler({ payload, auth }, h) {
    const { id: userId } = auth.credentials
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const addedThread = await threadUseCase.addThread(userId, payload)

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    })
    response.code(201)
    return response
  }

  async getThreadHandler({ params }, h) {
    const { threadId } = params

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)

    await threadUseCase.verifyAvailableThread(threadId)
    const { thread } = await threadUseCase.getThread(threadId)

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    })
    response.code(200)
    return response
  }

  async postCommentHandler({ payload, auth, params }, h) {
    const { id: userId } = auth.credentials
    const { threadId } = params

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)

    await threadUseCase.verifyAvailableThread(threadId)
    const addedComment = await threadUseCase.addComment(
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

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)

    await threadUseCase.verifyAvailableThread(threadId)
    await threadUseCase.verifyAvailableComment(commentId)
    await threadUseCase.verifyCommentOwner(userId, commentId)
    await threadUseCase.deleteComment(commentId)

    const response = h.response({
      status: 'success',
    })
    response.code(200)
    return response
  }

  async postCommentReplyHandler({ payload, auth, params }, h) {
    const { id: userId } = auth.credentials
    const { threadId, commentId } = params

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)

    await threadUseCase.verifyAvailableThread(threadId)
    await threadUseCase.verifyAvailableComment(commentId)
    const addedReply = await threadUseCase.addCommentReply({
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

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)

    await threadUseCase.verifyAvailableThread(threadId)
    await threadUseCase.verifyAvailableComment(commentId)
    await threadUseCase.verifyAvailableCommentReply(replyId)
    console.log('ok')
    await threadUseCase.verifyCommentReplyOwner(userId, replyId)
    await threadUseCase.deleteCommentReply(replyId)

    const response = h.response({
      status: 'success',
    })
    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
