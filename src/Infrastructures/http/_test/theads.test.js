const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ServerTestHelper.cleanAllTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted user', async () => {
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
        title: 'Title',
        body: 'Thread content',
      }
      const server = await createServer(container)

      // Add user and login
      const accessToken = await ServerTestHelper.getAccessToken({})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
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
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena karakter username melebihi batas limit',
      )
    })

    // it('should response 400 when username contain restricted character', async () => {
    //   // Arrange
    //   const requestPayload = {
    //     username: 'dicoding indonesia',
    //     password: 'secret',
    //     fullname: 'Dicoding Indonesia',
    //   }
    //   const server = await createServer(container)

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/users',
    //     payload: requestPayload,
    //   })

    //   // Assert
    //   const responseJson = JSON.parse(response.payload)
    //   expect(response.statusCode).toEqual(400)
    //   expect(responseJson.status).toEqual('fail')
    //   expect(responseJson.message).toEqual(
    //     'tidak dapat membuat user baru karena username mengandung karakter terlarang',
    //   )
    // })

    // it('should response 400 when username unavailable', async () => {
    //   // Arrange
    //   await UsersTableTestHelper.addUser({ username: 'dicoding' })
    //   const requestPayload = {
    //     username: 'dicoding',
    //     fullname: 'Dicoding Indonesia',
    //     password: 'super_secret',
    //   }
    //   const server = await createServer(container)

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/users',
    //     payload: requestPayload,
    //   })

    //   // Assert
    //   const responseJson = JSON.parse(response.payload)
    //   expect(response.statusCode).toEqual(400)
    //   expect(responseJson.status).toEqual('fail')
    //   expect(responseJson.message).toEqual('username tidak tersedia')
    // })
  })
})
