const RegisteredCommentReply = require('../RegisteredCommentReply')

describe('a RegisteredCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      content: 'Reply content',
    }

    // Action and Assert
    expect(() => new RegisteredCommentReply(userId, payload)).toThrowError(
      'REGISTERED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      id: 123,
      content: true,
    }

    // Action and Assert
    expect(() => new RegisteredCommentReply(userId, payload)).toThrowError(
      'REGISTERED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create RegisteredCommentReply object correctly', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      id: 'reply-123',
      content: 'Reply content',
    }

    // Action
    const registeredReply = new RegisteredCommentReply(userId, payload)

    // Assert
    expect(registeredReply.owner).toEqual(userId)
    expect(registeredReply.id).toEqual(payload.id)
    expect(registeredReply.content).toEqual(payload.content)
  })
})
