const CommentRepliesData = require('../../commentReplies/entities/CommentRepliesData')

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
        c.created_at === undefined ||
        c.content === undefined ||
        c.is_delete === undefined
      ) {
        throw new Error('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
      }

      if (
        typeof c.id !== 'string' ||
        typeof c.username !== 'string' ||
        !(c.created_at instanceof Date) ||
        typeof c.content !== 'string' ||
        typeof c.is_delete !== 'boolean'
      ) {
        throw new Error('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    })

    const _replies = new CommentRepliesData({ replies })
  }

  _mapComments(comments, replies) {
    return comments.map((c) => {
      const selectedReplies = replies.filter((r) => r.comment_id === c.id)
      const _replies = new CommentRepliesData({ replies: selectedReplies })

      return {
        id: c.id,
        username: c.username,
        date: c.created_at,
        content: c.is_delete ? '**komentar telah dihapus**' : c.content,
        replies: _replies.replies,
      }
    })
  }
}

module.exports = CommentsData
