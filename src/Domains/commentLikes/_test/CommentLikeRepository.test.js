const CommentLikeRepository = require('../CommentLikeRepository')

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository()

    // Action and Assert
    await expect(commentLikeRepository.addCommentLike({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(commentLikeRepository.putCommentLike({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    )
    await expect(
      commentLikeRepository.checkCommentLikeIsAvailable({}),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      commentLikeRepository.getCommentLikesByCommentIds([1]),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
