const ThreadUseCase = require('../ThreadUseCase')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const RegisterComment = require('../../../Domains/threads/entities/RegisterComment')
const RegisteredComment = require('../../../Domains/threads/entities/RegisteredComment')

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
})
