const CommentRepliesData = require('../../commentReplies/entities/CommentRepliesData')

class CommentsData {
  constructor(payload) {
    this._verifyPayload(payload)

    const { replies, comments, commentLikes } = payload

    this.comments = this._mapComments(comments, replies, commentLikes)
  }

  _verifyPayload(payload) {
    if (
      !payload ||
      !payload.replies ||
      !payload.comments ||
      !payload.commentLikes
    ) {
      throw new Error('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    const { replies, comments, commentLikes } = payload

    if (
      !Array.isArray(replies) ||
      !Array.isArray(comments) ||
      !Array.isArray(commentLikes)
    ) {
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

    commentLikes.forEach((l) => {
      if (l.comment_id === undefined || l.count === undefined) {
        throw new Error('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
      }

      if (
        typeof l.comment_id !== 'string' ||
        (typeof l.count !== 'string' && typeof l.count !== 'number')
      ) {
        throw new Error('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    })

    const _replies = new CommentRepliesData({ replies })
  }

  _mapComments(comments, replies, likes) {
    return comments.map((c) => {
      const selectedReplies = replies.filter((r) => r.comment_id === c.id)
      const _likeCount = likes.find((l) => l.comment_id === c.id)?.count || 0
      const _replies = new CommentRepliesData({ replies: selectedReplies })

      return {
        id: c.id,
        username: c.username,
        date: c.created_at,
        content: c.is_delete ? '**komentar telah dihapus**' : c.content,
        likeCount: Number(_likeCount),
        replies: _replies.replies,
      }
    })
  }
}

module.exports = CommentsData
