const CommentsData = require('../CommentsData')

describe('a CommentsData entities', () => {
  it('should throw error when no payload given', () => {
    // Action and Assert
    expect(() => new CommentsData()).toThrowError(
      'COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when comments or replies payload not given', () => {
    // Action and Assert
    expect(() => new CommentsData({ comments: [] })).toThrowError(
      'COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
    expect(() => new CommentsData({ replies: [] })).toThrowError(
      'COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when comments or replies payload did not meet data type specification', () => {
    // Action and Assert
    expect(
      () => new CommentsData({ comments: true, replies: [] }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new CommentsData({ comments: [], replies: {} })).toThrowError(
      'COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should throw error when object of comments payload did not contain needed properties', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
      },
    ]
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

    // Action and Assert
    expect(
      () =>
        new CommentsData({ comments: commentData, replies: commentReplies }),
    ).toThrowError('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when object of replies payload did not contain needed properties', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
      },
    ]

    // Action and Assert
    expect(
      () =>
        new CommentsData({ comments: commentData, replies: commentReplies }),
    ).toThrowError('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when object of comments payload did not meet data specification', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: true,
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
      () =>
        new CommentsData({ comments: commentData, replies: commentReplies }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when object of replies payload did not meet data specification', () => {
    // Arrange
    const commentData = [
      {
        id: true,
        username: {},
        date: 'new Date()',
        content: [],
        is_delete: 123,
      },
    ]
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

    // Action and Assert
    expect(
      () =>
        new CommentsData({ comments: commentData, replies: commentReplies }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create CommentsData array correctly', () => {
    // Arrange
    const date = new Date()
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
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
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah comment',
        replies: expectedCommentReplies,
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: commentReplies,
    })

    // Assert
    expect(comments).toStrictEqual(expectedCommentData)
  })

  it('should create CommentsData array correctly with deleted comment and deleted comment reply', () => {
    // Arrange
    const date = new Date()
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
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
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: '**komentar telah dihapus**',
        replies: expectedCommentReplies,
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: commentReplies,
    })

    // Assert
    expect(comments).toStrictEqual(expectedCommentData)
  })

  it('should create CommentsData array correctly without comment reply', () => {
    // Arrange
    const date = new Date()
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: '**komentar telah dihapus**',
        replies: [],
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: [],
    })

    // Assert
    expect(comments).toStrictEqual(expectedCommentData)
  })
})
