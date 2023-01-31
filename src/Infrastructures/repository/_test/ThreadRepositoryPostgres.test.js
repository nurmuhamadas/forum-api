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
        created_at: new Date(),
        username: 'dicoding',
      }
      const expectedThread = {
        id: threadData.id,
        title: threadData.title,
        body: threadData.body,
        created_at: threadData.created_at,
        username: threadData.username,
      }

      // Action
      await ThreadsTableTestHelper.addThread({
        id: threadData.id,
        title: threadData.title,
        body: threadData.body,
        userId,
        date: threadData.created_at,
      })
      const thread = await threadRepository.getThread(threadData.id)

      // Assert
      expect(thread).toBeDefined()
      expect(thread.id).toEqual(expectedThread.id)
      expect(thread.title).toEqual(expectedThread.title)
      expect(thread.body).toEqual(expectedThread.body)
      expect(thread.username).toEqual(expectedThread.username)
      expect(thread.date).toEqual(expectedThread.date)
    })
  })
})
