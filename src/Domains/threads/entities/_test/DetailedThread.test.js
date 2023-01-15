const DetailedThread = require('../DetailedThread')

describe('a DetailedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
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

    // Action and Assert
    expect(() => new DetailedThread(threadData, commentData)).toThrowError(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
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
      },
    ]

    // Action and Assert
    expect(() => new DetailedThread(threadData, commentData)).toThrowError(
      'DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
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
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
      },
    ]

    // Action
    const { thread } = new DetailedThread(threadData, commentData)

    // Assert
    expect(thread).toStrictEqual({
      ...threadData,
      comments: commentData,
    })
  })
})
