const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')
const RegisterCommentReply = require('../../../Domains/commentReplies/entities/RegisterCommentReply')
const RegisteredCommentReply = require('../../../Domains/commentReplies/entities/RegisteredCommentReply')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentReplyRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({})
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await CommentRepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('verifyAvailableCommentReply function', () => {
    it('should throw NotFoundError if comment reply is not found', async () => {
      // Arrange
      const threadRepository = new CommentReplyRepositoryPostgres(pool, {})
      const replyId = 'reply'

      // Action and Assert
      await expect(
        threadRepository.verifyAvailableCommentReply(replyId),
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError if comment is exist', async () => {
      // Arrange
      const threadRepository = new CommentReplyRepositoryPostgres(pool, {})
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      // Action and Assert
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComment({ id: commentId })
      await CommentRepliesTableTestHelper.addCommentReply({ id: replyId })
      await expect(
        threadRepository.verifyAvailableCommentReply(replyId),
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentReplyOwner function', () => {
    it('should throw AuthorizationError if user is not owner of the comment reply', async () => {
      // Arrange
      const threadRepository = new CommentReplyRepositoryPostgres(pool, {})
      const firstUserId = 'user-123'
      const secondUserId = 'user-321'
      const replyId = 'reply-123'

      // Action
      await UsersTableTestHelper.addUser({
        id: secondUserId,
        username: 'second user',
      })
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({
        userId: firstUserId,
      })

      // Assert
      await expect(
        threadRepository.verifyCommentReplyOwner(secondUserId, replyId),
      ).rejects.toThrowError(AuthorizationError)

      UsersTableTestHelper.deleteUser(secondUserId)
    })

    it('should not throw AuthorizationError if user is owner of the comment reply', async () => {
      // Arrange
      const userId = 'user-123'
      const replyId = 'reply-123'
      const threadRepository = new CommentReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({ userId })
      await expect(
        threadRepository.verifyCommentReplyOwner(userId, replyId),
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('addCommentReply Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should add comment relpy to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const payload = {
        content: 'Content of The comment reply',
      }
      const registerCommentReply = new RegisterCommentReply({
        userId,
        threadId,
        commentId,
        payload,
      })
      const expectedRegisteredCommentReply = new RegisteredCommentReply(
        userId,
        { id: 'reply-123', content: payload.content },
      )

      // Action
      const registeredCommentReply = await threadRepository.addCommentReply(
        registerCommentReply,
      )

      // Assert
      const thread = await CommentRepliesTableTestHelper.findCommentReplyById(
        'reply-123',
      )
      expect(registeredCommentReply).toStrictEqual(
        expectedRegisteredCommentReply,
      )
      expect(thread).toHaveLength(1)
    })
  })
})
