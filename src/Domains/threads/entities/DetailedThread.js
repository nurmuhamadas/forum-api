class DetailedThread {
  constructor(thread, comments) {
    this._verifyPayload({ thread, comments })

    this.thread = {
      ...thread,
      comments: comments.map((d) => ({
        id: d.id,
        username: d.username,
        date: d.date,
        content: d.is_delete ? '**komentar telah dihapus**' : d.content,
      })),
    }
  }

  _verifyPayload({ thread, comments }) {
    if (
      !thread ||
      !thread.id ||
      !thread.title ||
      !thread.body ||
      !thread.date ||
      !thread.username ||
      (comments.length &&
        (!comments[0].id ||
          !comments[0].username ||
          comments[0].is_delete === undefined ||
          !comments[0].date ||
          !comments[0].content))
    ) {
      throw new Error('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof thread !== 'object' ||
      typeof thread.id !== 'string' ||
      typeof thread.title !== 'string' ||
      typeof thread.body !== 'string' ||
      !(thread.date instanceof Date) ||
      typeof thread.username !== 'string' ||
      !Array.isArray(comments) ||
      (comments.length &&
        (typeof comments[0].id !== 'string' ||
          typeof comments[0].username !== 'string' ||
          typeof comments[0].is_delete !== 'boolean' ||
          !(comments[0].date instanceof Date) ||
          typeof comments[0].content !== 'string'))
    ) {
      throw new Error('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailedThread
