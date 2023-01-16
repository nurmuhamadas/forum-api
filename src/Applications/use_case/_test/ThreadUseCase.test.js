const ThreadUseCase = require('../ThreadUseCase')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const RegisterComment = require('../../../Domains/threads/entities/RegisterComment')
const RegisteredComment = require('../../../Domains/threads/entities/RegisteredComment')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')
const RegisterCommentReply = require('../../../Domains/threads/entities/RegisterCommentReply')
const RegisteredCommentReply = require('../../../Domains/threads/entities/RegisteredCommentReply')

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

  describe('AddCommentReply', () => {
    it('should orchestrating the add comment reply action correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const useCasePayload = {
        id: 'reply-123',
        content: 'Content of the comment reply',
      }
      const expectedRegisteredCommentReply = new RegisteredCommentReply(
        userId,
        useCasePayload,
      )

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.addCommentReply = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(expectedRegisteredCommentReply),
        )

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action
      const registeredCommentReply = await getThreadUseCase.addCommentReply({
        userId,
        threadId,
        commentId,
        payload: useCasePayload,
      })

      // Assert
      expect(registeredCommentReply).toStrictEqual(
        expectedRegisteredCommentReply,
      )
      expect(mockThreadRepository.addCommentReply).toBeCalledWith(
        new RegisterCommentReply({
          userId,
          threadId,
          commentId,
          payload: useCasePayload,
        }),
      )
    })
  })

  describe('DeleteCommentReply', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const replyId = 'reply-123'

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.deleteCommentReply = jest
        .fn()
        .mockImplementation(() => Promise.resolve(replyId))

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action and Assert
      const deletedCommentId = await threadUseCase.deleteCommentReply(replyId)

      // Assert
      expect(deletedCommentId).toStrictEqual(replyId)
      expect(mockThreadRepository.deleteCommentReply).toBeCalledWith(replyId)
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
