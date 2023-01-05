class RegisteredThread {
  constructor(userId, payload) {
    this._verifyPayload({ userId, ...payload })

    const { id, title } = payload
    this.id = id
    this.title = title
    this.owner = userId
  }

  _verifyPayload({ userId, id, title }) {
    if (!userId || !id || !title) {
      throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof userId !== 'string' ||
      typeof id !== 'string' ||
      typeof title !== 'string'
    ) {
      throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = RegisteredThread
