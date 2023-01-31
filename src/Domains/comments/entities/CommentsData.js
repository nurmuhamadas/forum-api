class CommentsData {
  constructor(payload) {
    this._verifyPayload(payload)

    const { replies, comments } = payload

    this.comments = this._mapComments(comments, replies)
  }

  _verifyPayload(payload) {
    if (!payload || !payload.replies || !payload.comments) {
      throw new Error('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    const { replies, comments } = payload

    if (!Array.isArray(replies) || !Array.isArray(comments)) {
      throw new Error('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    comments.forEach((c) => {
      if (
        c.id === undefined ||
        c.username === undefined ||
        c.date === undefined ||
        c.content === undefined ||
        c.is_delete === undefined
      ) {
        throw new Error('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
      }

      if (
        typeof c.id !== 'string' ||
        typeof c.username !== 'string' ||
        !(c.date instanceof Date) ||
        typeof c.content !== 'string' ||
        typeof c.is_delete !== 'boolean'
      ) {
        throw new Error('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    })

    if (replies.length > 0) {
      replies.forEach((r) => {
        if (
          r.id === undefined ||
          r.commentId === undefined ||
          r.username === undefined ||
          r.date === undefined ||
          r.content === undefined ||
          r.is_delete === undefined
        ) {
          throw new Error('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (
          typeof r.id !== 'string' ||
          typeof r.commentId !== 'string' ||
          typeof r.username !== 'string' ||
          !(r.date instanceof Date) ||
          typeof r.content !== 'string' ||
          typeof r.is_delete !== 'boolean'
        ) {
          throw new Error('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
      })
    }
  }

  _mapComments(comments, replies) {
    return comments.map((c) => {
      const _replies = replies.filter((r) => r.commentId === c.id)

      return {
        id: c.id,
        username: c.username,
        date: c.date,
        content: c.is_delete ? '**komentar telah dihapus**' : c.content,
        replies: _replies.map((r) => ({
          id: r.id,
          username: r.username,
          date: r.date,
          content: r.is_delete ? '**balasan telah dihapus**' : r.content,
        })),
      }
    })
  }
}

module.exports = CommentsData
