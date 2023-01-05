class RegisterThread {
  constructor(userId, payload) {
    this._verifyPayload({ userId, ...payload })

    const { title, body } = payload
    this.userId = userId
    this.title = title
    this.body = body
  }

  _verifyPayload({ userId, title, body }) {
    if (!userId || !body || !title) {
      throw new Error('REGISTER_TRHEAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof userId !== 'string' ||
      typeof body !== 'string' ||
      typeof title !== 'string'
    ) {
      throw new Error('REGISTER_TRHEAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (title.length > 150) {
      throw new Error('REGISTER_TRHEAD.TITLE_LIMIT_CHAR')
    }
  }
}

module.exports = RegisterThread
