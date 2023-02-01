const CommentReplyRepository = require('../CommentReplyRepository')

describe('CommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentReplyRepository = new CommentReplyRepository()

    // Action and Assert
    await expect(
      commentReplyRepository.verifyAvailableCommentReply(1),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      commentReplyRepository.verifyCommentReplyOwner(1, 1),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      commentReplyRepository.addCommentReply({}),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      commentReplyRepository.deleteCommentReply(1),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      commentReplyRepository.getCommentRepliesByCommentIds([]),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
