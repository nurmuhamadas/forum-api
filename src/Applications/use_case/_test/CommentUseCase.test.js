const CommentUseCase = require('../CommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment')
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentLikeRepository = require('../../../Domains/commentLikes/commentLikeRepository')

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

  describe('LikeUnlikeComment', () => {
    it('should throw error when no payload given', () => {
      /** creating dependency of use case */
      const commentUseCase = new CommentUseCase({})

      // action and assert
      expect(commentUseCase.likeUnlikeComment()).rejects.toThrowError(
        'COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
      )
    })

    it('should throw error when payload not contain needed properties', () => {
      /** creating dependency of use case */
      const commentUseCase = new CommentUseCase({})

      // action and assert
      expect(
        commentUseCase.likeUnlikeComment({
          commentId: '',
          threadId: '',
        }),
      ).rejects.toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      expect(
        commentUseCase.likeUnlikeComment({
          threadId: '',
          userId: '',
        }),
      ).rejects.toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      expect(
        commentUseCase.likeUnlikeComment({
          userId: '',
          commentId: '',
        }),
      ).rejects.toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload not meet data spesification', () => {
      /** creating dependency of use case */
      const commentUseCase = new CommentUseCase({})

      // action and assert
      expect(
        commentUseCase.likeUnlikeComment({
          commentId: '123',
          threadId: '123',
          userId: 123,
        }),
      ).rejects.toThrowError('COMMENT_USE_CASE.NOT_MEET_DATA_SPECIFICATION')
      expect(
        commentUseCase.likeUnlikeComment({
          commentId: '123',
          threadId: 123,
          userId: '123',
        }),
      ).rejects.toThrowError('COMMENT_USE_CASE.NOT_MEET_DATA_SPECIFICATION')
      expect(
        commentUseCase.likeUnlikeComment({
          userId: '123',
          threadId: '123',
          commentId: 123,
        }),
      ).rejects.toThrowError('COMMENT_USE_CASE.NOT_MEET_DATA_SPECIFICATION')
    })

    it('should throw error if thread not found', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.reject(new NotFoundError('COMMENT_USE_CASE.THREAD_NOT_FOUND')),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
      })

      // Action and Assert
      await expect(
        commentUseCase.likeUnlikeComment({ commentId, userId, threadId }),
      ).rejects.toThrowError('COMMENT_USE_CASE.THREAD_NOT_FOUND')
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadId,
      )
    })

    it('should throw error if comment not found', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository()
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.reject(new NotFoundError('COMMENT_USE_CASE.COMMENT_NOT_FOUND')),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      })

      // Action and Assert
      await expect(
        commentUseCase.likeUnlikeComment({ commentId, userId, threadId }),
      ).rejects.toThrowError('COMMENT_USE_CASE.COMMENT_NOT_FOUND')
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadId,
      )
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
    })

    it('should orchestrating the like comment action correctly when data is not exist', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository()
      const mockCommentLikeRepository = new CommentLikeRepository()
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentLikeRepository.checkCommentLikeIsAvailable = jest.fn(() =>
        Promise.resolve(undefined),
      )
      mockCommentLikeRepository.addCommentLike = jest.fn(() =>
        Promise.resolve(commentLikeId),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentLikeRepository: mockCommentLikeRepository,
      })

      // Action
      const likedUnlikedCommentId = await commentUseCase.likeUnlikeComment({
        threadId,
        commentId,
        userId,
      })

      // Assert
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
      expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith({
        commentId,
        userId,
        isLiked: true,
      })
      expect(likedUnlikedCommentId).toStrictEqual(commentLikeId)
    })

    it('should orchestrating the like comment action correctly when data is exist', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository()
      const mockCommentLikeRepository = new CommentLikeRepository()
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentLikeRepository.checkCommentLikeIsAvailable = jest.fn(() =>
        Promise.resolve({ is_liked: true }),
      )
      mockCommentLikeRepository.putCommentLike = jest.fn(() =>
        Promise.resolve(commentLikeId),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentLikeRepository: mockCommentLikeRepository,
      })

      // Action
      const likedUnlikedCommentId = await commentUseCase.likeUnlikeComment({
        threadId,
        commentId,
        userId,
      })

      // Assert
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
      expect(mockCommentLikeRepository.putCommentLike).toBeCalledWith({
        commentId,
        userId,
        isLiked: false,
      })
      expect(likedUnlikedCommentId).toStrictEqual(commentLikeId)
    })

    it('should orchestrating the unlike comment action correctly when data is exist', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const commentLikeId = 'comment_like-123'

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository()
      const mockCommentLikeRepository = new CommentLikeRepository()
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentRepository.verifyAvailableComment = jest.fn(() =>
        Promise.resolve(),
      )
      mockCommentLikeRepository.checkCommentLikeIsAvailable = jest.fn(() =>
        Promise.resolve({ is_liked: false }),
      )
      mockCommentLikeRepository.putCommentLike = jest.fn(() =>
        Promise.resolve(commentLikeId),
      )

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentLikeRepository: mockCommentLikeRepository,
      })

      // Action
      const likedUnlikedCommentId = await commentUseCase.likeUnlikeComment({
        threadId,
        commentId,
        userId,
      })

      // Assert
      expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
        commentId,
      )
      expect(mockCommentLikeRepository.putCommentLike).toBeCalledWith({
        commentId,
        userId,
        isLiked: true,
      })
      expect(likedUnlikedCommentId).toStrictEqual(commentLikeId)
    })
  })
})
