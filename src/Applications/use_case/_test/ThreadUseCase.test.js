const ThreadUseCase = require('../ThreadUseCase')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const RegisterComment = require('../../../Domains/threads/entities/RegisterComment')
const RegisteredComment = require('../../../Domains/threads/entities/RegisteredComment')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')

describe('ThreadUseCase', () => {
  describe('AddThread', () => {
    it('should orchestrating the add thread action correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const useCasePayload = {
        id: 'thread-123',
        title: 'Thread title',
        body: 'Body of thread',
      }
      const expectedRegisteredThread = new RegisteredThread(
        userId,
        useCasePayload,
      )

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.addThread = jest
        .fn()
        .mockImplementation(() => Promise.resolve(expectedRegisteredThread))

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action
      const registeredThread = await getThreadUseCase.addThread(
        userId,
        useCasePayload,
      )

      // Assert
      expect(registeredThread).toStrictEqual(expectedRegisteredThread)
      expect(mockThreadRepository.addThread).toBeCalledWith(
        new RegisterThread(userId, {
          title: useCasePayload.title,
          body: useCasePayload.body,
        }),
      )
    })
  })

  describe('AddComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const useCasePayload = {
        id: 'comment-123',
        content: 'Content of the comment',
      }
      const expectedRegisteredComment = new RegisteredComment(
        userId,
        useCasePayload,
      )

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.addComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve(expectedRegisteredComment))

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action
      const registeredComment = await getThreadUseCase.addComment(
        userId,
        threadId,
        useCasePayload,
      )

      // Assert
      expect(registeredComment).toStrictEqual(expectedRegisteredComment)
      expect(mockThreadRepository.addComment).toBeCalledWith(
        new RegisterComment(userId, threadId, useCasePayload),
      )
    })
  })

  describe('DeleteComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const commentId = 'comment-123'

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.deleteComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve(commentId))

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action and Assert
      const deletedCommentId = await threadUseCase.deleteComment(commentId)

      // Assert
      expect(deletedCommentId).toStrictEqual(commentId)
      expect(mockThreadRepository.deleteComment).toBeCalledWith(commentId)
    })
  })

  describe('GetThread', () => {
    it('should orchestrating the get thread action correctly', async () => {
      // Arrange
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
      const expectedDetailedThread = new DetailedThread(threadData, commentData)

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()
      /** mocking needed function */
      mockThreadRepository.getThread = jest
        .fn()
        .mockImplementation(() => Promise.resolve(expectedDetailedThread))

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action
      const detailedThread = await getThreadUseCase.getThread(threadData.id)

      // Assert
      expect(detailedThread).toStrictEqual(expectedDetailedThread)
      expect(mockThreadRepository.getThread).toBeCalledWith(threadData.id)
    })
  })
})
