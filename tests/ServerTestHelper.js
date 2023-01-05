/* istanbul ignore file */
const Jwt = require('@hapi/jwt')
const pool = require('../src/Infrastructures/database/postgres/pool')
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager')
const UsersTableTestHelper = require('./UsersTableTestHelper')

const ServerTestHelper = {
  async getAccessToken({ username = 'dicoding', password = 'screet123' }) {
    const userId = 'user-123'
    const jwtTokenManager = new JwtTokenManager(Jwt.token)

    await UsersTableTestHelper.addUser({ id: userId, username, password })
    return await jwtTokenManager.createAccessToken({ username, id: userId })
  },

  async cleanAllTable() {
    await pool.query('TRUNCATE threads, users, authentications, comments;')
  },
}

module.exports = ServerTestHelper
