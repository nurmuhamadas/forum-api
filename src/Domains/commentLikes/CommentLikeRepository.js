class CommentLikeRepository {
  async addCommentLike({ commentId, userId, isLiked }) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async putCommentLike({ commentId, userId, isLiked }) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkCommentLikeIsAvailable({ commentId, userId }) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentLikesByCommentIds(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentLikeRepository
