class RegisteredCommentReply {
  constructor(userId, payload) {
    this._verifyPayload({ userId, ...payload })

    const { id, content } = payload
    this.id = id
    this.content = content
    this.owner = userId
  }

  _verifyPayload({ userId, id, content }) {
    if (!userId || !id || !content) {
      throw new Error('REGISTERED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof userId !== 'string' ||
      typeof id !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error(
        'REGISTERED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
      )
    }
  }
}

module.exports = RegisteredCommentReply
