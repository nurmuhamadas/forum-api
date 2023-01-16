const DetailedThread = require('../DetailedThread')

describe('a DetailedThread entities', () => {
  it('should throw error when thread payload undefined', () => {
    // Action and Assert
    expect(() => new DetailedThread()).toThrowError(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when thread payload did not contain needed property', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        content: 'sebuah comment',
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
    ]

    // Action and Assert
    expect(
      () => new DetailedThread(threadData, commentData, commentReplies),
    ).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when comment payload did not contain needed property', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        content: 'sebuah comment',
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
    ]

    // Action and Assert
    expect(
      () => new DetailedThread(threadData, commentData, commentReplies),
    ).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when comment reply payload did not contain needed property', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
    ]

    // Action and Assert
    expect(
      () => new DetailedThread(threadData, commentData, commentReplies),
    ).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when thread payload did not meet data type specification', () => {
    // Arrange
    const threadData = {
      id: true,
      title: 123,
      body: { a: 'a' },
      date: ['a'],
      username: 'dicoding',
    }
    const commentData = [
      {
        id: true,
        username: 123,
        date: { a: 'a' },
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const commentReplies = [
      {
        id: true,
        commentId: {},
        username: 123,
        date: 'new Date()',
        content: true,
        is_delete: 'false',
      },
    ]

    // Action and Assert
    expect(
      () => new DetailedThread(threadData, commentData, commentReplies),
    ).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when comment payload did not meet data type specification', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }
    const commentData = [
      {
        id: true,
        username: 123,
        date: { a: 'a' },
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const commentReplies = [
      {
        id: true,
        commentId: {},
        username: 123,
        date: 'new Date()',
        content: true,
        is_delete: 'false',
      },
    ]

    // Action and Assert
    expect(
      () => new DetailedThread(threadData, commentData, commentReplies),
    ).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when comment reply payload did not meet data type specification', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const commentReplies = [
      {
        id: true,
        commentId: {},
        username: 123,
        date: 'new Date()',
        content: true,
        is_delete: 'false',
      },
    ]

    // Action and Assert
    expect(
      () => new DetailedThread(threadData, commentData, commentReplies),
    ).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DetailedThread object correctly', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah balasan komentar',
        is_delete: false,
      },
    ]
    const expectedCommentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah balasan komentar',
      },
    ]
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        replies: expectedCommentReplies,
      },
    ]

    // Action
    const { thread } = new DetailedThread(
      threadData,
      commentData,
      commentReplies,
    )

    // Assert
    expect(thread).toStrictEqual({
      ...threadData,
      comments: expectedCommentData,
    })
  })

  it('should create DetailedThread object correctly with deleted comment and deleted comment reply', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah balasan komentar',
        is_delete: true,
      },
    ]
    const expectedCommentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: '**balasan telah dihapus**',
      },
    ]
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: '**komentar telah dihapus**',
        replies: expectedCommentReplies,
      },
    ]

    // Action
    const { thread } = new DetailedThread(
      threadData,
      commentData,
      commentReplies,
    )

    // Assert
    expect(thread).toStrictEqual({
      ...threadData,
      comments: expectedCommentData,
    })
  })

  it('should create DetailedThread object correctly without comment and comment reply', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    }

    // Action
    const { thread } = new DetailedThread(threadData, [], [])

    // Assert
    expect(thread).toStrictEqual({
      ...threadData,
      comments: [],
    })
  })
})
