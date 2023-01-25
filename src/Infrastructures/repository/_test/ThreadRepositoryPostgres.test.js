const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')

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
