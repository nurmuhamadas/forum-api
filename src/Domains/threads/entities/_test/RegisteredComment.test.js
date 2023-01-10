const RegisteredComment = require('../RegisteredComment')

describe('a RegisteredComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      content: 'Comment content',
    }

    // Action and Assert
    expect(() => new RegisteredComment(userId, payload)).toThrowError(
      'REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
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
    expect(() => new RegisteredComment(userId, payload)).toThrowError(
      'REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create RegisteredComment object correctly', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      id: 'comment-123',
      content: 'Comment content',
    }

    // Action
    const registeredUser = new RegisteredComment(userId, payload)

    // Assert
    expect(registeredUser.owner).toEqual(userId)
    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.content).toEqual(payload.content)
  })
})
