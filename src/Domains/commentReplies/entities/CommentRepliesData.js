class CommentRepliesData {
  constructor(payload) {
    this._verifyPayload(payload)

    const { replies } = payload

    this.replies = this._mapReplies(replies)
  }

  _verifyPayload(payload) {
    if (!payload || !payload.replies) {
      throw new Error('COMMENT_REPLIES_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    const { replies } = payload

    if (!Array.isArray(replies)) {
      throw new Error('COMMENT_REPLIES_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    replies.forEach((r) => {
      if (
        r.id === undefined ||
        r.comment_id === undefined ||
        r.username === undefined ||
        r.created_at === undefined ||
        r.content === undefined ||
        r.is_delete === undefined
      ) {
        throw new Error('COMMENT_REPLIES_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
      }

      if (
        typeof r.id !== 'string' ||
        typeof r.comment_id !== 'string' ||
        typeof r.username !== 'string' ||
        !(r.created_at instanceof Date) ||
        typeof r.content !== 'string' ||
        typeof r.is_delete !== 'boolean'
      ) {
        throw new Error('COMMENT_REPLIES_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    })
  }

  _mapReplies(replies) {
    return replies.map((r) => ({
      id: r.id,
      username: r.username,
      date: r.created_at,
      content: r.is_delete ? '**balasan telah dihapus**' : r.content,
    }))
  }
}

module.exports = CommentRepliesData
