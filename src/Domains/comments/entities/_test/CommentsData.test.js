const CommentRepliesData = require('../../../commentReplies/entities/CommentRepliesData')
const CommentsData = require('../CommentsData')

describe('a CommentsData entities', () => {
  it('should throw error when no payload given', () => {
    // Action and Assert
    expect(() => new CommentsData()).toThrowError(
      'COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when comments or replies or commentLikes payload not given', () => {
    // Action and Assert
    expect(
      () => new CommentsData({ comments: [], commentLikes: [] }),
    ).toThrowError('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(
      () => new CommentsData({ replies: [], commentLikes: [] }),
    ).toThrowError('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new CommentsData({ replies: [], comments: [] })).toThrowError(
      'COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when comments or replies or commentLikes payload did not meet data type specification', () => {
    // Action and Assert
    expect(
      () => new CommentsData({ comments: true, replies: [], commentLikes: [] }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(
      () => new CommentsData({ comments: [], replies: {}, commentLikes: [] }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(
      () =>
        new CommentsData({ comments: [], replies: [], commentLikes: '123' }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when object of comments payload did not contain needed properties', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah balasan komentar',
        is_delete: false,
      },
    ]
    const commentLikes = [{ comment_id: 'comment-123', count: '1' }]

    // Action and Assert
    expect(
      () =>
        new CommentsData({
          comments: commentData,
          replies: commentReplies,
          commentLikes,
        }),
    ).toThrowError('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when object of replies payload did not contain needed properties', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
      },
    ]
    const commentLikes = [{ comment_id: 'comment-123', count: '1' }]

    // Action and Assert
    expect(
      () =>
        new CommentsData({
          comments: commentData,
          replies: commentReplies,
          commentLikes,
        }),
    ).toThrowError('COMMENT_REPLIES_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when object of commentLikes payload did not contain needed properties', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
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
      () =>
        new CommentsData({
          comments: commentData,
          replies: commentReplies,
          commentLikes: [{}],
        }),
    ).toThrowError('COMMENTS_DATA.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when object of comments payload did not meet data specification', () => {
    // Arrange
    const commentData = [
      {
        id: true,
        username: {},
        created_at: 'new Date()',
        content: [],
        is_delete: 123,
      },
    ]
    const commentReplies = [
      {
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah balasan komentar',
        is_delete: false,
      },
    ]
    const commentLikes = [{ comment_id: 'comment-123', count: '1' }]

    // Action and Assert
    expect(
      () =>
        new CommentsData({
          comments: commentData,
          replies: commentReplies,
          commentLikes,
        }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when object of replies payload did not meet data specification', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
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
    const commentLikes = [{ comment_id: 'comment-123', count: '1' }]

    // Action and Assert
    expect(
      () =>
        new CommentsData({
          comments: commentData,
          replies: commentReplies,
          commentLikes,
        }),
    ).toThrowError('COMMENT_REPLIES_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when object of commentLikes payload did not meet data specification', () => {
    // Arrange
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
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
      () =>
        new CommentsData({
          comments: commentData,
          replies: commentReplies,
          commentLikes: [{ comment_id: 123, count: {} }],
        }),
    ).toThrowError('COMMENTS_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create CommentsData array correctly', () => {
    // Arrange
    const date = new Date()
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
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
    const commentLikes = [
      {
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        count: 1,
      },
    ]
    const expectedCommentReplies = new CommentRepliesData({
      replies: commentReplies,
    })
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah comment',
        likeCount: 1,
        replies: expectedCommentReplies.replies,
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes,
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
    const commentLikes = [
      {
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        count: 1,
      },
    ]
    const expectedCommentReplies = new CommentRepliesData({
      replies: commentReplies,
    })
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: '**komentar telah dihapus**',
        likeCount: 1,
        replies: expectedCommentReplies.replies,
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes,
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
        created_at: date,
        content: 'sebuah comment',
        is_delete: true,
      },
    ]
    const commentLikes = [
      {
        comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
        count: 1,
      },
    ]
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: '**komentar telah dihapus**',
        likeCount: 1,
        replies: [],
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: [],
      commentLikes,
    })

    // Assert
    expect(comments).toStrictEqual(expectedCommentData)
  })

  it('should create CommentsData array correctly without comment likes', () => {
    // Arrange
    const date = new Date()
    const commentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        created_at: date,
        content: 'sebuah comment',
        is_delete: false,
      },
    ]
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
    const expectedCommentReplies = new CommentRepliesData({
      replies: commentReplies,
    })
    const expectedCommentData = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date,
        content: 'sebuah comment',
        likeCount: 0,
        replies: expectedCommentReplies.replies,
      },
    ]

    // Action
    const { comments } = new CommentsData({
      comments: commentData,
      replies: commentReplies,
      commentLikes: [],
    })

    // Assert
    expect(comments).toStrictEqual(expectedCommentData)
  })
})
