const ThreadUseCase = require('../ThreadUseCase')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
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
        .mockImplementation(() =>
          Promise.resolve(new RegisteredThread(userId, useCasePayload)),
        )

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
      const commentReplies = [
        {
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'dicoding',
          date: new Date(),
          content: 'sebuah balasan komentar',
          is_delete: false,
        },
      ]
      const expectedDetailedThread = new DetailedThread(
        threadData,
        commentData,
        commentReplies,
      )

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()
      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest
        .fn()
        .mockImplementation(() => Promise.resolve())
      mockThreadRepository.getThread = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(
            new DetailedThread(threadData, commentData, commentReplies),
          ),
        )

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action
      const detailedThread = await getThreadUseCase.getThread(threadData.id)

      // Assert
      expect(detailedThread).toStrictEqual(expectedDetailedThread)
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadData.id,
      )
      expect(mockThreadRepository.getThread).toBeCalledWith(threadData.id)
    })
  })
})
