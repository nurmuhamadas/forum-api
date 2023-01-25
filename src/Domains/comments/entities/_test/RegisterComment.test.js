const RegisterComment = require('../RegisterComment')

describe('a RegisterComment entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    // Arrange
    const userId = 'user-123'
    const threadId = 'thread-123'
    const payload = {}

    // Action
    expect(() => new RegisterComment(userId, threadId, payload)).toThrowError(
      'REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const userId = true
    const threadId = 123
    const payload = {
      content: {},
    }

    // Action and Assert
    expect(() => new RegisterComment(userId, threadId, payload)).toThrowError(
      'REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create RegisterComment object correctly', () => {
    // Arrange
    const _userId = 'user-123'
    const _threadId = 'thread-123'
    const payload = {
      content: 'Comment content',
    }

    // Action
    const { userId, threadId, content } = new RegisterComment(
      _userId,
      _threadId,
      payload,
    )

    // Assert
    expect(userId).toEqual(_userId)
    expect(threadId).toEqual(_threadId)
    expect(content).toEqual(payload.content)
  })
})
