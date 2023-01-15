const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const { ERROR_MESSAGE } = require('../../../Commons/consts')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ServerTestHelper.cleanAllTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Title',
        body: 'Thread content',
      }

      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'Thread content',
      }
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap',
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: true,
        body: {},
      }
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      )
    })

    it('should response 400 when title more than 150 character', async () => {
      // Arrange
      const requestPayload = {
        title:
          'dicodingindonesia123dicodingindonesia123dicodingindonesia123dicodingindonesia123dicodingindonesia123dicodingindonesia123dicodingindonesia123dicodingindonesia123',
        body: 'Thread content',
      }
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena karakter title melebihi batas limit',
      )
    })
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
      const requestPayload = {}
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})
      // Add thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-111/comments',
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

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 with correct data', async () => {
      // Arrange
      const threadData = {
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: new Date(),
        username: 'dicoding',
      }
      const commentData = {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
      }

      const server = await createServer(container)

      // Add user, thread and comment
      await UsersTableTestHelper.addUser({ username: threadData.username })
      await ThreadsTableTestHelper.addThread({
        id: threadData.id,
        body: threadData.body,
        title: threadData.title,
      })
      await CommentsTableTestHelper.addComment({
        id: commentData.id,
        threadId: threadData.id,
        content: commentData.content,
      })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadData.id}`,
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
      expect(responseJson.data.thread.id).toEqual(threadData.id)
      expect(responseJson.data.thread.body).toEqual(threadData.body)
      expect(responseJson.data.thread.title).toEqual(threadData.title)
      expect(responseJson.data.thread.username).toEqual(threadData.username)
      expect(responseJson.data.thread.comments).toHaveLength(1)
      expect(responseJson.data.thread.comments[0].id).toEqual(commentData.id)
      expect(responseJson.data.thread.comments[0].content).toEqual(
        commentData.content,
      )
      expect(responseJson.data.thread.comments[0].username).toEqual(
        commentData.username,
      )
    })
  })
})
