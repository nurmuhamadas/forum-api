const ThreadRepository = require('../ThreadRepository')

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository()

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(
      threadRepository.verifyAvailableThread({}),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadRepository.addComment({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(threadRepository.getThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(threadRepository.deleteComment(1)).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(
      threadRepository.verifyAvailableComment(1),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      threadRepository.verifyCommentOwner(1, 1),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      threadRepository.verifyAvailableCommentReply(1),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      threadRepository.verifyCommentReplyOwner(1, 1),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadRepository.addCommentReply({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(threadRepository.deleteCommentReply(1)).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
  })
})
