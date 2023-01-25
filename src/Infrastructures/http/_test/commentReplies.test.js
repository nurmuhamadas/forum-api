const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const { ERROR_MESSAGE } = require('../../../Commons/consts')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ServerTestHelper.cleanAllTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    let accessToken = ''
    beforeEach(async () => {
      // Add user and login
      accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment replies',
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/wrong-id/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.threadNotFound)
    })

    it('should response 404 when comment is not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment replies',
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/wrong-id/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.commentNotFound)
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        ERROR_MESSAGE.commentReplyPayloadMissingSpec,
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        ERROR_MESSAGE.commentReplyPayloadNotMatchSpec,
      )
    })

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content of the comment reply',
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    let accessToken = ''
    beforeEach(async () => {
      // Add user and login
      accessToken = await ServerTestHelper.getAccessToken({})
      // Add needed data
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await CommentRepliesTableTestHelper.addCommentReply({})
    })

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/wrong-id/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.threadNotFound)
    })

    it('should response 404 when comment is not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/wrong-id/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.commentNotFound)
    })

    it('should response 404 when comment reply is not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/wrong-id',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.commentReplyNotFound)
    })

    it('should response 403 when user is not comment reply owner', async () => {
      // Arrange
      const server = await createServer(container)
      const accessTokenOtherUser = await ServerTestHelper.getAccessToken({
        username: 'user New',
        userId: 'user-321',
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessTokenOtherUser}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.haveNotAccess)
    })

    it('should response 200 and soft delete comment reply', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
