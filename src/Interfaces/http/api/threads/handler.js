const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.postCommentHandler = this.postCommentHandler.bind(this)
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
}

module.exports = ThreadsHandler
