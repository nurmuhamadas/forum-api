const CommentUseCase = require('../CommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment')
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('CommentUseCase', () => {
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
      const mockCommentRepository = new CommentRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.addComment = jest.fn(() =>
        Promise.resolve(new RegisteredComment(userId, useCasePayload)),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      })

      // Action
      const registeredComment = await commentUseCase.addComment(
        userId,
        threadId,
        useCasePayload,
      )

      // Assert
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadId,
      )
      expect(mockCommentRepository.addComment).toBeCalledWith(
        new RegisterComment(userId, threadId, useCasePayload),
      )
      expect(registeredComment).toStrictEqual(expectedRegisteredComment)
    })
  })

  describe('DeleteComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyCommentOwner = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.deleteComment = jest.fn(() =>
        Promise.resolve(commentId),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      })

      // Action and Assert
      const deletedCommentId = await commentUseCase.deleteComment({
        userId,
        threadId,
        commentId,
      })

      // Assert
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadId,
      )
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
      expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
        userId,
        commentId,
      )
      expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId)
      expect(deletedCommentId).toStrictEqual(commentId)
    })
  })
})
