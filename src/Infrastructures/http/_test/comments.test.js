const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const { ERROR_MESSAGE } = require('../../../Commons/consts')
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper')

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ServerTestHelper.cleanAllTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content of the comment',
      }

      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'content of the thread',
      }
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/wrong-id/comments',
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

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
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
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak lengkap',
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      }
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
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
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      )
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    let accessToken = ''
    beforeEach(async () => {
      // Add user and login
      accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123' })
    })

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/wrongid/comments/comment-123',
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
        url: '/threads/thread-123/comments/wrongid',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.commentNotFound)
    })

    it('should response 403 when user is not comment owner', async () => {
      // Arrange
      const server = await createServer(container)
      const accessTokenOtherUser = await ServerTestHelper.getAccessToken({
        username: 'user New',
        userId: 'user-321',
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessTokenOtherUser}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.haveNotAccess)
    })

    it('should response 200 and delete comment', async () => {
      // Arrange
      const commentId = 'comment-123'
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/${commentId}`,
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

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    let accessToken = ''
    beforeEach(async () => {
      // Add user and login
      accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123' })
    })

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/wrongid/comments/comment-123/likes',
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
        method: 'PUT',
        url: '/threads/thread-123/comments/wrongid/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(ERROR_MESSAGE.commentNotFound)
    })

    it('should response 200 and like comment', async () => {
      // Arrange
      const commentId = 'comment-123'
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/thread-123/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 200 and unlike comment', async () => {
      // Arrange
      const commentId = 'comment-123'
      const server = await createServer(container)

      // Action
      await CommentLikesTableTestHelper.addCommentLike({ isLiked: true })
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/thread-123/comments/${commentId}/likes`,
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
