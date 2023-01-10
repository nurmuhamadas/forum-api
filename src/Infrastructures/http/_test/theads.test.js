const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

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
      expect(responseJson.message).toEqual('thread tidak ditemukan')
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
})
