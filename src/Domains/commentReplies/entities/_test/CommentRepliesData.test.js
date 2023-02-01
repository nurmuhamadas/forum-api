const CommentRepliesData = require('../CommentRepliesData')

describe('a CommentRepliesData entities', () => {
  it('should throw error when replies payload undefined', () => {
    // Action and Assert
    expect(() => new CommentRepliesData()).toThrowError(
      'COMMENT_REPLIES_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
    expect(() => new CommentRepliesData({})).toThrowError(
      'COMMENT_REPLIES_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when replies payload did not contain needed property', () => {
    // Arrange
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
      },
    ]

    // Action and Assert
    expect(
      () => new CommentRepliesData({ replies: commentReplies }),
    ).toThrowError('COMMENT_REPLIES_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when replies payload did not meet data type specification', () => {
    // Action and Assert
    expect(() => new CommentRepliesData({ replies: 123 })).toThrowError(
      'COMMENT_REPLIES_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should throw error when object of replies payload did not meet data type specification', () => {
    // Arrange
    const commentReplies = [
      {
        id: true,
        comment_id: {},
        username: 123,
        created_at: 'new Date()',
        content: true,
        is_delete: 'false',
      },
    ]

    // Action and Assert
    expect(
      () => new CommentRepliesData({ replies: commentReplies }),
    ).toThrowError('COMMENT_REPLIES_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create CommentRepliesData object correctly', () => {
    // Arrange
    const date = new Date()
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
    const expectedCommentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah balasan komentar',
      },
    ]

    // Action
    const { replies } = new CommentRepliesData({
      replies: commentReplies,
    })

    // Assert
    expect(replies).toStrictEqual(expectedCommentReplies)
  })

  it('should create CommentRepliesData object correctly with deleted comment reply', () => {
    // Arrange
    const date = new Date()
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
    const expectedCommentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: '**balasan telah dihapus**',
      },
    ]

    // Action
    const { replies } = new CommentRepliesData({ replies: commentReplies })

    // Assert
    expect(replies).toStrictEqual(expectedCommentReplies)
  })
})
