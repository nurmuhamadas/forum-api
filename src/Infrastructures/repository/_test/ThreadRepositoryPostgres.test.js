const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RegisterComment = require('../../../Domains/threads/entities/RegisterComment')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')
const RegisterCommentReply = require('../../../Domains/threads/entities/RegisterCommentReply')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')
const RegisteredComment = require('../../../Domains/threads/entities/RegisteredComment')
const RegisteredCommentReply = require('../../../Domains/threads/entities/RegisteredCommentReply')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('ThreadRepository postgres', () => {
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

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const payload = {
        title: 'Thread title',
        body: 'Body of Thread',
      }
      const registerThread = new RegisterThread(userId, payload)
      const expectedRegisteredThread = new RegisteredThread(userId, {
        id: 'thread-123',
        title: payload.title,
      })

      // Action
      const registeredThread = await threadRepository.addThread(registerThread)

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123')
      expect(registeredThread).toStrictEqual(expectedRegisteredThread)
      expect(thread).toHaveLength(1)
    })
  })

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
      const threadId = 'thread'

      // Action and Assert
      await expect(
        threadRepository.verifyAvailableThread(threadId),
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError if thread is exist', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
      const threadId = 'thread-123'

      // Action and Assert
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await expect(
        threadRepository.verifyAvailableThread(threadId),
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError if comment is not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
      const threadId = 'thread'

      // Action and Assert
      await expect(
        threadRepository.verifyAvailableComment(threadId),
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError if comment is exist', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
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
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
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
      const threadRepository = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({ id: commentId })
      await expect(
        threadRepository.verifyCommentOwner(userId, commentId),
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('verifyAvailableCommentReply function', () => {
    it('should throw NotFoundError if comment reply is not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
      const replyId = 'reply'

      // Action and Assert
      await expect(
        threadRepository.verifyAvailableCommentReply(replyId),
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError if comment is exist', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
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
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
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
      const threadRepository = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({ userId })
      await expect(
        threadRepository.verifyCommentReplyOwner(userId, replyId),
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
      const threadRepository = new ThreadRepositoryPostgres(
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
      const threadRepository = new ThreadRepositoryPostgres(
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

  describe('addCommentReply Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should add comment relpy to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new ThreadRepositoryPostgres(
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

  describe('deleteComment Function', () => {
    beforeAll(async () => {
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({})
    })

    it('should soft delete comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const commentReplyId = 'reply-123'

      // Action
      const deletedCommentReplyId = await threadRepository.deleteCommentReply(
        commentReplyId,
      )
      const deletedCommentReply =
        await CommentRepliesTableTestHelper.findCommentReplyById(commentReplyId)

      // Assert
      expect(deletedCommentReplyId).toEqual(commentReplyId)
      expect(deletedCommentReply[0].is_delete).toEqual(true)
    })
  })

  describe('getThread Function', () => {
    it('should get detailed thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const threadData = {
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: new Date(),
        username: 'dicoding',
      }
      const commentData = [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'dicoding',
          date: new Date(),
          content: 'sebuah comment',
          is_delete: false,
        },
      ]
      const commentReplies = [
        {
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          commentId: commentData[0].id,
          username: 'dicoding',
          date: new Date(),
          content: 'sebuah balasan komentar',
          is_delete: false,
        },
      ]
      const { thread: expectedThread } = new DetailedThread(
        threadData,
        commentData,
        commentReplies,
      )

      // Action
      await ThreadsTableTestHelper.addThread({
        id: threadData.id,
        title: threadData.title,
        body: threadData.body,
        userId,
        date: threadData.date,
      })
      await CommentsTableTestHelper.addComment({
        id: commentData[0].id,
        threadId: threadData.id,
        content: commentData[0].content,
        userId,
        date: commentData[0].date,
      })
      await CommentRepliesTableTestHelper.addCommentReply({
        id: commentReplies[0].id,
        commentId: commentData[0].id,
        content: commentReplies[0].content,
        userId,
        date: commentReplies[0].date,
      })
      const { thread } = await threadRepository.getThread(threadData.id)

      // Assert
      expect(thread).toBeDefined()
      expect(thread.id).toEqual(expectedThread.id)
      expect(thread.title).toEqual(expectedThread.title)
      expect(thread.body).toEqual(expectedThread.body)
      expect(thread.username).toEqual(expectedThread.username)
      expect(thread.date).toEqual(expectedThread.date)
      expect(thread.comments).toHaveLength(1)
      expect(thread.comments[0].id).toEqual(expectedThread.comments[0].id)
      expect(thread.comments[0].username).toEqual(
        expectedThread.comments[0].username,
      )
      expect(thread.comments[0].content).toEqual(
        expectedThread.comments[0].content,
      )
      expect(thread.comments[0].date).toEqual(expectedThread.comments[0].date)
      expect(thread.comments[0].replies).toHaveLength(1)
      expect(thread.comments[0].replies[0].id).toEqual(
        expectedThread.comments[0].replies[0].id,
      )
      expect(thread.comments[0].replies[0].username).toEqual(
        expectedThread.comments[0].replies[0].username,
      )
      expect(thread.comments[0].replies[0].content).toEqual(
        expectedThread.comments[0].replies[0].content,
      )
      expect(thread.comments[0].replies[0].date).toEqual(
        expectedThread.comments[0].replies[0].date,
      )
    })

    it('should get detailed thread correctly without comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      )
      const userId = 'user-123'
      const threadData = {
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: new Date(),
        username: 'dicoding',
      }
      const { thread: expectedThread } = new DetailedThread(threadData, [], [])

      // Action
      await ThreadsTableTestHelper.addThread({
        id: threadData.id,
        title: threadData.title,
        body: threadData.body,
        userId,
      })
      const { thread } = await threadRepository.getThread(threadData.id)

      // Assert
      expect(thread).toBeDefined()
      expect(thread.id).toEqual(expectedThread.id)
      expect(thread.title).toEqual(expectedThread.title)
      expect(thread.body).toEqual(expectedThread.body)
      expect(thread.username).toEqual(expectedThread.username)
      expect(thread.comments).toHaveLength(0)
    })
  })
})
