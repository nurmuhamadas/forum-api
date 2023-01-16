const RegisterCommentReply = require('../RegisterCommentReply')

describe('a RegisterCommentReply entities', () => {
  it('should throw error when payload did no contain needed property', () => {
    // Arrange
    const userId = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const payload = {}

    // Action
    expect(
      () => new RegisterCommentReply({ userId, threadId, commentId, payload }),
    ).toThrowError('REGISTER_THREAD.COMMENT.REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const userId = true
    const threadId = 123
    const commentId = 'comment-123'
    const payload = {
      content: {},
    }

    // Action and Assert
    expect(
      () => new RegisterCommentReply({ userId, threadId, commentId, payload }),
    ).toThrowError(
      'REGISTER_THREAD.COMMENT.REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create RegisterCommentReply object correctly', () => {
    // Arrange
    const _userId = 'user-123'
    const _threadId = 'thread-123'
    const _commentId = 'comment-123'
    const payload = {
      content: 'Comment content',
    }

    // Action
    const { userId, threadId, content, commentId } = new RegisterCommentReply({
      userId: _userId,
      threadId: _threadId,
      commentId: _commentId,
      payload,
    })

    // Assert
    expect(userId).toEqual(_userId)
    expect(threadId).toEqual(_threadId)
    expect(commentId).toEqual(_commentId)
    expect(content).toEqual(payload.content)
  })
})
