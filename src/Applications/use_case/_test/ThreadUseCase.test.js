const ThreadUseCase = require('../ThreadUseCase')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const CommentReplyRepository = require('../../../Domains/commentReplies/CommentReplyRepository')
const CommentsData = require('../../../Domains/comments/entities/CommentsData')
const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository')

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
      mockThreadRepository.addThread = jest.fn(() =>
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
    it('should throw error when no threadId given', () => {
      /** creating dependency of use case */
      const threadUseCase = new ThreadUseCase({})

      // action and assert
      expect(threadUseCase.getThread()).rejects.toThrowError(
        'THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
      )
    })

    it('should throw error when threadId is not string', () => {
      /** creating dependency of use case */
      const threadUseCase = new ThreadUseCase({})

      // action and assert
      expect(threadUseCase.getThread(123)).rejects.toThrowError(
        'THREAD_USE_CASE.NOT_MEET_DATA_SPECIFICATION',
      )
    })

    it('should throw NotFound Error if thread is not exist', () => {
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()
      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.reject(new NotFoundError('THREAD_USE_CASE.THREAD_NOT_FOUND')),
      )

      /** creating dependency of use case */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      })

      // action and assert
      expect(threadUseCase.getThread('123')).rejects.toThrowError(
        'THREAD_USE_CASE.THREAD_NOT_FOUND',
      )
    })

    it('should orchestrating the get thread action correctly', async () => {
      // Arrange
      const threadData = {
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        created_at: new Date(),
        username: 'dicoding',
      }
      const commentData = [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'dicoding',
          created_at: new Date(),
          content: 'sebuah comment',
          is_delete: false,
        },
      ]
      const commentIds = commentData.map((c) => c.id)
      const commentReplies = [
        {
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          comment_id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'dicoding',
          created_at: new Date(),
          content: 'sebuah balasan komentar',
          is_delete: false,
        },
      ]
      const commentLikes = [{ comment_id: 'comment-123', count: '1' }]
      const comments = new CommentsData({
        comments: commentData,
        replies: commentReplies,
        commentLikes,
      })
      const expectedDetailedThread = new DetailedThread(threadData, comments)

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()
      const mockCommentLikeRepository = new CommentLikeRepository()
      const mockReplyRepository = new CommentReplyRepository()
      /** mocking needed function */
      mockThreadRepository.verifyAvailableThread = jest.fn(() =>
        Promise.resolve(),
      )
      mockThreadRepository.getThread = jest.fn(() =>
        Promise.resolve(threadData),
      )
      mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
        Promise.resolve(commentData),
      )
      mockReplyRepository.getCommentRepliesByCommentIds = jest.fn(() =>
        Promise.resolve(commentReplies),
      )
      mockCommentLikeRepository.getCommentLikesByCommentIds = jest.fn(() =>
        Promise.resolve(commentLikes),
      )

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentLikeRepository: mockCommentLikeRepository,
        repliesRepository: mockReplyRepository,
      })

      // Action
      const detailedThread = await getThreadUseCase.getThread(threadData.id)

      // Assert
      expect(detailedThread).toStrictEqual(expectedDetailedThread)
      expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
        threadData.id,
      )
      expect(mockThreadRepository.getThread).toBeCalledWith(threadData.id)
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
        threadData.id,
      )
      expect(mockReplyRepository.getCommentRepliesByCommentIds).toBeCalledWith(
        commentIds,
      )
      expect(
        mockCommentLikeRepository.getCommentLikesByCommentIds,
      ).toBeCalledWith(commentIds)
    })
  })
})
