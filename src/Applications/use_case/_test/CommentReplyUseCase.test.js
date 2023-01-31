const CommentReplyUseCase = require('../CommentReplyUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const CommentReplyRepository = require('../../../Domains/commentReplies/CommentReplyRepository')
const RegisterCommentReply = require('../../../Domains/commentReplies/entities/RegisterCommentReply')
const RegisteredCommentReply = require('../../../Domains/commentReplies/entities/RegisteredCommentReply')

describe('CommentReplyUseCase', () => {
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
      const mockCommentRepository = new CommentRepository()
      const mockCommentReplyRepository = new CommentReplyRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentReplyRepository.addCommentReply = jest.fn(() =>
        Promise.resolve(new RegisteredCommentReply(userId, useCasePayload)),
      )

      /** creating use case instance */
      const commentReplyUseCase = new CommentReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentReplyRepository: mockCommentReplyRepository,
      })

      // Action
      const registeredCommentReply = await commentReplyUseCase.addCommentReply({
        userId,
        threadId,
        commentId,
        payload: useCasePayload,
      })

      // Assert
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadId,
      )
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
      expect(mockCommentReplyRepository.addCommentReply).toBeCalledWith(
        new RegisterCommentReply({
          userId,
          threadId,
          commentId,
          payload: useCasePayload,
        }),
      )
      expect(registeredCommentReply).toStrictEqual(
        expectedRegisteredCommentReply,
      )
    })
  })

  describe('DeleteCommentReply', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const userId = 'userId-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()
      const mockCommentReplyRepository = new CommentReplyRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentReplyRepository.verifyAvailableCommentReply = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentReplyRepository.verifyCommentReplyOwner = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentReplyRepository.deleteCommentReply = jest.fn(() =>
        Promise.resolve(replyId),
      )

      /** creating use case instance */
      const commentReplyUseCase = new CommentReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentReplyRepository: mockCommentReplyRepository,
      })

      // Action and Assert
      const deletedCommentId = await commentReplyUseCase.deleteCommentReply({
        userId,
        threadId,
        commentId,
        replyId,
      })

      // Assert
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadId,
      )
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
      expect(
        mockCommentReplyRepository.verifyAvailableCommentReply,
      ).toBeCalledWith(replyId)
      expect(mockCommentReplyRepository.verifyCommentReplyOwner).toBeCalledWith(
        userId,
        replyId,
      )
      expect(mockCommentReplyRepository.deleteCommentReply).toBeCalledWith(
        replyId,
      )
      expect(deletedCommentId).toStrictEqual(replyId)
    })
  })
})
