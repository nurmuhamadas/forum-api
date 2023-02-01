/* istanbul ignore file */
const Jwt = require('@hapi/jwt')
const pool = require('../src/Infrastructures/database/postgres/pool')
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager')
const UsersTableTestHelper = require('./UsersTableTestHelper')

const ServerTestHelper = {
  async getAccessToken({
    userId = 'user-123',
    username = 'dicoding',
    password = 'screet123',
  }) {
    const jwtTokenManager = new JwtTokenManager(Jwt.token)

    await UsersTableTestHelper.addUser({ id: userId, username, password })
    return jwtTokenManager.createAccessToken({ username, id: userId })
  },

  async cleanAllTable() {
    await pool.query(
      'TRUNCATE threads, users, authentications, comments, comment_replies, comment_likes;',
    )
  },
}

module.exports = ServerTestHelper
