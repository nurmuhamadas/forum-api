class RegisterCommentReply {
  constructor({ userId, threadId, commentId, payload }) {
    this._verifyPayload({ userId, threadId, commentId, ...payload })

    const { content } = payload
    this.userId = userId
    this.threadId = threadId
    this.commentId = commentId
    this.content = content
  }

  _verifyPayload({ userId, threadId, commentId, content }) {
    if (!userId || !threadId || !commentId || !content) {
      throw new Error(
        'REGISTER_THREAD.COMMENT.REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
      )
    }

    if (
      typeof userId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error(
        'REGISTER_THREAD.COMMENT.REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
      )
    }
  }
}

module.exports = RegisterCommentReply
