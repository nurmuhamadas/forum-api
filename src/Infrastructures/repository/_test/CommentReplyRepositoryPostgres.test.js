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
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {},
      )
      const replyId = 'reply'

      // Action and Assert
      await expect(
        commentReplyRepository.verifyAvailableCommentReply(replyId),
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError if comment is exist', async () => {
      // Arrange
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {},
      )
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      // Action and Assert
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComment({ id: commentId })
      await CommentRepliesTableTestHelper.addCommentReply({ id: replyId })
      await expect(
        commentReplyRepository.verifyAvailableCommentReply(replyId),
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentReplyOwner function', () => {
    it('should throw AuthorizationError if user is not owner of the comment reply', async () => {
      // Arrange
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {},
      )
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
        commentReplyRepository.verifyCommentReplyOwner(secondUserId, replyId),
      ).rejects.toThrowError(AuthorizationError)

      UsersTableTestHelper.deleteUser(secondUserId)
    })

    it('should not throw AuthorizationError if user is owner of the comment reply', async () => {
      // Arrange
      const userId = 'user-123'
      const replyId = 'reply-123'
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {},
      )

      // Action and Assert
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({ userId })
      await expect(
        commentReplyRepository.verifyCommentReplyOwner(userId, replyId),
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('addCommentReply Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should add comment reply to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
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
      const registeredCommentReply =
        await commentReplyRepository.addCommentReply(registerCommentReply)

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

  describe('getCommentRepliesByCommentIds Function', () => {
    const _reply = {
      id: 'reply-123',
      user_id: 'user-123',
      comment_id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: '',
      is_delete: false,
    }

    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should get comment replies data by commentIds correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const commentIds = [_reply.comment_id]
      const expectedCommentReplies = [
        {
          id: _reply.id,
          comment_id: _reply.comment_id,
          user_id: _reply.user_id,
          username: _reply.username,
          created_at: _reply.date,
          content: _reply.content,
          is_delete: _reply.is_delete,
        },
      ]

      // Action
      await CommentRepliesTableTestHelper.addCommentReply(_reply)
      const repliesData =
        await commentReplyRepository.getCommentRepliesByCommentIds(commentIds)

      // Assert
      expect(repliesData).toHaveLength(1)
      expect(repliesData).toStrictEqual(expectedCommentReplies)
    })
  })

  describe('deleteCommentReply Function', () => {
    const _reply = {
      id: 'reply-123',
      user_id: 'user-123',
      comment_id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: '',
      is_delete: false,
    }

    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({})
    })

    it('should soft delete comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const replyId = 'reply-123'

      // Action
      const deletedCommentReplyId =
        await commentReplyRepository.deleteCommentReply(replyId)
      const deletedCommentReply =
        await CommentRepliesTableTestHelper.findCommentReplyById(replyId)

      // Assert
      expect(deletedCommentReplyId).toEqual(replyId)
      expect(deletedCommentReply[0].is_delete).toEqual(true)
    })
  })
})
