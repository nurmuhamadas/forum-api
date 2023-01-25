const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepository postgres', () => {
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

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError if comment is not found', async () => {
      // Arrange
      const threadRepository = new CommentRepositoryPostgres(pool, {})
      const threadId = 'thread'

      // Action and Assert
      await expect(
        threadRepository.verifyAvailableComment(threadId),
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError if comment is exist', async () => {
      // Arrange
      const threadRepository = new CommentRepositoryPostgres(pool, {})
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      // Action and Assert
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComment({ id: commentId })
      await expect(
        threadRepository.verifyAvailableComment(commentId),
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError if user is not owner of the comment', async () => {
      // Arrange
      const threadRepository = new CommentRepositoryPostgres(pool, {})
      const firstUserId = 'user-123'
      const secondUserId = 'user-321'
      const commentId = 'comment-123'

      // Action
      await UsersTableTestHelper.addUser({
        id: secondUserId,
        username: 'second user',
      })
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({ userId: firstUserId })

      // Assert
      await expect(
        threadRepository.verifyCommentOwner(secondUserId, commentId),
      ).rejects.toThrowError(AuthorizationError)

      UsersTableTestHelper.deleteUser(secondUserId)
    })

    it('should not throw AuthorizationError if user is owner of the comment', async () => {
      // Arrange
      const userId = 'user-123'
      const commentId = 'comment-123'
      const threadRepository = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({ id: commentId })
      await expect(
        threadRepository.verifyCommentOwner(userId, commentId),
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('addComment Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
    })

    it('should add comment to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const threadId = 'thread-123'
      const payload = {
        content: 'Content of The comment',
      }
      const registerComment = new RegisterComment(userId, threadId, payload)
      const expectedRegisteredComment = new RegisteredComment(userId, {
        id: 'comment-123',
        content: payload.content,
      })

      // Action
      const registeredComment = await threadRepository.addComment(
        registerComment,
      )

      // Assert
      const thread = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      )
      expect(registeredComment).toStrictEqual(expectedRegisteredComment)
      expect(thread).toHaveLength(1)
    })
  })

  describe('deleteComment Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should soft delete comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const commentId = 'comment-123'

      // Action
      const deletedCommentId = await threadRepository.deleteComment(commentId)
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId,
      )

      // Assert
      expect(deletedCommentId).toEqual(commentId)
      expect(deletedComment[0].is_delete).toEqual(true)
    })
  })

  describe('deleteComment Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should soft delete comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const commentId = 'comment-123'

      // Action
      const deletedCommentId = await commentRepository.deleteComment(commentId)
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId,
      )

      // Assert
      expect(deletedCommentId).toEqual(commentId)
      expect(deletedComment[0].is_delete).toEqual(true)
    })
  })
})
