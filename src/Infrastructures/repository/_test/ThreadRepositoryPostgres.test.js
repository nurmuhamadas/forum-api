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

describe('ThreadRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({})
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
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

      // Action
      await threadRepository.addThread(registerThread)

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123')
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

      // Action
      await threadRepository.addComment(registerComment)

      // Assert
      const thread = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      )
      expect(thread).toHaveLength(1)
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
          username: 'johndoe',
          date: new Date(),
          content: 'sebuah comment',
        },
      ]
      const detailedThread = new DetailedThread(threadData, commentData)

      // Action
      await ThreadsTableTestHelper.addThread({
        id: threadData.id,
        title: threadData.title,
        body: threadData.body,
        userId,
      })
      await CommentsTableTestHelper.addComment({
        id: commentData[0].id,
        threadId: threadData.id,
        content: commentData[0].content,
        userId,
      })
      const { thread } = await threadRepository.getThread(threadData.id)

      // Assert
      // expect(thread.id).toEqual(detailedThread.id)
      // expect(thread.title).toEqual(detailedThread.title)
      // expect(thread.body).toEqual(detailedThread.body)
      // expect(thread.username).toEqual(detailedThread.username)
      // expect(thread.comments).toHaveLength(1)
      // expect(thread.comments[0].id).toEqual(detailedThread.comments[0].id)
      // expect(thread.comments[0].username).toEqual(
      //   detailedThread.comments[0].username,
      // )
      // expect(thread.comments[0].content).toEqual(
      //   detailedThread.comments[0].content,
      // )
    })
  })
})
