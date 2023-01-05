const RegisterThread = require('../RegisterThread')

describe('a RegisterThread entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    // Arrange
    const userId = 'user-123'
    const payload1 = {
      title: 'Title',
    }
    const payload2 = {
      body: 'Body of thread',
    }

    // Action
    expect(() => new RegisterThread(userId, payload1)).toThrowError(
      'REGISTER_TRHEAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
    expect(() => new RegisterThread(userId, payload2)).toThrowError(
      'REGISTER_TRHEAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      title: 123,
      body: true,
    }

    // Action and Assert
    expect(() => new RegisterThread(userId, payload)).toThrowError(
      'REGISTER_TRHEAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should throw error when title contains more than 150 character', () => {
    // Arrange
    const userId = 'user-123'
    const payload = {
      title:
        'Titleyangsangatpanjangsekali..Titleyangsangatpanjangsekali..Titleyangsangatpanjangsekali..Titleyangsangatpanjangsekali..Titleyangsangatpanjangsekali..a',
      body: 'Body of thread',
    }

    // Action and Assert
    expect(() => new RegisterThread(userId, payload)).toThrowError(
      'REGISTER_TRHEAD.TITLE_LIMIT_CHAR',
    )
  })

  it('should create registerThread object correctly', () => {
    // Arrange
    const _userId = 'user-123'
    const payload = {
      title: 'Title',
      body: 'Body of thread',
    }

    // Action
    const { userId, title, body } = new RegisterThread(_userId, payload)

    // Assert
    expect(_userId).toEqual(userId)
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })
})
