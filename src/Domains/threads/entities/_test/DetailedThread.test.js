const CommentsData = require('../../../comments/entities/CommentsData')
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
    const date = new Date()
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah balasan komentar',
        is_delete: true,
      },
    ]

    const comments = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })

    // Action and Assert
    expect(() => new DetailedThread(threadData, comments)).toThrowError(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when comment payload is undefined', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: new Date(),
      username: 'dicoding',
    }

    // Action and Assert
    expect(() => new DetailedThread(threadData)).toThrowError(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when thread payload did not meet data type specification', () => {
    // Arrange
    const date = new Date()
    const threadData = {
      id: true,
      title: 123,
      body: { a: 'a' },
      created_at: ['a'],
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah balasan komentar',
        is_delete: true,
      },
    ]

    const comments = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })

    // Action and Assert
    expect(() => new DetailedThread(threadData, comments)).toThrowError(
      'DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should throw error when comment payload is not instance of CommentsData Entities', () => {
    // Arrange
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: new Date(),
      username: 'dicoding',
    }
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]

    // Action and Assert
    expect(() => new DetailedThread(threadData, commentData)).toThrowError(
      'DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create DetailedThread object correctly', () => {
    // Arrange
    const date = new Date()
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: date,
      username: 'dicoding',
    }
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah balasan komentar',
        is_delete: false,
      },
    ]
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const comments = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })

    const expectedCommentData = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })
    const expectedThreadData = {
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.created_at,
      username: threadData.username,
      comments: expectedCommentData.comments,
    }

    // Action
    const { thread } = new DetailedThread(threadData, comments)

    // Assert
    expect(thread).toStrictEqual(expectedThreadData)
  })

  it('should create DetailedThread object correctly with deleted comment and deleted comment reply', () => {
    // Arrange
    const date = new Date()
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: date,
      username: 'dicoding',
    }
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah balasan komentar',
        is_delete: true,
      },
    ]
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const comments = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })

    const expectedCommentData = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })
    const expectedThreadData = {
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.created_at,
      username: threadData.username,
      comments: expectedCommentData.comments,
    }

    // Action
    const { thread } = new DetailedThread(threadData, comments)

    // Assert
    expect(thread).toStrictEqual(expectedThreadData)
  })

  it('should create DetailedThread object correctly without comment and comment reply and comment likes', () => {
    // Arrange
    const date = new Date()
    const threadData = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: date,
      username: 'dicoding',
    }
    const expectedThreadData = {
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.created_at,
      username: threadData.username,
      comments: [],
    }
    const comments = new CommentsData({
      comments: [],
      replies: [],
      commentLikes: [],
    })

    // Action
    const { thread } = new DetailedThread(threadData, comments)

    // Assert
    expect(thread).toStrictEqual(expectedThreadData)
  })
})
