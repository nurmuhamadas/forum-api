class DetailedThread {
  constructor(thread, comments, replies) {
    this._verifyPayload({ thread, comments, replies })

    const _comments = this._combineCommmentsAndReplies({ comments, replies })
    this.thread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      username: thread.username,
      comments: _comments,
    }
  }

  _combineCommmentsAndReplies({ comments, replies }) {
    return comments.map((comment) => {
      const _commentReply = replies
        .filter((r) => r.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.created_at,
          content: reply.is_delete
            ? '**balasan telah dihapus**'
            : reply.content,
        }))

      return {
        id: comment.id,
        username: comment.username,
        date: comment.created_at,
        content: comment.is_delete
          ? '**komentar telah dihapus**'
          : comment.content,
        replies: _commentReply,
      }
    })
  }

  _checkNeededProperties({ thread, comments, replies }) {
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
    if (comments.length) {
      if (
        !comments[0].id ||
        !comments[0].username ||
        comments[0].is_delete === undefined ||
        !comments[0].created_at ||
        !comments[0].content
      ) {
        return true
      }
    }
    if (replies.length) {
      if (
        !replies[0].id ||
        !replies[0].comment_id ||
        !replies[0].username ||
        replies[0].is_delete === undefined ||
        !replies[0].created_at ||
        !replies[0].content
      ) {
        return true
      }
    }

    return false
  }

  _checkPropertiesDataType({ thread, comments, replies }) {
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
    if (comments.length) {
      if (
        typeof comments[0].id !== 'string' ||
        typeof comments[0].username !== 'string' ||
        typeof comments[0].is_delete !== 'boolean' ||
        !(comments[0].created_at instanceof Date) ||
        typeof comments[0].content !== 'string'
      ) {
        return true
      }
    }
    if (replies.length) {
      if (
        typeof replies[0].id !== 'string' ||
        typeof replies[0].comment_id !== 'string' ||
        typeof replies[0].username !== 'string' ||
        typeof replies[0].is_delete !== 'boolean' ||
        !(replies[0].created_at instanceof Date) ||
        typeof replies[0].content !== 'string'
      ) {
        return true
      }
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
