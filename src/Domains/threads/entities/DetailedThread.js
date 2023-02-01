const CommentsData = require('../../comments/entities/CommentsData')

class DetailedThread {
  constructor(thread, comments) {
    this._verifyPayload({ thread, comments })

    this.thread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      username: thread.username,
      comments: comments.comments,
    }
  }

  _checkNeededProperties({ thread, comments }) {
    if (!thread) return true
    if (
      !thread.id ||
      !thread.title ||
      !thread.body ||
      !thread.created_at ||
      !thread.username
    ) {
      return true
    }

    if (comments === undefined) {
      return true
    }

    return false
  }

  _checkPropertiesDataType({ thread, comments }) {
    if (
      typeof thread !== 'object' ||
      typeof thread.id !== 'string' ||
      typeof thread.title !== 'string' ||
      typeof thread.body !== 'string' ||
      !(thread.created_at instanceof Date) ||
      typeof thread.username !== 'string'
    ) {
      return true
    }

    if (!(comments instanceof CommentsData)) {
      return true
    }

    return false
  }

  _verifyPayload({ thread, comments, replies }) {
    if (this._checkNeededProperties({ thread, comments, replies })) {
      throw new Error('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (this._checkPropertiesDataType({ thread, comments, replies })) {
      throw new Error('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailedThread
