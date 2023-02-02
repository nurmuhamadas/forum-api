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
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres')
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper')

describe('CommentRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({})
  })

  beforeEach(async () => {
    await ThreadsTableTestHelper.addThread({})
    await CommentsTableTestHelper.addComment({})
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await CommentLikesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('checkCommentLikeIsAvailable function', () => {
    it('should return undefined if related data is not exist in the table', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {})
      const userId = 'user-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      // Action
      const commentLike =
        await commentLikeRepository.checkCommentLikeIsAvailable({
          commentId,
          userId,
        })

      // Assert
      expect(commentLike).toBeUndefined()
    })

    it('should return commentLike if related data is exist in the table', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {})
      const userId = 'user-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      // Action
      await CommentLikesTableTestHelper.addCommentLike({
        id: commentLikeId,
        commentId,
        userId,
        isLiked: true,
      })
      const commentLike =
        await commentLikeRepository.checkCommentLikeIsAvailable({
          commentId,
          userId,
        })

      // Assert
      expect(commentLike).toStrictEqual({ is_liked: true })
    })
  })

  describe('addCommentLike function', () => {
    it('should add commentLike data to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentLikeRepository = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      // Action
      await commentLikeRepository.addCommentLike({
        commentId,
        userId,
        isLiked: true,
      })
      const commentLike = await CommentLikesTableTestHelper.getCommentLikeById(
        commentLikeId,
      )

      // Assert
      expect(commentLike).toStrictEqual({
        id: commentLikeId,
        comment_id: commentId,
        user_id: userId,
        is_liked: true,
      })
    })
  })

  describe('putCommentLike function', () => {
    it('should update is_liked data from database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentLikeRepository = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      // Action
      await CommentLikesTableTestHelper.addCommentLike({
        id: commentLikeId,
        commentId,
        userId,
        isLiked: true,
      })

      const updatedCommentLike = await commentLikeRepository.putCommentLike({
        commentId,
        userId,
        isLiked: false,
      })
      const commentLike = await CommentLikesTableTestHelper.getCommentLikeById(
        commentLikeId,
      )

      // Assert
      expect(updatedCommentLike.id).toEqual(commentLikeId)
      expect(commentLike).toStrictEqual({
        id: commentLikeId,
        comment_id: commentId,
        user_id: userId,
        is_liked: false,
      })

      // Action
      const updatedCommentLike2 = await commentLikeRepository.putCommentLike({
        commentId,
        userId,
        isLiked: true,
      })
      const commentLike2 = await CommentLikesTableTestHelper.getCommentLikeById(
        commentLikeId,
      )

      // Assert
      expect(updatedCommentLike2.id).toEqual(commentLikeId)
      expect(commentLike2).toStrictEqual({
        id: commentLikeId,
        comment_id: commentId,
        user_id: userId,
        is_liked: true,
      })
    })
  })

  describe('getCommentLikesByCommentIds function', () => {
    it('should get commentLikes count data from database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentLikeRepository = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const userId2 = 'user-321'
      const commentIds = ['comment-123']
      const commentLikeId = 'comment_like-123'
      const commentLikeId2 = 'comment_like-321'

      // Add new user
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'user2' })

      // Action
      await CommentLikesTableTestHelper.addCommentLike({
        id: commentLikeId,
        commentId: commentIds[0],
        userId,
        isLiked: true,
      })
      await CommentLikesTableTestHelper.addCommentLike({
        id: commentLikeId2,
        commentId: commentIds[0],
        userId: userId2,
        isLiked: false,
      })

      const likes = await commentLikeRepository.getCommentLikesByCommentIds(
        commentIds,
      )

      // Assert
      expect(likes).toHaveLength(1)
      expect(likes[0].comment_id).toEqual(commentIds[0])
      expect(Number(likes[0].count)).toEqual(1)
    })
  })
})
