class RegisterComment {
  constructor(userId, threadId, payload) {
    this._verifyPayload({ userId, threadId, ...payload })

    const { content } = payload
    this.userId = userId
    this.threadId = threadId
    this.content = content
  }

  _verifyPayload({ userId, threadId, content }) {
    if (!userId || !threadId || !content) {
      throw new Error('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof userId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = RegisterComment
