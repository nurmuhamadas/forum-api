const RegisteredThread = require('../RegisteredThread')

describe('a RegisteredThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      title: 'Title',
      body: 'Body thread',
    }

    // Action and Assert
    expect(() => new RegisteredThread(userId, payload)).toThrowError(
      'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      id: 123,
      title: true,
      body: {},
    }

    // Action and Assert
    expect(() => new RegisteredThread(userId, payload)).toThrowError(
      'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create registeredThread object correctly', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      id: 'thread-123',
      title: 'Title',
      body: 'Body thread',
    }

    // Action
    const registeredUser = new RegisteredThread(userId, payload)

    // Assert
    expect(registeredUser.owner).toEqual(userId)
    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.title).toEqual(payload.title)
  })
})
